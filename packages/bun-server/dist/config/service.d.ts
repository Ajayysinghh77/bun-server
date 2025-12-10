/**
 * 配置服务
 * 提供类型安全的配置访问能力
 */
export declare class ConfigService<TConfig extends Record<string, unknown> = Record<string, unknown>> {
    private readonly config;
    private readonly namespace?;
    constructor(config: TConfig, namespace?: string);
    /**
     * 获取完整配置对象
     */
    getAll(): TConfig;
    /**
     * 获取配置值（支持点号路径）
     * @param key - 配置键（如 "db.host"）
     * @param defaultValue - 默认值（可选）
     */
    get<T = unknown>(key: string, defaultValue?: T): T | undefined;
    /**
     * 获取必需的配置值，如果不存在则抛出错误
     * @param key - 配置键
     */
    getRequired<T = unknown>(key: string): T;
    /**
     * 创建带命名空间的 ConfigService 视图
     * @param namespace - 命名空间前缀
     */
    withNamespace(namespace: string): ConfigService<TConfig>;
    private applyNamespace;
    private getValueByPath;
}
//# sourceMappingURL=service.d.ts.map