import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .get(async (req, res) => {
    const { userId } = req.query;
    try {
      const incart = await prisma.incart.findFirst({
        where: {
          userId: userId as string,
        },
        select: {
          products: true,
          user: true,
        },
      });

      return res.json({ user: incart.user, products: incart.products });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
