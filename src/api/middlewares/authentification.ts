import { NextFunction, Request, Response } from 'express';
import { ErrorException } from '../../exceptions/error.exception';
import { ErrorCode } from '../../exceptions/error.code';
import { accessTokenVerify } from '../services/aws.service';

export const authenticationByToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('req.body in auth middleware:', req.body);
    const token = req.headers.authorization;
    if (token && (await accessTokenVerify(token))) {
      next();
    } else {
      throw new ErrorException(ErrorCode.NotFound);
    }
  } catch (err) {
    next(err);
  }
};
