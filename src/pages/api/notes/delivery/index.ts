import handler from '@src/helpers/handler';
import prisma from 'db';

export default handler().get(async (_, res) => {
  try {
    const deliveryNotes = await prisma.deliveryNote.findMany();
    res.json(deliveryNotes);
  } catch (error) {
    res.status(500).json(error);
  }
});
