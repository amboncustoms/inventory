import handler from '@src/helpers/handler';
import auth from '@src/middlewares/auth';

export default handler()
  .use(auth)
  .get(async (req, res) => {
    return res.json(req.user);
  });
