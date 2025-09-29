import { Router, Request, Response } from 'express';

const router = Router();

// Get products
router.get('/products', (req: Request, res: Response) => {
  try {
    // Mock response
    res.json({
      success: true,
      products: [
        {
          id: '1',
          name: 'Test Product',
          description: 'Test product description',
          price: 29.99,
          category: 'electronics',
          seller: {
            id: '1',
            username: 'seller',
            fullName: 'Seller User',
            avatar: 'https://example.com/avatar.jpg',
          },
          images: ['https://example.com/product1.jpg'],
          createdAt: new Date().toISOString(),
        },
      ],
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

// Get product by ID
router.get('/products/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Mock response
    res.json({
      success: true,
      product: {
        id,
        name: 'Test Product',
        description: 'Test product description',
        price: 29.99,
        category: 'electronics',
        seller: {
          id: '1',
          username: 'seller',
          fullName: 'Seller User',
          avatar: 'https://example.com/avatar.jpg',
        },
        images: ['https://example.com/product1.jpg'],
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
});

export default router;