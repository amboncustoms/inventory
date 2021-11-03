import { format } from 'date-fns';
import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import validate from '@src/middlewares/validate';
import { incartSchema } from '@src/utils/validation_schema';
import prisma from 'db';

interface Incart {
  products: [{ productId: string | null; incart: number | null }];
}

type Num = {
  max: number;
};

const today = format(new Date(), 'yyyyMMdd');

async function createReferenceNumber() {
  try {
    const nums = await prisma.$queryRaw<Num[]>`SELECT max(right(reference_number, 6)) FROM request_notes`;
    let n;
    nums.forEach((num) => {
      if (num.max !== null) {
        const zeroPad = (number: number, places) => String(number).padStart(places, '0');
        const finalNum = Number(num.max) + 1;
        n = zeroPad(finalNum, 6);
      } else {
        n = null;
      }
    });
    if (n != null) return `RN${today}${n}`;
    return null;
  } catch (error) {
    throw new Error(error);
  }
}

// create incart, notif dan reqNotes
export default handler()
  .use(auth)
  .use(validate(incartSchema))
  .post(async (req, res) => {
    const { products }: Incart = req.body;
    const { userId } = req.user;
    try {
      const incart = await prisma.incart.create({
        data: {
          userId,
        },
      });
      const notif = await prisma.notif.create({
        data: {
          userId,
          type: 'STOCKOUT',
        },
      });
      products.forEach(async (p) => {
        const product = await prisma.product.findUnique({
          where: { id: p.productId },
          select: {
            id: true,
            name: true,
            code: true,
            latestQuantity: true,
            category: {
              select: {
                title: true,
              },
            },
          },
        });
        await prisma.incartDetail.create({
          data: {
            productId: product.id,
            productName: product.name,
            productCategory: product.category.title,
            productCode: product.code,
            productIncart: p.incart,
            productQuantity: product.latestQuantity,
            incartId: (await incart).id,
          },
        });
        await prisma.notifCart.create({
          data: {
            productCode: product.code,
            productName: product.name,
            productCategory: product.category.title,
            productQuantity: p.incart,
            notifId: (await notif).id,
          },
        });
      });
      await prisma.requestNote.create({
        data: {
          referenceNumber:
            (await createReferenceNumber()) != null ? ((await createReferenceNumber()) as string) : `RN${today}000001`,
          incartId: (await incart).id,
        },
      });
      return res.json({ message: 'Incart created' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  })
  .patch(async (req, res) => {
    const { incarts } = req.body;
    try {
      incarts.forEach(async (item) => {
        const updateIncarts = prisma.incartDetail.update({
          where: {
            id: item.id,
          },
          data: {
            productIncart: item.productIncart,
          },
        });
        await prisma.$transaction([updateIncarts]);
      });
      return res.json({ message: 'update incart success' });
    } catch (err) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  })
  .get(async (req, res) => {
    const { userId } = req.user;
    try {
      const incart = await prisma.incart.findFirst({
        where: {
          userId,
        },
        include: {
          products: true,
        },
      });

      return res.json(incart.products);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  })
  .delete(async (req, res) => {
    const { userId } = req.user;
    try {
      const incartDetail = prisma.incartDetail.deleteMany({
        where: {
          incart: {
            userId,
          },
        },
      });
      const incart = prisma.incart.deleteMany({
        where: {
          userId,
        },
      });
      await prisma.$transaction([incartDetail, incart]);
      return res.json({ message: 'Delete success' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
