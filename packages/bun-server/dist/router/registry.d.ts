import { Router } from './router';
import type { HttpMethod, RouteHandler } from './types';
import type { Middleware } from '../middleware';
/**
 * 路由注册表
 * 全局路由注册表，管理所有路由
 */
export declare class RouteRegistry {
    private static instance;
    private readonly router;
    private constructor();
    /**
     * 获取单例实例
     * @returns 路由注册表实例
     */
    static getInstance(): RouteRegistry;
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
     */
    get(path: string, handler: RouteHandler, middlewares?: Middleware[]): void;
    /**
     * 注册 POST 路由
     */
    post(path: string, handler: RouteHandler, middlewares?: Middleware[]): void;
    /**
     * 注册 PUT 路由
     */
    put(path: string, handler: RouteHandler, middlewares?: Middleware[]): void;
    /**
     * 注册 DELETE 路由
     */
    delete(path: string, handler: RouteHandler, middlewares?: Middleware[]): void;
    /**
     * 注册 PATCH 路由
     */
    patch(path: string, handler: RouteHandler, middlewares?: Middleware[]): void;
    /**
     * 获取路由器实例
     * @returns 路由器实例
     */
    getRouter(): Router;
    /**
     * 清除所有路由（主要用于测试）
     */
    clear(): void;
}
//# sourceMappingURL=registry.d.ts.map