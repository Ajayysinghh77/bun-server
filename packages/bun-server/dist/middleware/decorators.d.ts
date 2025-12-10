import 'reflect-metadata';
import type { Middleware } from './middleware';
import { type RateLimitOptions } from './builtin/rate-limit';
/**
 * UseMiddleware 装饰器
 * 可用于控制器类或方法
 * @param middlewares - 中间件列表
 */
export declare function UseMiddleware(...middlewares: Middleware[]): ClassDecorator & MethodDecorator;
/**
 * RateLimit 装饰器
 * 用于在控制器方法上应用速率限制
 * @param options - 速率限制选项
 */
export declare function RateLimit(options: RateLimitOptions): MethodDecorator;
/**
 * 获取类级中间件
 * @param constructor - 控制器构造函数
 * @returns 中间件列表
 */
export declare function getClassMiddlewares(constructor: new (...args: unknown[]) => unknown): Middleware[];
/**
 * 获取方法级中间件
 * @param target - 控制器原型
 * @param propertyKey - 方法名
 * @returns 中间件列表
 */
export declare function getMethodMiddlewares(target: object, propertyKey: string | symbol): Middleware[];
//# sourceMappingURL=decorators.d.ts.map