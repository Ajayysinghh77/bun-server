import 'reflect-metadata';
import type { ControllerMetadata } from './controller';
import type { RouteMetadata } from '../router/decorators';
import type { Constructor } from '@/core/types';
/**
 * 获取控制器元数据
 * @param target - 控制器类
 * @returns 控制器元数据
 */
export declare function getControllerMetadata(target: Constructor<unknown>): ControllerMetadata | undefined;
/**
 * 获取路由元数据
 * @param target - 控制器原型
 * @returns 路由元数据列表
 */
export declare function getRouteMetadata(target: unknown): RouteMetadata[];
//# sourceMappingURL=metadata.d.ts.map