import type { JWTConfig, OAuth2Client, UserInfo } from '../auth/types';
/**
 * 安全模块配置
 */
export interface SecurityModuleConfig {
    /**
     * JWT 配置
     */
    jwt: JWTConfig;
    /**
     * OAuth2 客户端列表
     */
    oauth2Clients?: OAuth2Client[];
    /**
     * 用户提供者（可选）
     */
    userProvider?: {
        findById(userId: string): Promise<UserInfo | null>;
    };
    /**
     * 是否启用 OAuth2 端点
     * @default true
     */
    enableOAuth2Endpoints?: boolean;
    /**
     * OAuth2 端点前缀
     * @default '/oauth2'
     */
    oauth2Prefix?: string;
    /**
     * 排除的路径列表（不需要认证）
     */
    excludePaths?: string[];
    /**
     * 默认认证要求
     * @default false
     */
    defaultAuthRequired?: boolean;
}
/**
 * 安全模块
 */
export declare class SecurityModule {
    /**
     * 创建安全模块
     * @param config - 模块配置
     */
    static forRoot(config: SecurityModuleConfig): typeof SecurityModule;
}
//# sourceMappingURL=security-module.d.ts.map