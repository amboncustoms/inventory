import { startOfYear, endOfYear } from 'date-fns';
import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

const cat = ['alat tulis kantor', 'alat kebersihan', 'alat kendaraan', 'alat komputer', 'obat obatan'];

export default handler()
  .use(auth)
  .get(async (req, res) => {
    const { year } = req.query;
    try {
      const stockOut = await prisma.stockOut.findMany({
        where: {
          createdAt: {
            gte: startOfYear(new Date(year as string)),
            lte: endOfYear(new Date(year as string)),
          },
        },
        select: {
          id: true,
          category: true,
          quantity: true,
          createdAt: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      });

      const stockFix = stockOut.map((stock) => {
        const quantity = stockOut.filter((a) => a.category === stock.category).reduce((a, b) => a + b.quantity, 0);
        const otherQuantity = stockOut.filter((a) => !cat.includes(a.category)).reduce((a, b) => a + b.quantity, 0);
        return {
          id: stock.id,
          name: stock.product.name,
          category: stock.category,
          quantity,
          genuineQuantity: stock.quantity,
          createdAt: stock.createdAt,
          otherQuantity,
        };
      });

      const categories = await prisma.category.findMany({
        where: {
          createdAt: {
            gte: startOfYear(new Date(year as string)),
            lte: endOfYear(new Date(year as string)),
          },
        },
      });

      const stockOutTotal = await prisma.stockOut.aggregate({
        _sum: {
          quantity: true,
        },
        where: {
          createdAt: {
            gte: startOfYear(new Date(year as string)),
            lte: endOfYear(new Date(year as string)),
          },
        },
      });

      const productTotal = await prisma.product.findMany({
        where: {
          createdAt: {
            gte: startOfYear(new Date(year as string)),
            lte: endOfYear(new Date(year as string)),
          },
        },
      });

      return res.json({
        stockOut: stockFix,
        // eslint-disable-next-line no-underscore-dangle
        stockOutTotal: stockOutTotal._sum.quantity,
        productTotal: productTotal.length,
        categoryTotal: categories.length,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
