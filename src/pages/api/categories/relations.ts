import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .get(async (_, res) => {
    try {
      const categories = await prisma.category.findMany({
        include: {
          products: {
            include: {
              stocks: {
                orderBy: {
                  createdAt: 'desc',
                },
              },
            },
          },
        },
      });
      return res.json(categories);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
