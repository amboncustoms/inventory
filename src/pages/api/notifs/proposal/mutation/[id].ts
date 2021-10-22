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
        where: { id: id as string },
      });
      const deleteNotif = prisma.notif.delete({
        where: { id: (await notif).id },
      });
      const proposal = prisma.proposal.delete({
        where: { id: (await notif).proposalId },
      });
      await prisma.$transaction([deleteNotif, proposal]);
      return res.json({ message: 'Proposal deleted' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
