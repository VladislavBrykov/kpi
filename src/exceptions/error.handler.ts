import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validation';
import { ErrorCode } from './error.code';
import { ErrorException } from './error.exception';
import { ErrorModel } from './error.model';

export const errorHandler = (err: Error | ValidationError, req: Request, res: Response, next: NextFunction) => {
    console.log('Error handling middleware called.');
    console.log('Path:', req.path);
    console.error('Error occurred:', err);
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err);
    }
    else if (err instanceof ErrorException) {
        return res.status(err.status).send(err);
    }
    else {
        return res.status(500).send({ code: ErrorCode.InternalServerError, status: 500 } as ErrorModel);
    }
};