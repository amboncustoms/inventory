import { compare } from 'bcrypt';
import cookie from 'cookie';
import { sign } from 'jsonwebtoken';
import handler from '@src/helpers/handler';
import validate from '@src/middlewares/validate';
import { Login, loginSchema } from '@src/utils/validation_schema';
import prisma from 'db';

/*
@LOGIN

*/
export default handler()
  .use(validate(loginSchema))
  .post(async (req, res): Promise<void> => {
    const { username, password }: Login = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (!user) return res.status(401).json({ message: 'Invalid Credentials' });
      const passwordMatches = await compare(password, user.password);
      if (!passwordMatches) {
        return res.status(401).json({ message: 'Invalid Credentials' });
      }

      const payload = { userId: user.id, username };
      const jwt = sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.setHeader(
        'Set-Cookie',
        cookie.serialize('authorization', jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          maxAge: 33600,
          path: '/',
        })
      );
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
