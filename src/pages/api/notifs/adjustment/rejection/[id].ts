import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .patch(async (req, res) => {
    const { id } = req.query;
    const { role } = req.user;
    const { note } = req.body;

    try {
      if (role !== 'KSBU') {
        throw new Error('FORBIDDEN');
      }
      const updatedNotif = await prisma.notif.update({
        where: {
          id: id as string,
        },
        data: {
          status: 'REJECTED',
          note: note || null,
        },
      });
      return res.json(updatedNotif);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
