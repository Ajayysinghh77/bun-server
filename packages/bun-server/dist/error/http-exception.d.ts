import { ErrorCode } from './error-codes';
/**
 * HTTP 异常基类
 */
export declare class HttpException extends Error {
    readonly status: number;
    readonly code?: ErrorCode;
    readonly details?: unknown;
    constructor(status: number, message: string, details?: unknown, code?: ErrorCode);
    /**
     * 创建带错误码的异常
     */
    static withCode(code: ErrorCode, message?: string, details?: unknown): HttpException;
}
export declare class BadRequestException extends HttpException {
    constructor(message?: string, details?: unknown, code?: ErrorCode);
}
export declare class UnauthorizedException extends HttpException {
    constructor(message?: string, details?: unknown, code?: ErrorCode);
}
export declare class ForbiddenException extends HttpException {
    constructor(message?: string, details?: unknown, code?: ErrorCode);
}
export declare class NotFoundException extends HttpException {
    constructor(message?: string, details?: unknown, code?: ErrorCode);
}
export declare class InternalServerErrorException extends HttpException {
    constructor(message?: string, details?: unknown, code?: ErrorCode);
}
//# sourceMappingURL=http-exception.d.ts.map