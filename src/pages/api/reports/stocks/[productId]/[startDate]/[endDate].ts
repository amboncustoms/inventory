import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .get(async (req, res) => {
    const { productId, startDate, endDate } = req.query;
    try {
      const stocksInBeforeDate = await prisma.stockIn.findMany({
        where: {
          productId: productId as string,
          createdAt: {
            lt: new Date(startDate as string),
          },
        },
        select: {
          quantity: true,
        },
      });
      const stocksOutBeforeDate = await prisma.stockOut.findMany({
        where: {
          productId: productId as string,
          createdAt: {
            lt: new Date(startDate as string),
          },
        },
        select: {
          quantity: true,
        },
      });
      const stocksInRangeDate = await prisma.stockIn.findMany({
        where: {
          productId: productId as string,
          createdAt: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
        },
        select: {
          id: true,
          quantity: true,
          createdAt: true,
          product: {
            select: {
              name: true,
              code: true,
            },
          },
        },
      });
      const stocksOutRangeDate = await prisma.stockOut.findMany({
        where: {
          productId: productId as string,
          createdAt: {
            gte: new Date(startDate as string),
            lte: new Date(endDate as string),
          },
        },
        select: {
          id: true,
          quantity: true,
          createdAt: true,
          product: {
            select: {
              name: true,
              code: true,
            },
          },
        },
      });

      const stockInQuantity = stocksInRangeDate.reduce((acc, { quantity }: { quantity: number }) => acc + quantity, 0);
      const stockOutQuantity = stocksOutRangeDate.reduce(
        (acc, { quantity }: { quantity: number }) => acc + quantity,
        0
      );
      const stockInMain = stocksInBeforeDate.reduce((acc, { quantity }: { quantity: number }) => acc + quantity, 0);
      const stockOutMain = stocksOutBeforeDate.reduce((acc, { quantity }: { quantity: number }) => acc + quantity, 0);

      return res.json({
        stocks: {
          stockIn: stocksInRangeDate.map((s) => {
            return { id: s.id, name: s.product.name, code: s.product.code, quantity: s.quantity, date: s.createdAt };
          }),
          stockOut: stocksOutRangeDate.map((s) => {
            return { id: s.id, name: s.product.name, code: s.product.code, quantity: s.quantity, date: s.createdAt };
          }),
        },
        mainStock: stockInMain - stockOutMain,
        latestStock: stockInQuantity - stockOutQuantity,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
