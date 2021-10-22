import handler from '@src/helpers/handler';
import prisma from 'db';

export default handler().get(async (_, res) => {
  try {
    const requestNotes = await prisma.requestNote.findMany();
    res.json(requestNotes);
  } catch (error) {
    res.status(500).json(error);
  }
});
