import express from 'express';
import prisma from '../config/db.ts';
import { authenticate, authorize } from '../middleware/auth.ts';

const router = express.Router();

// Get all articles for the organization with search
router.get('/', authenticate, async (req: any, res) => {
  const { search } = req.query;
  try {
    const where: any = { 
      organizationId: req.user.orgId,
      isDeleted: false 
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { category: { name: { contains: search } } }
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        category: true,
        author: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(articles);
  } catch (error: any) {
    console.error('Error fetching articles:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single article
router.get('/:id', authenticate, async (req: any, res) => {
  try {
    const article = await prisma.article.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user.orgId,
        isDeleted: false
      },
      include: {
        category: true,
        author: {
          select: { firstName: true, lastName: true }
        }
      }
    });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create article
router.post('/', authenticate, authorize(['ADMIN']), async (req: any, res) => {
  const { title, content, categoryId, status } = req.body;

  if (!req.user.orgId) {
    console.error('Article creation failed: No organization ID found in user session');
    return res.status(400).json({ message: 'User session missing organization context' });
  }

  try {
    const article = await prisma.article.create({
      data: {
        title,
        content,
        categoryId,
        status: status || 'PUBLISHED',
        authorId: req.user.id,
        organizationId: req.user.orgId
      }
    });
    res.json(article);
  } catch (error: any) {
    console.error('Error creating article:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update article
router.put('/:id', authenticate, authorize(['ADMIN']), async (req: any, res) => {
  const { title, content, categoryId, status } = req.body;
  try {
    const article = await prisma.article.update({
      where: { id: req.params.id },
      data: {
        title,
        content,
        categoryId,
        status
      }
    });
    res.json(article);
  } catch (error: any) {
    console.error('Error updating article:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete article (soft delete)
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req: any, res) => {
  try {
    await prisma.article.update({
      where: { id: req.params.id },
      data: { isDeleted: true }
    });
    res.json({ message: 'Article deleted' });
  } catch (error: any) {
    console.error('Error deleting article:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
