import "reflect-metadata";
import { type ProviderConfig } from "./types";
import type { Constructor } from "@/core/types";
/**
 * 依赖注入容器
 * 管理依赖的注册、解析和生命周期
 */
interface ContainerOptions {
    parent?: Container;
}
export declare class Container {
    private readonly parent?;
    constructor(options?: ContainerOptions);
    /**
     * 注册的提供者
     */
    private readonly providers;
    /**
     * 单例实例缓存
     */
    private readonly singletons;
    /**
     * 类型到 token 的映射（用于接口注入）
     */
    private readonly typeToToken;
    /**
     * 依赖计划缓存，避免重复解析反射元数据
     */
    private readonly dependencyPlans;
    /**
     * 注册提供者
     * @param token - 提供者标识符（类构造函数或 token）
     * @param config - 提供者配置
     */
    register<T>(token: Constructor<T> | string | symbol, config?: ProviderConfig): void;
    /**
     * 注册单例
     * @param token - 提供者标识符
     * @param instance - 实例对象
     */
    registerInstance<T>(token: Constructor<T> | string | symbol, instance: T): void;
    /**
     * 解析依赖
     * @param token - 提供者标识符
     * @returns 解析后的实例
     */
    resolve<T>(token: Constructor<T> | string | symbol): T;
    /**
     * 解析依赖（内部方法，支持 string | symbol token）
     * @param token - 提供者标识符
     * @returns 解析后的实例
     */
    private resolveInternal;
    /**
     * 实例化类（自动注入依赖）
     * @param constructor - 构造函数
     * @returns 实例
     */
    private instantiate;
    /**
     * 获取 token 键
     * @param token - 提供者标识符
     * @returns token 键
     */
    private getTokenKey;
    /**
     * 清除所有注册（主要用于测试）
     */
    clear(): void;
    /**
     * 检查是否已注册
     * @param token - 提供者标识符
     * @returns 是否已注册
     */
    isRegistered(token: Constructor<unknown> | string | symbol): boolean;
    private getDependencyPlan;
    private resolveFromPlan;
}
export {};
//# sourceMappingURL=container.d.ts.map