import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import validate from '@src/middlewares/validate';
import { categorySchema } from '@src/utils/validation_schema';
import prisma from 'db';
import { Prisma } from '.prisma/client';

export const getCat = async (_, res) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export default handler()
  .get((req, res) => getCat(req, res))
  .use(auth)
  .use(validate(categorySchema))
  .post(async (req, res) => {
    const { title }: Prisma.CategoryCreateInput = req.body;
    try {
      const category = await prisma.category.findFirst({
        where: {
          title: {
            equals: title,
            mode: 'insensitive',
          },
        },
      });
      if (!category) {
        const createdCategory = await prisma.category.create({
          data: {
            title: title.toLowerCase(),
          },
        });
        return res.json(createdCategory);
      }
      return res.status(400).json({ message: 'Kategori sudah ada' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
