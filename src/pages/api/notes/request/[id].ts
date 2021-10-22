import handler from '@src/helpers/handler';
import prisma from 'db';

export default handler().get(async (req, res) => {
  const { id } = req.query;
  try {
    const request = await prisma.requestNote.findUnique({
      where: {
        id: id as string,
      },
    });
    res.json(request);
  } catch (error) {
    res.status(500).json(error);
  }
});
