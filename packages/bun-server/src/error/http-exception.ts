import { ErrorCode, ERROR_CODE_MESSAGES, ERROR_CODE_TO_STATUS } from './error-codes';

/**
 * HTTP 异常基类
 */
export class HttpException extends Error {
  public readonly status: number;
  public readonly code?: ErrorCode;
  public readonly details?: unknown;

  public constructor(
    status: number,
    message: string,
    details?: unknown,
    code?: ErrorCode,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.details = details;
  }

  /**
   * 创建带错误码的异常
   */
  public static withCode(
    code: ErrorCode,
    message?: string,
    details?: unknown,
  ): HttpException {
    const status = ERROR_CODE_TO_STATUS[code] || 500;
    const finalMessage = message || ERROR_CODE_MESSAGES[code] || 'Internal Server Error';
    return new HttpException(status, finalMessage, details, code);
  }
}

export class BadRequestException extends HttpException {
  public constructor(
    message: string = 'Bad Request',
    details?: unknown,
    code?: ErrorCode,
  ) {
    super(400, message, details, code);
  }
}

export class UnauthorizedException extends HttpException {
  public constructor(
    message: string = 'Unauthorized',
    details?: unknown,
    code?: ErrorCode,
  ) {
    super(401, message, details, code);
  }
}

export class ForbiddenException extends HttpException {
  public constructor(
    message: string = 'Forbidden',
    details?: unknown,
    code?: ErrorCode,
  ) {
    super(403, message, details, code);
  }
}

export class NotFoundException extends HttpException {
  public constructor(
    message: string = 'Not Found',
    details?: unknown,
    code?: ErrorCode,
  ) {
    super(404, message, details, code);
  }
}

export class InternalServerErrorException extends HttpException {
  public constructor(
    message: string = 'Internal Server Error',
    details?: unknown,
    code?: ErrorCode,
  ) {
    super(500, message, details, code);
  }
}


