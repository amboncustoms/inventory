import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .patch(async (req, res) => {
    const { proposalId, note } = req.body;
    const { role } = req.user;
    try {
      if (role !== 'KSBU') {
        throw new Error('FORBIDDEN');
      }
      await prisma.notif.update({
        where: {
          proposalId,
        },
        data: {
          status: 'INSTRUCTION',
          note: note || null,
        },
      });
      return res.json({ message: 'Proposal updated' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
