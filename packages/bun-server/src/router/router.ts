import type { Context } from '../core/context';
import { Route } from './route';
import type { HttpMethod, RouteHandler } from './types';
import type { Middleware } from '../middleware';

/**
 * 路由器类
 * 管理所有路由，提供路由注册和匹配功能
 */
export class Router {
  /**
   * 路由列表
   */
  private readonly routes: Route[] = [];
  private readonly staticRoutes = new Map<string, Route>();
  private readonly dynamicRoutes: Route[] = [];

  /**
   * 规范化路径（移除尾部斜杠，除非是根路径）
   */
  private normalizePath(path: string): string {
    if (path.length > 1 && path.endsWith('/')) {
      return path.slice(0, -1);
    }
    return path;
  }

  /**
   * 注册路由
   * @param method - HTTP 方法
   * @param path - 路由路径
   * @param handler - 路由处理器
   * @param middlewares - 中间件列表
   * @param controllerClass - 控制器类（可选）
   * @param methodName - 方法名（可选）
   */
  public register(
    method: HttpMethod,
    path: string,
    handler: RouteHandler,
    middlewares: Middleware[] = [],
    controllerClass?: new (...args: unknown[]) => unknown,
    methodName?: string,
  ): void {
    // 规范化路径
    const normalizedPath = this.normalizePath(path);
    const route = new Route(method, normalizedPath, handler, middlewares, controllerClass, methodName);
    this.routes.push(route);
    const staticKey = route.getStaticKey();
    if (staticKey) {
      this.staticRoutes.set(staticKey, route);
    } else {
      this.dynamicRoutes.push(route);
    }
  }

  /**
   * 注册 GET 路由
   * @param path - 路由路径
   * @param handler - 路由处理器
   */
  public get(path: string, handler: RouteHandler, middlewares: Middleware[] = []): void {
    this.register('GET', path, handler, middlewares);
  }

  /**
   * 注册 POST 路由
   * @param path - 路由路径
   * @param handler - 路由处理器
   */
  public post(path: string, handler: RouteHandler, middlewares: Middleware[] = []): void {
    this.register('POST', path, handler, middlewares);
  }

  /**
   * 注册 PUT 路由
   * @param path - 路由路径
   * @param handler - 路由处理器
   */
  public put(path: string, handler: RouteHandler, middlewares: Middleware[] = []): void {
    this.register('PUT', path, handler, middlewares);
  }

  /**
   * 注册 DELETE 路由
   * @param path - 路由路径
   * @param handler - 路由处理器
   */
  public delete(path: string, handler: RouteHandler, middlewares: Middleware[] = []): void {
    this.register('DELETE', path, handler, middlewares);
  }

  /**
   * 注册 PATCH 路由
   * @param path - 路由路径
   * @param handler - 路由处理器
   */
  public patch(path: string, handler: RouteHandler, middlewares: Middleware[] = []): void {
    this.register('PATCH', path, handler, middlewares);
  }

  /**
   * 查找匹配的路由
   * @param method - HTTP 方法
   * @param path - 请求路径
   * @returns 匹配的路由，如果没有找到则返回 undefined
   */
  public findRoute(method: HttpMethod, path: string): Route | undefined {
    const staticRoute = this.staticRoutes.get(`${method}:${path}`);
    if (staticRoute) {
      return staticRoute;
    }

    for (const route of this.dynamicRoutes) {
      const match = route.match(method, path);
      if (match.matched) {
        return route;
      }
    }
    return undefined;
  }

  /**
   * 预处理请求：仅匹配路由并设置路径参数 / routeHandler，但不执行处理器
   * 供安全过滤器等中间件在真正执行前基于路由元数据做鉴权
   */
  public async preHandle(context: Context): Promise<void> {
    const method = context.method as HttpMethod;
    const path = this.normalizePath(context.path);

    const route = this.findRoute(method, path);
    if (!route) {
      return;
    }

    const match = route.match(method, path);
    if (match.matched) {
      context.params = match.params;
    }

    if (route.controllerClass && route.methodName) {
      (context as any).routeHandler = {
        controller: route.controllerClass,
        method: route.methodName,
      };
    }
  }

  /**
   * 处理请求（包含路由匹配 + 执行）
   * @param context - 请求上下文
   * @returns 响应对象，如果没有匹配的路由则返回 undefined
   */
  public async handle(context: Context): Promise<Response | undefined> {
    const method = context.method as HttpMethod;
    // 规范化路径：移除尾部斜杠（除非是根路径）
    const path = this.normalizePath(context.path);

    const route = this.findRoute(method, path);

    if (!route) {
      return undefined;
    }

    return await route.execute(context);
  }

  /**
   * 获取所有路由
   * @returns 路由列表
   */
  public getRoutes(): readonly Route[] {
    return this.routes;
  }

  /**
   * 清除所有已注册路由（主要用于测试环境）
   */
  public clear(): void {
    this.routes.length = 0;
    this.dynamicRoutes.length = 0;
    this.staticRoutes.clear();
  }
}

