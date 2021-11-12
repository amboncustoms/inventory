import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .get(async (_, res) => {
    try {
      const stocks = await prisma.stock.findMany({
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });
      const fixStocks = stocks.map((stock) => {
        return {
          id: stock.id,
          name: stock.product.name,
          code: stock.product.code,
          category: stock.product.category.title,
          price: stock.price,
          quantity: stock.quantity,
          stockDesc: stock.description,
          productDesc: stock.product.description,
          createdAt: stock.createdAt,
        };
      });
      return res.json(fixStocks);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
