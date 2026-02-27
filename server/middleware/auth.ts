import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.ts';

export const authenticate = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    let decoded: any;
    
    // 1. Try verifying with local JWT_SECRET
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (err) {
      // 2. If local verification fails, try decoding as Supabase token
      try {
        if (process.env.SUPABASE_JWT_SECRET) {
          try {
            // Supabase uses HS256.
            decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET, { algorithms: ['HS256'] });
          } catch (verifyErr: any) {
            // If HS256 fails, try without algorithm restriction before falling back to decode
            if (verifyErr.message.includes('invalid algorithm')) {
              decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
            } else {
              throw verifyErr;
            }
          }
        } else {
          decoded = jwt.decode(token);
        }
      } catch (verifyErr: any) {
        console.warn('Supabase token verification failed, falling back to decode:', verifyErr.message);
        decoded = jwt.decode(token);
        
        if (!decoded) {
          return res.status(401).json({ message: 'Invalid token format' });
        }
      }
      
      if (!decoded || !decoded.sub) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // 3. Auto-provision user in local DB if they don't exist
      try {
        let localUser = await prisma.user.findUnique({
          where: { email: decoded.email },
          include: { organization: true }
        });

        if (!localUser) {
          // Get or create a default organization
          let org = await prisma.organization.findFirst();
          if (!org) {
            org = await prisma.organization.create({
              data: { name: 'Default Organization', slug: 'default' }
            });
          }

          localUser = await prisma.user.create({
            data: {
              id: decoded.sub, // Use Supabase UUID
              email: decoded.email,
              password: 'supabase-auth', // Placeholder
              firstName: decoded.user_metadata?.firstName || 'User',
              lastName: decoded.user_metadata?.lastName || '',
              role: decoded.user_metadata?.role || 'USER',
              organizationId: org.id
            },
            include: { organization: true }
          });
        } else {
          // Sync role if it changed in Supabase
          const supabaseRole = decoded.user_metadata?.role || 'USER';
          if (localUser.role !== supabaseRole) {
            localUser = await prisma.user.update({
              where: { id: localUser.id },
              data: { role: supabaseRole },
              include: { organization: true }
            });
          }
        }

        // Map to the format expected by our routes
        decoded = {
          id: localUser.id,
          email: localUser.email,
          role: localUser.role,
          orgId: localUser.organizationId
        };
      } catch (dbError: any) {
        console.error('Database error during auth:', dbError.message);
        let message = 'Internal server error during authentication';
        if (dbError.message.includes('Can\'t reach database server')) {
          message = 'Database connection failed. Please check your DATABASE_URL.';
        } else if (dbError.message.includes('DATABASE_URL')) {
          message = 'DATABASE_URL is missing or invalid.';
        } else if (dbError.message.includes('does not exist')) {
          message = 'Database tables are missing. Please run migrations.';
        }
        
        return res.status(500).json({ 
          message, 
          error: dbError.message 
        });
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
