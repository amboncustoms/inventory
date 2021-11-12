import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .get(async (req, res) => {
    const { id } = req.query;
    try {
      const notif = await prisma.notif.findUnique({
        where: {
          id: id as string,
        },
        include: {
          notifCarts: true,
        },
      });
      return res.json(notif.notifCarts);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
