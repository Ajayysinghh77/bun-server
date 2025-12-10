import type { Authentication, AccessDecisionManager } from './types';
/**
 * 基于角色的访问决策器
 */
export declare class RoleBasedAccessDecisionManager implements AccessDecisionManager {
    /**
     * 决定是否授权
     * @param authentication - 认证信息
     * @param requiredAuthorities - 需要的权限（角色）
     * @returns 是否授权
     */
    decide(authentication: Authentication, requiredAuthorities: string[]): boolean;
}
//# sourceMappingURL=access-decision-manager.d.ts.map