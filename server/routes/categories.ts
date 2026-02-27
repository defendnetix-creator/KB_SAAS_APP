import express from 'express';
import prisma from '../config/db.ts';
import { authenticate, authorize } from '../middleware/auth.ts';

const router = express.Router();

router.get('/', authenticate, async (req: any, res) => {
  try {
    console.log(`Fetching categories for org: ${req.user.orgId}`);
    const categories = await prisma.category.findMany({
      where: { 
        organizationId: req.user.orgId,
        isDeleted: false 
      },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    });
    console.log(`Found ${categories.length} categories`);
    res.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error.message);
    let errorMessage = 'Server error';
    if (error.message.includes('Can\'t reach database server')) {
      errorMessage = 'Database server is not reachable. Please check your DATABASE_URL.';
    } else if (error.message.includes('does not exist')) {
      errorMessage = 'Database tables are missing. Please run "npx prisma db push".';
    }
    res.status(500).json({ message: errorMessage, error: error.message });
  }
});

router.post('/', authenticate, authorize(['ADMIN']), async (req: any, res) => {
  const { name, description, icon } = req.body;
  
  if (!req.user.orgId) {
    console.error('Category creation failed: No organization ID found in user session');
    return res.status(400).json({ message: 'User session missing organization context' });
  }

  try {
    console.log(`Creating category "${name}" for org ${req.user.orgId}`);
    const category = await prisma.category.create({
      data: {
        name,
        description,
        icon,
        organizationId: req.user.orgId
      }
    });
    res.json(category);
  } catch (error: any) {
    console.error('Error creating category:', error.message);
    let errorMessage = 'Server error';
    if (error.message.includes('Can\'t reach database server')) {
      errorMessage = 'Database server is not reachable. Please check your DATABASE_URL.';
    } else if (error.code === 'P2002') {
      errorMessage = 'A category with this name already exists.';
    }
    res.status(500).json({ message: errorMessage, error: error.message });
  }
});

// Update category
router.put('/:id', authenticate, authorize(['ADMIN']), async (req: any, res) => {
  const { name, description, icon, status } = req.body;
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { name, description, icon, status }
    });
    res.json(category);
  } catch (error: any) {
    console.error('Error updating category:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete category (soft delete)
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req: any, res) => {
  try {
    await prisma.category.update({
      where: { id: req.params.id },
      data: { isDeleted: true }
    });
    res.json({ message: 'Category deleted' });
  } catch (error: any) {
    console.error('Error deleting category:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
