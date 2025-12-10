import type { Middleware } from "../middleware";
export interface ErrorHandlerOptions {
    /**
     * 自定义错误日志函数
     */
    logger?: (error: unknown, context: {
        method: string;
        path: string;
    }) => void;
    /**
     * 是否返回详细错误信息（默认 false，用于生产环境隐藏细节）
     */
    exposeError?: boolean;
    /**
     * 默认状态码
     */
    statusCode?: number;
}
/**
 * 错误处理中间件：捕获下游异常并统一生成响应
 */
export declare function createErrorHandlingMiddleware(options?: ErrorHandlerOptions): Middleware;
//# sourceMappingURL=error-handler.d.ts.map