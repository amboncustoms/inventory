import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .delete(async (req, res) => {
    const { id } = req.query;
    const { role } = req.user;
    try {
      if (role !== 'KSBU') {
        throw new Error('FORBIDDEN');
      }
      const notif = await prisma.notif.findUnique({
        where: {
          id: id as string,
        },
      });
      const deleteNotifcart = prisma.adjustment.deleteMany({
        where: {
          notifId: (await notif).id,
        },
      });

      const deleteNotif = prisma.notif.deleteMany({
        where: {
          id: (await notif).id,
        },
      });
      await prisma.$transaction([deleteNotifcart, deleteNotif]);

      return res.json({ message: 'Notif with status rejected deleted' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
