import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .delete(async (req, res) => {
    const { id } = req.query;
    try {
      const notif = await prisma.notif.findFirst({
        where: {
          id: id as string,
          status: 'READY',
          type: 'STOCKOUT',
        },
      });

      const deleteNotifcart = prisma.notifCart.deleteMany({
        where: {
          notifId: notif.id,
        },
      });

      const deleteNotif = prisma.notif.deleteMany({
        where: {
          id: id as string,
        },
      });
      await prisma.$transaction([deleteNotifcart, deleteNotif]);

      return res.json({ message: 'Notif with status approved deleted' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
