import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .get(async (req, res) => {
    const { role, userId } = req.user;
    let notif;

    try {
      if (role === 'KSBU') {
        const firstNotif = await prisma.notif.findMany({
          where: {
            OR: [{ status: 'NOTHING' }, { status: 'PURE' }],
          },
        });
        const secondNotif = await prisma.notif.findMany({
          where: {
            NOT: {
              status: 'NOTHING',
            },
            type: 'STOCKOUT',
            userId,
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
            ],
          },
        });
        const secondNotif = await prisma.notif.findMany({
          where: {
            NOT: {
              status: 'NOTHING',
            },
            type: 'STOCKOUT',
            userId,
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
        });
      }
      return res.json(await notif);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });

/**
 * TODO : fix notification workflow
 * TODO : atur notifikasi untuk langsung dibuat ketika data tertentu dibuat (product, proposal, adjustment)
 *        TODO : Buat notifikasi ketika usulan penambahan product oleh RT, jadi buat notifikasi dulu baru buat product ✔
 *        TODO : Buat proposal dulu dan otomatis membuat notifikasi ke KSBU
 *        TODO : Buat adjusment dulu baru otomatis membuat notifikasi ke KSBU
 * TODO : migrate
 * TODO : testing api
 *
 */
