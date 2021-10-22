import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import validate from '@src/middlewares/validate';
import { Proposal, proposalSchema } from '@src/utils/validation_schema';
import prisma from 'db';

export default handler()
  .use(auth)
  .use(validate(proposalSchema))
  .post(async (req, res) => {
    const { userId } = req.user;
    const { productName, quantity, description, whenNeeded }: Proposal = req.body;
    try {
      const proposal = await prisma.proposal.create({
        data: {
          productName,
          quantity,
          description: description || null,
          userId,
          whenNeeded,
        },
      });
      await prisma.notif.create({
        data: {
          type: 'PROPOSAL',
          status: 'PURE',
          userId,
          proposalId: proposal.id,
        },
      });
      return res.json({ message: 'Proposal created' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  })
  .get(async (_, res) => {
    try {
      const proposals = await prisma.proposal.findMany({
        select: {
          id: true,
          productName: true,
          quantity: true,
          description: true,
          whenNeeded: true,
          createdAt: true,
          user: {
            select: {
              fullname: true,
            },
          },
        },
      });
      const reportProposals = proposals.map((p) => {
        return {
          id: p.id,
          productName: p.productName,
          quantity: p.quantity,
          description: p.description,
          whenNeeded: p.whenNeeded,
          createdAt: p.createdAt,
          user: p.user.fullname,
        };
      });
      return res.json(reportProposals);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
