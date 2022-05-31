import { ErrorCode } from './error.code';

export class ErrorException extends Error {
    public status: number = 500;
    public metaData: any = null;
    constructor(code: string = ErrorCode.InternalServerError, metaData: any = null) {
        super(code);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = code;
        this.status = 500;
        this.metaData = metaData;
        switch (code) {
            case ErrorCode.Forbidden:
                this.status = 403;
                break;
            case ErrorCode.NotFound:
                this.status = 404;
                break;
            case ErrorCode.UnprocessableEntity:
                this.status = 422;
                break;
            default:
                this.status = 500;
                break;
        }
    }
}