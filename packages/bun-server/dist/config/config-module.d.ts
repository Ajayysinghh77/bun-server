import { type ConfigModuleOptions } from './types';
export declare class ConfigModule {
    /**
     * 创建配置模块
     * @param options - 模块配置
     */
    static forRoot(options?: ConfigModuleOptions): typeof ConfigModule;
    /**
     * 获取环境变量快照
     * 方便测试和未来扩展（如 .env 文件解析）
     */
    private static snapshotEnv;
}
//# sourceMappingURL=config-module.d.ts.map