import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .get(async (_, res): Promise<void> => {
    try {
      const users = await prisma.user.findMany();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
