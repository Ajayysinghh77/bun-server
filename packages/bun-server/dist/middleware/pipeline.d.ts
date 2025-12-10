import type { Context } from '../core/context';
import type { Middleware, NextFunction } from './middleware';
/**
 * 中间件执行管道
 */
export declare class MiddlewarePipeline {
    private readonly middlewares;
    constructor(initialMiddlewares?: Middleware[]);
    /**
     * 注册中间件
     * @param middleware - 要注册的中间件
     */
    use(middleware: Middleware): void;
    /**
     * 清空所有中间件
     */
    clear(): void;
    /**
     * 是否存在中间件
     */
    hasMiddlewares(): boolean;
    /**
     * 执行中间件管道
     * @param context - 请求上下文
     * @param finalHandler - 最终处理函数
     * @returns 响应对象
     */
    run(context: Context, finalHandler: NextFunction): Promise<Response>;
}
/**
 * 使用指定的中间件队列执行一次性管道
 * @param middlewares - 中间件数组
 * @param context - 请求上下文
 * @param finalHandler - 最终处理函数
 * @returns 响应对象
 */
export declare function runMiddlewares(middlewares: Middleware[], context: Context, finalHandler: NextFunction): Promise<Response>;
//# sourceMappingURL=pipeline.d.ts.map