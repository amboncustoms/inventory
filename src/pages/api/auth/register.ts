import { hash } from 'bcrypt';
import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';
import validate from '@src/middlewares/validate';
import { registerSchema } from '@src/utils/validation_schema';
import prisma from 'db';
import { Prisma } from '.prisma/client';

export default handler()
  .use(auth)
  .use(validate(registerSchema))
  .post(async (req, res) => {
    const { username, password, fullname, role }: Prisma.UserCreateInput = req.body;
    const { role: userRole } = req.user;
    try {
      if (userRole !== 'KSBU') {
        throw new Error('FORBIDDEN');
      }
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (!user) {
        const hashed = await hash(password, 10);
        const userCreated = await prisma.user.create({
          data: {
            username,
            password: hashed,
            fullname,
            role,
          },
        });
        if (userCreated) {
          await prisma.rule.create({
            data: {
              userId: userCreated.id,
            },
          });
          return res.json({ message: 'User telah dibuat' });
        }
      }
      return res.status(400).json({ message: 'User sudah ada' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
