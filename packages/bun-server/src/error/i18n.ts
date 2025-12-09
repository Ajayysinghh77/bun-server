import { ErrorCode, ERROR_CODE_MESSAGES } from './error-codes';

/**
 * 支持的语言
 */
export type SupportedLanguage = 'en' | 'zh-CN';

/**
 * 错误消息国际化映射
 */
const ERROR_MESSAGES_I18N: Record<SupportedLanguage, Partial<Record<ErrorCode, string>>> = {
  'en': {
    // 使用默认英文消息
    ...ERROR_CODE_MESSAGES,
  },
  'zh-CN': {
    [ErrorCode.INTERNAL_ERROR]: '服务器内部错误',
    [ErrorCode.INVALID_REQUEST]: '无效的请求',
    [ErrorCode.RESOURCE_NOT_FOUND]: '资源未找到',
    [ErrorCode.METHOD_NOT_ALLOWED]: '方法不允许',
    [ErrorCode.AUTH_REQUIRED]: '需要认证',
    [ErrorCode.AUTH_INVALID_TOKEN]: '无效的认证令牌',
    [ErrorCode.AUTH_TOKEN_EXPIRED]: '认证令牌已过期',
    [ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS]: '权限不足',
    [ErrorCode.VALIDATION_FAILED]: '验证失败',
    [ErrorCode.VALIDATION_REQUIRED_FIELD]: '必填字段缺失',
    [ErrorCode.VALIDATION_INVALID_FORMAT]: '格式无效',
    [ErrorCode.VALIDATION_OUT_OF_RANGE]: '值超出范围',
    [ErrorCode.OAUTH2_INVALID_CLIENT]: '无效的客户端',
    [ErrorCode.OAUTH2_INVALID_GRANT]: '无效的授权',
    [ErrorCode.OAUTH2_INVALID_SCOPE]: '无效的作用域',
    [ErrorCode.OAUTH2_INVALID_REDIRECT_URI]: '无效的重定向 URI',
    [ErrorCode.OAUTH2_UNSUPPORTED_GRANT_TYPE]: '不支持的授权类型',
  },
};

/**
 * 错误消息国际化服务
 */
export class ErrorMessageI18n {
  private static currentLanguage: SupportedLanguage = 'en';

  /**
   * 设置当前语言
   */
  public static setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
  }

  /**
   * 获取当前语言
   */
  public static getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  /**
   * 获取错误消息（国际化）
   */
  public static getMessage(code: ErrorCode, language?: SupportedLanguage): string {
    const lang = language || this.currentLanguage;
    const messages = ERROR_MESSAGES_I18N[lang];
    return messages?.[code] || ERROR_CODE_MESSAGES[code] || 'Internal Server Error';
  }

  /**
   * 从 Accept-Language 头解析语言
   */
  public static parseLanguageFromHeader(acceptLanguage?: string | null): SupportedLanguage {
    if (!acceptLanguage) {
      return 'en';
    }

    // 简单的语言解析：查找 zh-CN 或 zh，否则返回 en
    if (acceptLanguage.includes('zh-CN') || acceptLanguage.includes('zh')) {
      return 'zh-CN';
    }

    return 'en';
  }
}

