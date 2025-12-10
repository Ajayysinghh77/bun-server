import type { Context } from '../core/context';
import type { Middleware } from '../middleware';
import { AuthenticationManager } from './authentication-manager';
import { RoleBasedAccessDecisionManager } from './access-decision-manager';
import type { SecurityConfig } from './types';
/**
 * 安全过滤器配置
 */
export interface SecurityFilterConfig extends SecurityConfig {
    /**
     * 认证管理器
     */
    authenticationManager: AuthenticationManager;
    /**
     * 访问决策器
     */
    accessDecisionManager?: RoleBasedAccessDecisionManager;
    /**
     * 令牌提取函数
     */
    extractToken?: (ctx: Context) => string | null;
}
/**
 * 创建安全过滤器
 */
export declare function createSecurityFilter(config: SecurityFilterConfig): Middleware;
//# sourceMappingURL=filter.d.ts.map