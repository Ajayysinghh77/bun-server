import { BunServer } from './server';
import type { Middleware } from '../middleware';
import type { ApplicationExtension } from '../extensions/types';
import type { ModuleClass } from '../di/module';
import type { Constructor } from './types';
/**
 * 应用配置选项
 */
export interface ApplicationOptions {
    /**
     * 端口号
     */
    port?: number;
    /**
     * 主机名
     */
    hostname?: string;
}
/**
 * 应用主类
 * 负责初始化和启动应用
 */
export declare class Application {
    private server?;
    private readonly options;
    private readonly middlewarePipeline;
    private readonly websocketRegistry;
    private readonly extensions;
    constructor(options?: ApplicationOptions);
    /**
     * 注册全局中间件
     * @param middleware - 中间件函数
     */
    use(middleware: Middleware): void;
    /**
     * 启动应用
     */
    listen(port?: number, hostname?: string): void;
    /**
     * 停止应用
     */
    stop(): void;
    /**
     * 处理请求
     * @param context - 请求上下文
     * @returns 响应对象
     */
    private handleRequest;
    /**
     * 注册控制器
     * @param controllerClass - 控制器类
     */
    registerController(controllerClass: Constructor<unknown>): void;
    /**
     * 注册模块
     * @param moduleClass - 模块类
     */
    registerModule(moduleClass: ModuleClass): void;
    /**
     * 注册 WebSocket 网关
     * @param gatewayClass - WebSocket 网关类
     */
    registerWebSocketGateway(gatewayClass: Constructor<unknown>): void;
    /**
     * 注册扩展
     * @param extension - 应用扩展
     */
    registerExtension(extension: ApplicationExtension): void;
    /**
     * 获取服务器实例
     * @returns Bun Server 实例
     */
    getServer(): BunServer | undefined;
    /**
     * 获取 DI 容器（用于注册服务）
     * @returns DI 容器
     */
    getContainer(): import("..").Container;
}
//# sourceMappingURL=application.d.ts.map