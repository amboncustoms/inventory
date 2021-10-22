import { startOfYear, endOfYear } from 'date-fns';
import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .get(async (req, res) => {
    const { year } = req.query;
    try {
      const stockInByMonth = await prisma.stockIn.groupBy({
        by: ['createdMonth'],
        _sum: {
          quantity: true,
        },
        where: {
          createdAt: {
            gte: startOfYear(new Date(year as string)),
            lte: endOfYear(new Date(year as string)),
          },
        },
      });

      const stockInByCategory = await prisma.stockIn.groupBy({
        by: ['category'],
        _sum: {
          quantity: true,
        },
        where: {
          createdAt: {
            gte: startOfYear(new Date(year as string)),
            lte: endOfYear(new Date(year as string)),
          },
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
