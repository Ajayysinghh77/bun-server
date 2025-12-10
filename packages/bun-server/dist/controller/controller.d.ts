import 'reflect-metadata';
import { Container } from '../di/container';
import type { Constructor } from '@/core/types';
/**
 * 控制器元数据键
 */
export declare const CONTROLLER_METADATA_KEY: unique symbol;
/**
 * 控制器元数据
 */
export interface ControllerMetadata {
    /**
     * 基础路径
     */
    path: string;
    /**
     * 控制器类
     */
    target: new (...args: unknown[]) => unknown;
}
/**
 * Controller 装饰器
 * 标记类为控制器，并指定基础路径
 * @param path - 控制器基础路径
 */
export declare function Controller(path?: string): (target: Constructor<unknown>) => void;
/**
 * 控制器注册表
 * 管理所有控制器及其路由
 */
export declare class ControllerRegistry {
    private static instance;
    private readonly container;
    private readonly controllers;
    private readonly controllerContainers;
    private constructor();
    /**
     * 获取单例实例
     */
    static getInstance(): ControllerRegistry;
    /**
     * 注册控制器
     * @param controllerClass - 控制器类
     */
    register(controllerClass: Constructor<unknown>, container?: Container): void;
    /**
     * 组合路径
     * @param basePath - 基础路径
     * @param methodPath - 方法路径
     * @returns 组合后的路径
     */
    private combinePaths;
    /**
     * 获取 DI 容器
     * @returns DI 容器
     */
    getContainer(): Container;
    /**
     * 获取所有已注册的控制器类
     * @returns 控制器类数组
     */
    getRegisteredControllers(): Constructor<unknown>[];
    /**
     * 清除所有控制器注册和容器状态（主要用于测试）
     */
    clear(): void;
}
//# sourceMappingURL=controller.d.ts.map