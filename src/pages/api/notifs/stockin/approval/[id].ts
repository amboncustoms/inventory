import { getMonth } from 'date-fns';
import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

const monthName = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'sep', 'okt', 'nov', 'des'];

export default handler()
  .use(auth)
  .post(async (req, res) => {
    const { id } = req.query;
    const { value: notifCarts } = req.body;
    const { role } = req.user;

    try {
      if (role !== 'KSBU') {
        throw new Error('FORBIDDEN');
      }

      notifCarts?.forEach(async (nc) => {
        const realNc = await prisma.notifCart.findUnique({
          where: {
            id: nc.id,
          },
        });

        const createdStock = await prisma.stock.create({
          data: {
            description: realNc.description || null,
            price: realNc.price,
            productId: realNc.productId,
            quantity: nc.quantity,
          },
        });

        if (createdStock) {
          const product = await prisma.product.findUnique({
            where: { id: realNc.productId },
            include: { stocks: true },
          });
          const latestQuantity = Array.from(product.stocks, (q) => q.quantity).reduce((acc, a) => acc + a);
          await prisma.product.update({
            where: {
              id: realNc.productId,
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
