import { getMonth } from 'date-fns';
import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import validate from '@src/middlewares/validate';
import { Stock, stockSchema } from '@src/utils/validation_schema';
import prisma from 'db';

const monthName = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'sep', 'okt', 'nov', 'des'];

// create stock, update product, create notif stockin
export default handler()
  .use(auth)
  .use(validate(stockSchema))
  .post(async (req, res) => {
    const { description, price, quantity, productId }: Stock = req.body;
    const { userId, role } = req.user;
    try {
      if (role === 'USER') {
        throw new Error('FORBIDDEN');
      }
      const createdStock = await prisma.stock.create({
        data: {
          description,
          price,
          productId,
          quantity,
        },
      });
      const notif = await prisma.notif.create({
        data: {
          userId,
          type: 'STOCKIN',
        },
      });
      if (createdStock) {
        const product = await prisma.product.findUnique({ where: { id: productId }, include: { stocks: true } });
        const latestQuantity = Array.from(product.stocks, (q) => q.quantity).reduce((acc, a) => acc + a);
        await prisma.product.update({
          where: {
            id: productId,
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
            description,
            userId,
            category: stock.product.category.title,
            createdMonth: monthName[getMonth(new Date())],
          },
        });
        await prisma.notifCart.create({
          data: {
            productCode: stock.product.code,
            productName: stock.product.name,
            productCategory: stock.product.category.title,
            productQuantity: stock.quantity,
            notifId: (await notif).id,
          },
        });
      }
      return res.json(createdStock);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  })
  .get(async (_, res) => {
    try {
      const stocks = await prisma.stock.findMany({
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });
      const fixStocks = stocks.map((stock) => {
        return {
          id: stock.id,
          name: stock.product.name,
          code: stock.product.code,
          category: stock.product.category.title,
          price: stock.price,
          quantity: stock.quantity,
          stockDesc: stock.description,
          productDesc: stock.product.description,
          createdAt: stock.createdAt,
        };
      });
      return res.json(fixStocks);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
