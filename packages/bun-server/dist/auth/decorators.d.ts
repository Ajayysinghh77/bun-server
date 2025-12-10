import 'reflect-metadata';
/**
 * 认证配置
 */
export interface AuthConfig {
    /**
     * 是否需要认证
     * @default true
     */
    required?: boolean;
    /**
     * 允许的角色列表
     */
    roles?: string[];
    /**
     * 是否允许匿名访问
     * @default false
     */
    allowAnonymous?: boolean;
}
/**
 * 认证装饰器
 * 用于标记需要认证的路由
 */
export declare function Auth(config?: AuthConfig): MethodDecorator;
/**
 * 获取认证元数据
 */
export declare function getAuthMetadata(target: Object, propertyKey: string | symbol): AuthConfig | undefined;
/**
 * 检查是否需要认证
 */
export declare function requiresAuth(target: Object, propertyKey: string | symbol): boolean;
/**
 * 检查角色权限
 */
export declare function checkRoles(target: Object, propertyKey: string | symbol, userRoles?: string[]): boolean;
//# sourceMappingURL=decorators.d.ts.map