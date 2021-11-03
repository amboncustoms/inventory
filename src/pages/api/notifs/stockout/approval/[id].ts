import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .patch(async (req, res) => {
    const { id } = req.query;
    const { role } = req.user;
    const { status } = req.body;
    try {
      if (role === 'USER') {
        throw new Error('FORBIDDEN');
      }
      await prisma.notif.update({
        where: {
          id: id as string,
        },
        data: {
          status,
        },
      });
      return res.json({ message: 'Notif updated' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
