import type { Context } from '../core/context';
import { Route } from './route';
import type { HttpMethod, RouteHandler } from './types';
import type { Middleware } from '../middleware';
/**
 * 路由器类
 * 管理所有路由，提供路由注册和匹配功能
 */
export declare class Router {
    /**
     * 路由列表
     */
    private readonly routes;
    private readonly staticRoutes;
    private readonly dynamicRoutes;
    /**
     * 规范化路径（移除尾部斜杠，除非是根路径）
     */
    private normalizePath;
    /**
     * 注册路由
     * @param method - HTTP 方法
     * @param path - 路由路径
     * @param handler - 路由处理器
     * @param middlewares - 中间件列表
     * @param controllerClass - 控制器类（可选）
     * @param methodName - 方法名（可选）
     */
    register(method: HttpMethod, path: string, handler: RouteHandler, middlewares?: Middleware[], controllerClass?: new (...args: unknown[]) => unknown, methodName?: string): void;
    /**
     * 注册 GET 路由
     * @param path - 路由路径
     * @param handler - 路由处理器
     */
    get(path: string, handler: RouteHandler, middlewares?: Middleware[]): void;
    /**
     * 注册 POST 路由
     * @param path - 路由路径
     * @param handler - 路由处理器
     */
    post(path: string, handler: RouteHandler, middlewares?: Middleware[]): void;
    /**
     * 注册 PUT 路由
     * @param path - 路由路径
     * @param handler - 路由处理器
     */
    put(path: string, handler: RouteHandler, middlewares?: Middleware[]): void;
    /**
     * 注册 DELETE 路由
     * @param path - 路由路径
     * @param handler - 路由处理器
     */
    delete(path: string, handler: RouteHandler, middlewares?: Middleware[]): void;
    /**
     * 注册 PATCH 路由
     * @param path - 路由路径
     * @param handler - 路由处理器
     */
    patch(path: string, handler: RouteHandler, middlewares?: Middleware[]): void;
    /**
     * 查找匹配的路由
     * @param method - HTTP 方法
     * @param path - 请求路径
     * @returns 匹配的路由，如果没有找到则返回 undefined
     */
    findRoute(method: HttpMethod, path: string): Route | undefined;
    /**
     * 预处理请求：仅匹配路由并设置路径参数 / routeHandler，但不执行处理器
     * 供安全过滤器等中间件在真正执行前基于路由元数据做鉴权
     */
    preHandle(context: Context): Promise<void>;
    /**
     * 处理请求（包含路由匹配 + 执行）
     * @param context - 请求上下文
     * @returns 响应对象，如果没有匹配的路由则返回 undefined
     */
    handle(context: Context): Promise<Response | undefined>;
    /**
     * 获取所有路由
     * @returns 路由列表
     */
    getRoutes(): readonly Route[];
    /**
     * 清除所有已注册路由（主要用于测试环境）
     */
    clear(): void;
}
//# sourceMappingURL=router.d.ts.map