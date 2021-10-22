import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .get(async (_, res) => {
    try {
      const stockOutByMonth = await prisma.stockOut.groupBy({
        by: ['createdMonth'],
        _sum: {
          quantity: true,
        },
      });

      const stockOutByCategory = await prisma.stockOut.groupBy({
        by: ['category'],
        _sum: {
          quantity: true,
        },
      });
      return res.json({
        stockOutByMonth,
        stockOutByCategory,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
