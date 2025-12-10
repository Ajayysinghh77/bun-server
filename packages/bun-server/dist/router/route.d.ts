import type { Context } from '../core/context';
import type { HttpMethod, RouteHandler, RouteMatch } from './types';
import type { Middleware } from '../middleware';
/**
 * 路由类
 * 表示一个路由定义
 */
export declare class Route {
    /**
     * HTTP 方法
     */
    readonly method: HttpMethod;
    /**
     * 路由路径（支持参数，如 /users/:id）
     */
    readonly path: string;
    /**
     * 路由处理器
     */
    readonly handler: RouteHandler;
    /**
     * 控制器类（可选，用于控制器路由）
     */
    readonly controllerClass?: new (...args: unknown[]) => unknown;
    /**
     * 方法名（可选，用于控制器路由）
     */
    readonly methodName?: string;
    /**
     * 路径模式（用于匹配）
     */
    private readonly pattern;
    /**
     * 路径参数名列表
     */
    private readonly paramNames;
    private readonly middlewarePipeline;
    private readonly staticKey?;
    readonly isStatic: boolean;
    constructor(method: HttpMethod, path: string, handler: RouteHandler, middlewares?: Middleware[], controllerClass?: new (...args: unknown[]) => unknown, methodName?: string);
    /**
     * 解析路径，生成匹配模式和参数名列表
     * @param path - 路由路径
     * @returns 匹配模式和参数名列表
     */
    private parsePath;
    /**
     * 匹配路由
     * @param method - HTTP 方法
     * @param path - 请求路径
     * @returns 匹配结果
     */
    match(method: HttpMethod, path: string): RouteMatch;
    /**
     * 执行路由处理器
     * @param context - 请求上下文
     * @returns 响应对象
     */
    execute(context: Context): Promise<Response>;
    /**
     * 获取静态路由缓存 key
     */
    getStaticKey(): string | undefined;
}
//# sourceMappingURL=route.d.ts.map