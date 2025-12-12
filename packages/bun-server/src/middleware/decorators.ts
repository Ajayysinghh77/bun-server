import 'reflect-metadata';
import type { Constructor } from '../core/types';
import type { Middleware } from './middleware';
import { createRateLimitMiddleware, type RateLimitOptions } from './builtin/rate-limit';

const CLASS_MIDDLEWARE_METADATA_KEY = Symbol('middleware:class');
const METHOD_MIDDLEWARE_METADATA_KEY = Symbol('middleware:method');

/**
 * 注册中间件到元数据
 * @param target - 目标对象
 * @param propertyKey - 属性键
 * @param middlewares - 中间件列表
 */
function appendMiddlewareMetadata(
  target: object,
  propertyKey: string | symbol | undefined,
  middlewares: Middleware[],
): void {
  if (!middlewares.length) {
    return;
  }

  if (propertyKey === undefined) {
    const existing = (Reflect.getMetadata(CLASS_MIDDLEWARE_METADATA_KEY, target) as Middleware[]) || [];
    Reflect.defineMetadata(CLASS_MIDDLEWARE_METADATA_KEY, existing.concat(middlewares), target);
    return;
  }

  const existing =
    (Reflect.getMetadata(METHOD_MIDDLEWARE_METADATA_KEY, target, propertyKey) as Middleware[]) || [];
  Reflect.defineMetadata(
    METHOD_MIDDLEWARE_METADATA_KEY,
    existing.concat(middlewares),
    target,
    propertyKey,
  );
}

/**
 * UseMiddleware 装饰器
 * 可用于控制器类或方法
 * @param middlewares - 中间件列表
 */
export function UseMiddleware(...middlewares: Middleware[]): ClassDecorator & MethodDecorator {
  return function (target: object, propertyKey?: string | symbol) {
    appendMiddlewareMetadata(
      propertyKey === undefined ? (target as object) : target,
      propertyKey,
      middlewares,
    );
  };
}

/**
 * RateLimit 装饰器
 * 用于在控制器方法上应用速率限制
 * @param options - 速率限制选项
 */
export function RateLimit(options: RateLimitOptions): MethodDecorator {
  return function (target: object, propertyKey: string | symbol) {
    const middleware = createRateLimitMiddleware(options);
    appendMiddlewareMetadata(target, propertyKey, [middleware]);
  };
}

/**
 * 获取类级中间件
 * @param constructor - 控制器构造函数
 * @returns 中间件列表
 */
import type { Constructor } from '../core/types';

export function getClassMiddlewares(constructor: Constructor<unknown>): Middleware[] {
  return (
    (Reflect.getMetadata(CLASS_MIDDLEWARE_METADATA_KEY, constructor) as Middleware[]) || []
  );
}

/**
 * 获取方法级中间件
 * @param target - 控制器原型
 * @param propertyKey - 方法名
 * @returns 中间件列表
 */
export function getMethodMiddlewares(
  target: object,
  propertyKey: string | symbol,
): Middleware[] {
  return (
    (Reflect.getMetadata(METHOD_MIDDLEWARE_METADATA_KEY, target, propertyKey) as Middleware[]) ||
    []
  );
}
