import { ErrorCode } from './error-codes';
/**
 * 支持的语言
 */
export type SupportedLanguage = 'en' | 'zh-CN';
/**
 * 错误消息国际化服务
 */
export declare class ErrorMessageI18n {
    private static currentLanguage;
    /**
     * 设置当前语言
     */
    static setLanguage(language: SupportedLanguage): void;
    /**
     * 获取当前语言
     */
    static getLanguage(): SupportedLanguage;
    /**
     * 获取错误消息（国际化）
     */
    static getMessage(code: ErrorCode, language?: SupportedLanguage): string;
    /**
     * 从 Accept-Language 头解析语言
     */
    static parseLanguageFromHeader(acceptLanguage?: string | null): SupportedLanguage;
}
//# sourceMappingURL=i18n.d.ts.map