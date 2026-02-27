import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.ts';
import { authenticate } from '../middleware/auth.ts';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true }
    });

    if (!user || user.isDeleted || user.status === 'INACTIVE') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, orgId: user.organizationId },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organization: user.organization
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed route for initial setup (in a real app, this would be a proper signup flow)
router.post('/seed', async (req, res) => {
  try {
    const org = await prisma.organization.create({
      data: {
        name: 'KB Enterprise',
        slug: 'kb-enterprise'
      }
    });

    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@kb.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        organizationId: org.id
      }
    });

    const user = await prisma.user.create({
      data: {
        email: 'user@kb.com',
        password: hashedPassword,
        firstName: 'Normal',
        lastName: 'User',
        role: 'USER',
        organizationId: org.id
      }
    });

    res.json({ message: 'Seed successful', adminEmail: admin.email, userEmail: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Seed failed', error });
  }
});

// Get current user profile
router.get('/me', authenticate, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { organization: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organization: user.organization
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
