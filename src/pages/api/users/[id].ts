import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .delete(async (req, res): Promise<void> => {
    const { id } = req.query;
    const { role } = req.user;
    try {
      if (role !== 'KSBU') {
        throw new Error('FORBIDDEN!');
      }
      const deleteRule = prisma.rule.deleteMany({
        where: {
          userId: id as string,
        },
      });
      const deleteUser = prisma.user.delete({
        where: {
          id: id as string,
        },
      });
      await prisma.$transaction([deleteUser, deleteRule]);
      return res.json({ message: 'User deleted' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
