import cookie from 'cookie';
import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';

export default handler()
  .use(auth)
  .get(async (_, res) => {
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('authorization', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        expires: new Date(0),
      })
    );

    return res.status(200).json({ success: true });
  });
