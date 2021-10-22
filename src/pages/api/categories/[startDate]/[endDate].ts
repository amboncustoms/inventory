import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .get(async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
      const categories = await prisma.category.findMany({
        where: {
          createdAt: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return res.json(categories);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
