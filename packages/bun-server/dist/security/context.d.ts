import type { Authentication, Principal, SecurityContext } from './types';
/**
 * 安全上下文实现
 */
export declare class SecurityContextImpl implements SecurityContext {
    private _authentication;
    /**
     * 当前认证信息
     */
    get authentication(): Authentication | null;
    /**
     * 设置认证信息
     */
    setAuthentication(authentication: Authentication | null): void;
    /**
     * 是否已认证
     */
    isAuthenticated(): boolean;
    /**
     * 获取主体
     */
    getPrincipal(): Principal | null;
    /**
     * 获取权限
     */
    getAuthorities(): string[];
    /**
     * 清除认证信息
     */
    clear(): void;
}
/**
 * 安全上下文持有者（ThreadLocal 模式）
 */
export declare class SecurityContextHolder {
    private static readonly storage;
    /**
     * 获取当前上下文
     */
    static getContext(): SecurityContextImpl;
    /**
     * 在给定回调中运行，绑定独立的安全上下文（每个请求一个）
     * @param callback - 要在安全上下文中执行的回调
     */
    static runWithContext<T>(callback: () => T): T;
    /**
     * 清除当前上下文中的认证信息
     */
    static clearContext(): void;
}
//# sourceMappingURL=context.d.ts.map