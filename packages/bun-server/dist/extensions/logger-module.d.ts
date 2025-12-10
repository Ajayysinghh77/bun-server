import type { LoggerOptions } from '@dangao/logsmith';
/**
 * Logger 模块配置
 */
export interface LoggerModuleOptions {
    /**
     * Logger 选项
     */
    logger?: LoggerOptions;
    /**
     * 是否启用请求日志中间件
     */
    enableRequestLogging?: boolean;
    /**
     * 请求日志中间件前缀
     */
    requestLoggingPrefix?: string;
}
/**
 * Logger 模块
 * 提供日志功能和请求日志中间件
 */
export declare class LoggerModule {
    /**
     * 创建 Logger 模块
     * @param options - 模块配置
     */
    static forRoot(options?: LoggerModuleOptions): typeof LoggerModule;
}
//# sourceMappingURL=logger-module.d.ts.map