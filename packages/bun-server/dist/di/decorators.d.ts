import "reflect-metadata";
import { type DependencyMetadata, Lifecycle } from "./types";
import type { Constructor } from "@/core/types";
/**
 * Injectable 装饰器
 * 标记类为可注入的
 * @param config - 提供者配置
 */
export declare function Injectable(config?: {
    lifecycle?: Lifecycle;
}): (target: Constructor<unknown>) => void;
/**
 * Inject 装饰器
 * 标记需要注入的依赖
 * @param token - 依赖标识符（可选，默认使用参数类型）
 */
export declare function Inject(token?: Constructor<unknown> | string | symbol): ParameterDecorator;
/**
 * 获取依赖元数据
 * @param target - 目标类或原型
 * @returns 依赖元数据数组
 */
export declare function getDependencyMetadata(target: unknown): DependencyMetadata[];
/**
 * 检查类是否可注入
 * @param target - 目标类
 * @returns 是否可注入
 */
export declare function isInjectable(target: Constructor<unknown>): boolean;
/**
 * 获取类的生命周期配置
 * @param target - 目标类
 * @returns 生命周期
 */
export declare function getLifecycle(target: Constructor<unknown>): Lifecycle | undefined;
/**
 * 获取类型引用（从 WeakMap）
 * @param constructor - 构造函数
 * @param parameterIndex - 参数索引
 * @returns 类型引用
 */
export declare function getTypeReference(constructor: Constructor<unknown>, parameterIndex: number): Constructor<unknown> | undefined;
//# sourceMappingURL=decorators.d.ts.map