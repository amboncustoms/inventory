import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .post(async (req, res) => {
    const { quantity, productId, description, price } = req.body;
    const { userId, role } = req.user;
    try {
      if (role === 'USER') {
        throw new Error('FORBIDDEN');
      }

      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          category: true,
        },
      });

      const alreadyNotif = await prisma.notif.findFirst({
        where: {
          userId,
          type: 'STOCKIN',
        },
      });

      if (alreadyNotif) {
        await prisma.notifCart.create({
          data: {
            productId: product.id,
            productCode: product.code,
            productName: product.name,
            productCategory: product.category.title,
            productQuantity: quantity,
            description,
            price,
            notifId: (await alreadyNotif).id,
          },
        });
      }

      const notif = await prisma.notif.create({
        data: {
          userId,
          type: 'STOCKIN',
          description: 'Permohonan Penambahan Stok',
        },
      });

      await prisma.notifCart.create({
        data: {
          productId: product.id,
          productCode: product.code,
          productName: product.name,
          productCategory: product.category.title,
          productQuantity: quantity,
          description,
          price,
          notifId: (await notif).id,
        },
      });

      return res.json({ message: 'Notif stockin created' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
