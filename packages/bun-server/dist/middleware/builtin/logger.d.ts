import type { Middleware } from "../middleware";
export interface LoggerMiddlewareOptions {
    /**
     * 自定义日志函数
     */
    logger?: (message: string, details?: Record<string, unknown>) => void;
    /**
     * 日志前缀
     */
    prefix?: string;
}
/**
 * 简单日志中间件：记录请求方法与路径
 */
export declare function createLoggerMiddleware(options?: LoggerMiddlewareOptions): Middleware;
export interface RequestLoggingOptions extends LoggerMiddlewareOptions {
    /**
     * 是否在响应头中附加请求耗时
     */
    setHeader?: boolean;
}
/**
 * 请求日志中间件：记录耗时与状态码
 */
export declare function createRequestLoggingMiddleware(options?: RequestLoggingOptions): Middleware;
//# sourceMappingURL=logger.d.ts.map