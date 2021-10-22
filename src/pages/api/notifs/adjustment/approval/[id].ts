import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

const updateLatestQuantity = async (productId) => {
  const product = await prisma.product.findUnique({ where: { id: productId }, include: { stocks: true } });
  const latestQuantity = await Array.from(product.stocks, (q) => q.quantity).reduce((acc, a) => acc + a);
  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      latestQuantity,
    },
  });
};

const updateStock = async (productId: string, adjustQuantity: number) => {
  let difference = 0;

  function updateDifference(substraction) {
    difference -= substraction;
  }

  function setDifferenceValue(value) {
    difference = value;
  }
  async function start() {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        stocks: true,
        category: true,
      },
    });
    const farthest2 = product.stocks
      .filter((v) => v.quantity !== 0)
      .reduce((a, b) => (a.createdAt < b.createdAt ? a : b));
    if (difference > 0) {
      if (farthest2.quantity >= difference) {
        const updated = prisma.stock.update({
          where: { id: farthest2.id },
          data: { quantity: farthest2.quantity - difference },
        });
        await prisma.$transaction([updated]).then(() => updateLatestQuantity(product.id));
        return;
      }

      updateDifference(farthest2.quantity);
      const updated = prisma.stock.update({
        where: { id: farthest2.id },
        data: { quantity: farthest2.quantity - farthest2.quantity },
      });
      await prisma.$transaction([updated]).then(() => {
        updateLatestQuantity(product.id);
        start();
      });
    }
  }
  if (difference === 0) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        stocks: true,
        category: true,
      },
    });
    const farthest1 = product.stocks
      .filter((v) => v.quantity !== 0)
      .reduce((a, b) => (a.createdAt < b.createdAt ? a : b));
    if (farthest1.quantity >= adjustQuantity) {
      const updated = prisma.stock.update({
        where: { id: farthest1.id },
        data: { quantity: farthest1.quantity - adjustQuantity },
      });
      await prisma.$transaction([updated]).then(() => updateLatestQuantity(product.id));
      return;
    }
    const updated = prisma.stock.update({
      where: { id: farthest1.id },
      data: { quantity: farthest1.quantity - farthest1.quantity },
    });
    setDifferenceValue(adjustQuantity - farthest1.quantity);
    await prisma.$transaction([updated]).then(() => {
      updateLatestQuantity(product.id);
      start();
    });
  }
};

export default handler()
  .use(auth)
  .patch(async (req, res) => {
    const { id } = req.query;
    const { role } = req.user;

    try {
      if (role !== 'KSBU') {
        throw new Error('FORBIDDEN');
      }
      const notif = await prisma.notif.findUnique({
        where: { id: id as string },
        select: {
          id: true,
          adjustment: {
            select: {
              productId: true,
              adjustQuantity: true,
            },
          },
        },
      });

      await prisma.notif.update({
        where: {
          id: notif.id,
        },
        data: {
          status: 'APPROVED',
        },
      });

      updateStock(notif.adjustment.productId, notif.adjustment.adjustQuantity);
      return res.json({ message: 'Notif updated' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
