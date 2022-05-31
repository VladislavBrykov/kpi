import { NextFunction, Request, Response } from 'express';
import { searchUserByEmailPassword } from '../services/aws.service';
import { accessUser } from '../services/auth.service';
import { AuthParameters } from '../interfaces/auth.parameters';
import { ErrorException } from '../../exceptions/error.exception';
import { ErrorCode } from '../../exceptions/error.code';
import * as awsService from '../services/aws.service';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password }: AuthParameters = req.body;
    const tokens = await searchUserByEmailPassword(username, password);
    if (tokens != undefined) {
      const root: boolean = await accessUser(tokens!.AccessToken!);
      if (root) {
        return res.status(200).send({
          message: "Login Successful",
          AccessToken: tokens.AccessToken,
          RefreshToken: tokens.RefreshToken,
        });
      } else {
        throw new ErrorException(ErrorCode.NotFound);
      }
    } else {
      console.log("Cognito user not found");
      throw new ErrorException(ErrorCode.NotFound);
    }
  } catch (err) {
    next(err);
  }
};

export const initiateAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken: string = req.headers.authorization!;
    const token = await awsService.initiateAuth(refreshToken);
    if (!token || !refreshToken) {
      return res.redirect('/sign-in');
    } else {
      return res.status(200).send({
        AccessToken: token,
        RefreshToken: refreshToken,
      });
    }
  } catch (err) {
    next(err);
  }
}

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken: string = req.headers.authorization!;
    await awsService.logout(accessToken);
    return res.redirect('/sign-in');
  } catch (err) {
    next(err);
  }
}


