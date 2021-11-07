import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import validate from '@src/middlewares/validate';
import { Rule, ruleSchema } from '@src/utils/validation_schema';
import prisma from 'db';

export const getApiRule = async (req, res) => {
  const { userId } = req.user;
  try {
    const rule = await prisma.rule.findFirst({
      where: {
        userId,
      },
    });
    return res.json({ activeStep: rule.activeStep, allowAddToCart: rule.allowAddToCart });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export default handler()
  .use(auth)
  .use(validate(ruleSchema))
  .patch(async (req, res) => {
    const { activeStep, allowAddToCart, userId: userIdByAdmin }: Rule = req.body;
    const { userId, role } = req.user;
    try {
      if (role !== 'USER') {
        const rule = await prisma.rule.findFirst({
          where: {
            userId: userIdByAdmin || userId,
          },
        });
        const updatedRule = await prisma.rule.update({
          where: {
            id: rule.id,
          },
          data: {
            activeStep,
            allowAddToCart,
          },
        });
        return res.json({ activeStep: updatedRule.activeStep, allowAddToCart: updatedRule.allowAddToCart });
      }
      const rule = await prisma.rule.findFirst({
        where: {
          userId,
        },
      });
      const updatedRule = await prisma.rule.update({
        where: {
          id: rule.id,
        },
        data: {
          activeStep,
          allowAddToCart,
        },
      });
      return res.json({ activeStep: updatedRule.activeStep, allowAddToCart: updatedRule.allowAddToCart });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  })
  .get((req, res) => getApiRule(req, res));
