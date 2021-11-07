import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export const getApiNotifs = async (req, res) => {
  const { role, userId } = req.user;
  let notif;

  try {
    if (role === 'KSBU') {
      const firstNotif = await prisma.notif.findMany({
        where: {
          OR: [{ status: 'NOTHING' }, { status: 'PURE' }],
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
            },
          },
        },
      });
      const secondNotif = await prisma.notif.findMany({
        where: {
          NOT: [
            {
              status: 'NOTHING',
            },
            {
              status: 'APPROVED',
            },
          ],
          type: 'STOCKOUT',
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
            },
          },
        },
      });
      notif = firstNotif.concat(secondNotif);
    } else if (role === 'RT') {
      const firstNotif = await prisma.notif.findMany({
        where: {
          NOT: [
            {
              status: 'NOTHING',
            },
            {
              status: 'PURE',
            },
            {
              status: 'READY',
            },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
            },
          },
        },
      });
      const secondNotif = await prisma.notif.findMany({
        where: {
          NOT: [
            {
              status: 'NOTHING',
            },
            {
              status: 'APPROVED',
            },
          ],
          type: 'STOCKOUT',
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
            },
          },
        },
      });
      notif = firstNotif.concat(secondNotif);
    } else {
      notif = await prisma.notif.findMany({
        where: {
          OR: [{ status: 'READY' }, { status: 'REJECTED' }],
          type: 'STOCKOUT',
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
            },
          },
        },
      });
    }
    return res.json(await notif);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export default handler()
  .use(auth)
  .get((req, res) => getApiNotifs(req, res));
