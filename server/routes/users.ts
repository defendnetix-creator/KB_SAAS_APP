import express from 'express';
import prisma from '../config/db.ts';
import { authenticate, authorize } from '../middleware/auth.ts';

const router = express.Router();

// Get all users for the organization (Admin only)
router.get('/', authenticate, authorize(['ADMIN']), async (req: any, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { 
        organizationId: req.user.orgId,
        isDeleted: false 
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', authenticate, authorize(['ADMIN']), async (req: any, res) => {
  const { firstName, lastName, role, status } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { firstName, lastName, role, status }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (soft delete)
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req: any, res) => {
  try {
    await prisma.user.update({
      where: { id: req.params.id },
      data: { isDeleted: true }
    });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
