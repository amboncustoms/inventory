import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import prisma from 'db';

export default handler()
  .use(auth)
  .get(async (req, res) => {
    const { productId } = req.query;
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: productId as string,
        },
        select: {
          id: true,
          name: true,
          code: true,
          latestQuantity: true,
          description: true,
          category: {
            select: {
              title: true,
            },
          },
          stocks: {
            select: {
              createdAt: true,
              price: true,
              description: true,
            },
          },
        },
      });
      const latestProduct = product.stocks.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
      return res.json({
        id: product.id,
        name: product.name,
        code: product.code,
        category: product.category.title,
        productDesc: product.description,
        stockDesc: latestProduct.description,
        latestQuantity: product.latestQuantity,
        price: latestProduct.price,
      });
    } catch (err) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
