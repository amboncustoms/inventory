import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .get(async (_, res) => {
    try {
      const stockInByMonth = await prisma.stockIn.groupBy({
        by: ['createdMonth'],
        _sum: {
          quantity: true,
        },
      });

      const stockInByCategory = await prisma.stockIn.groupBy({
        by: ['category'],
        _sum: {
          quantity: true,
        },
      });
      return res.json({
        stockInByMonth,
        stockInByCategory,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
