import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .get(async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
      const products = await prisma.product.findMany({
        where: {
          createdAt: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
        },
        select: {
          id: true,
          name: true,
          code: true,
          latestQuantity: true,
          description: true,
          category: {
            select: {
              title: true,
            },
          },
          stocks: {
            select: {
              createdAt: true,
              price: true,
              description: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      const customProduct = products.map((product) => {
        const latestProduct =
          product.stocks.length === 0 ? null : product.stocks.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
        return {
          id: product.id,
          name: product.name,
          code: product.code,
          category: product.category.title,
          productDesc: product.description,
          stockDesc: latestProduct ? latestProduct.description : product.description || '',
          latestQuantity: product.latestQuantity,
          price: latestProduct ? latestProduct.price : 0,
        };
      });
      return res.json(customProduct);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
