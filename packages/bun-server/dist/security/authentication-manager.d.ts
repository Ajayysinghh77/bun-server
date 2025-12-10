import type { Authentication, AuthenticationProvider, AuthenticationRequest } from './types';
/**
 * 认证管理器
 */
export declare class AuthenticationManager {
    private readonly providers;
    /**
     * 注册认证提供者
     */
    registerProvider(provider: AuthenticationProvider): void;
    /**
     * 认证
     * @param request - 认证请求
     * @returns 认证信息
     */
    authenticate(request: AuthenticationRequest): Promise<Authentication | null>;
    /**
     * 获取所有提供者
     */
    getProviders(): AuthenticationProvider[];
}
//# sourceMappingURL=authentication-manager.d.ts.map