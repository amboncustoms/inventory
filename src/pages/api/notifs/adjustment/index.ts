import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

interface Incart {
  product: { productId: string | null; quantity: number | null; note: string | null };
}

export default handler()
  .use(auth)
  .post(async (req, res) => {
    const { product }: Incart = req.body;
    const { userId } = req.user;
    try {
      const notif = await prisma.notif.create({
        data: {
          userId,
          type: 'ADJUSTMENT',
        },
      });
      await prisma.adjustment.create({
        data: {
          productId: product.productId,
          adjustQuantity: product.quantity,
          note: product.note || null,
          notifId: (await notif).id,
        },
      });

      return res.json({ message: 'Notif created' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  })
  .get(async (_, res) => {
    try {
      const adjust = await prisma.adjustment.findMany();
      return res.json(adjust);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
