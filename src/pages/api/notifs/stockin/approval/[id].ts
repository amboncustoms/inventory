import { getMonth } from 'date-fns';
import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

const monthName = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'sep', 'okt', 'nov', 'des'];

export default handler()
  .use(auth)
  .post(async (req, res) => {
    const { id } = req.query;
    const { role } = req.user;

    try {
      if (role !== 'KSBU') {
        throw new Error('FORBIDDEN');
      }

      const notif = await prisma.notif.findFirst({
        where: { id: id as string, type: 'STOCKIN', status: 'NOTHING' },
        include: {
          notifCarts: true,
        },
      });

      notif.notifCarts.forEach(async (nc) => {
        const createdStock = await prisma.stock.create({
          data: {
            description: nc.description,
            price: nc.price,
            productId: nc.productId,
            quantity: nc.productQuantity,
          },
        });

        if (createdStock) {
          const product = await prisma.product.findUnique({ where: { id: nc.productId }, include: { stocks: true } });
          const latestQuantity = Array.from(product.stocks, (q) => q.quantity).reduce((acc, a) => acc + a);
          await prisma.product.update({
            where: {
              id: nc.productId,
            },
            data: {
              latestQuantity,
            },
          });
          const stock = await prisma.stock.findUnique({
            where: { id: createdStock.id },
            select: {
              price: true,
              quantity: true,
              description: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                  category: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
            },
          });
          await prisma.stockIn.create({
            data: {
              productId: stock.product.id,
              price: stock.price,
              quantity: stock.quantity,
              description: stock.description,
              category: stock.product.category.title,
              createdMonth: monthName[getMonth(new Date())],
            },
          });
        }
      });

      await prisma.notif.update({
        where: {
          id: id as string,
        },
        data: {
          status: 'APPROVED',
          description: 'KSBU Telah Menyetujui Pemasukan Barang',
        },
      });
      return res.json({ message: 'Notif updated' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
