import handler from '@src/helpers/handler';
// import auth from '@src/middlewares/auth';
import validate from '@src/middlewares/validate';
import { Product, productSchema } from '@src/utils/validation_schema';
import prisma from 'db';

export default handler()
  // .use(auth)
  .use(validate(productSchema))
  .post(async (req, res) => {
    const { categoryId, code, description, name }: Product = req.body;
    try {
      const product = await prisma.product.findUnique({
        where: {
          code,
        },
      });
      if (!product) {
        const createdProduct = await prisma.product.create({
          data: {
            categoryId,
            code,
            description,
            name,
          },
        });
        return res.json(createdProduct);
      }
      return res.status(400).json({ message: 'Produk sudah ada' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  })
  .get(async (_, res) => {
    try {
      const products = await prisma.product.findMany({
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
        orderBy: {
          createdAt: 'desc',
        },
      });
      const customProduct = products.map((product) => {
        const latestProduct = product.stocks.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
        return {
          id: product.id,
          name: product.name,
          code: product.code,
          category: product.category.title,
          productDesc: product.description,
          stockDesc: latestProduct.description,
          latestQuantity: product.latestQuantity,
          price: latestProduct.price,
        };
      });
      return res.json(customProduct);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
