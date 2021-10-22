// import { verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import nc, { NextConnect } from 'next-connect';

export interface NextApiRequestExtended extends NextApiRequest {
  user: {
    userId: string | null;
    username: string | null;
    fullname: string | null;
    role: string | null;
  };
}

export default function handler(): NextConnect<NextApiRequestExtended, NextApiResponse> {
  return nc<NextApiRequestExtended, NextApiResponse>({
    onError(error, _, res) {
      res.status(501).json({ error: `Sorry something happened! ${error.message}` });
    },
    onNoMatch(req, res) {
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    },
  });
}
