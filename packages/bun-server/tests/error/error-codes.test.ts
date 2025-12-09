import { describe, expect, test, beforeEach } from 'bun:test';
import {
  HttpException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
} from '../../src/error/http-exception';
import { ErrorCode, ERROR_CODE_MESSAGES, ERROR_CODE_TO_STATUS } from '../../src/error/error-codes';
import { ErrorMessageI18n } from '../../src/error/i18n';

describe('ErrorCode', () => {
  test('should have all error codes defined', () => {
    expect(ErrorCode.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
    expect(ErrorCode.AUTH_REQUIRED).toBe('AUTH_REQUIRED');
    expect(ErrorCode.VALIDATION_FAILED).toBe('VALIDATION_FAILED');
  });

  test('should have status code mapping for all error codes', () => {
    const codes = Object.values(ErrorCode);
    for (const code of codes) {
      expect(ERROR_CODE_TO_STATUS[code]).toBeDefined();
      expect(typeof ERROR_CODE_TO_STATUS[code]).toBe('number');
    }
  });

  test('should have default messages for all error codes', () => {
    const codes = Object.values(ErrorCode);
    for (const code of codes) {
      expect(ERROR_CODE_MESSAGES[code]).toBeDefined();
      expect(typeof ERROR_CODE_MESSAGES[code]).toBe('string');
    }
  });
});

describe('HttpException with ErrorCode', () => {
  test('should create exception with error code', () => {
    const exception = HttpException.withCode(
      ErrorCode.AUTH_REQUIRED,
      'Custom message',
    );

    expect(exception.code).toBe(ErrorCode.AUTH_REQUIRED);
    expect(exception.status).toBe(401);
    expect(exception.message).toBe('Custom message');
  });

  test('should use default message when not provided', () => {
    const exception = HttpException.withCode(ErrorCode.AUTH_REQUIRED);

    expect(exception.code).toBe(ErrorCode.AUTH_REQUIRED);
    expect(exception.status).toBe(401);
    expect(exception.message).toBe(ERROR_CODE_MESSAGES[ErrorCode.AUTH_REQUIRED]);
  });

  test('should support details with error code', () => {
    const details = { userId: '123', reason: 'Token expired' };
    const exception = HttpException.withCode(
      ErrorCode.AUTH_TOKEN_EXPIRED,
      undefined,
      details,
    );

    expect(exception.code).toBe(ErrorCode.AUTH_TOKEN_EXPIRED);
    expect(exception.details).toEqual(details);
  });

  test('should allow custom exception classes with error code', () => {
    const exception = new UnauthorizedException(
      'Custom message',
      { token: 'invalid' },
      ErrorCode.AUTH_INVALID_TOKEN,
    );

    expect(exception.code).toBe(ErrorCode.AUTH_INVALID_TOKEN);
    expect(exception.status).toBe(401);
    expect(exception.message).toBe('Custom message');
    expect(exception.details).toEqual({ token: 'invalid' });
  });
});

describe('ErrorMessageI18n', () => {
  beforeEach(() => {
    ErrorMessageI18n.setLanguage('en');
  });

  test('should get English message by default', () => {
    const message = ErrorMessageI18n.getMessage(ErrorCode.AUTH_REQUIRED);
    expect(message).toBe('Authentication Required');
  });

  test('should get Chinese message when language is zh-CN', () => {
    ErrorMessageI18n.setLanguage('zh-CN');
    const message = ErrorMessageI18n.getMessage(ErrorCode.AUTH_REQUIRED);
    expect(message).toBe('需要认证');
  });

  test('should parse language from Accept-Language header', () => {
    expect(ErrorMessageI18n.parseLanguageFromHeader('zh-CN,zh;q=0.9')).toBe('zh-CN');
    expect(ErrorMessageI18n.parseLanguageFromHeader('zh,en;q=0.9')).toBe('zh-CN');
    expect(ErrorMessageI18n.parseLanguageFromHeader('en-US,en;q=0.9')).toBe('en');
    expect(ErrorMessageI18n.parseLanguageFromHeader(null)).toBe('en');
    expect(ErrorMessageI18n.parseLanguageFromHeader(undefined)).toBe('en');
  });

  test('should get message for specific language', () => {
    const enMessage = ErrorMessageI18n.getMessage(ErrorCode.AUTH_REQUIRED, 'en');
    const zhMessage = ErrorMessageI18n.getMessage(ErrorCode.AUTH_REQUIRED, 'zh-CN');

    expect(enMessage).toBe('Authentication Required');
    expect(zhMessage).toBe('需要认证');
  });

  test('should fallback to English if message not found', () => {
    // 测试未定义的错误码应该回退到英文
    const message = ErrorMessageI18n.getMessage(ErrorCode.INTERNAL_ERROR, 'zh-CN');
    expect(message).toBeDefined();
  });
});

