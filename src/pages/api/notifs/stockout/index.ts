import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .delete(async (req, res) => {
    const { userId } = req.user;
    try {
      const notifs = await prisma.notif.findMany({
        where: {
          userId,
          status: 'READY',
          type: 'STOCKOUT',
        },
      });

      notifs.forEach(async (n) => {
        const deleteNotifcart = prisma.notifCart.deleteMany({
          where: {
            notifId: n.id,
          },
        });

        const deleteNotif = prisma.notif.deleteMany({
          where: {
            id: n.id,
          },
        });
        await prisma.$transaction([deleteNotifcart, deleteNotif]);
      });
      return res.json({ message: 'Notif with status approved deleted' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
