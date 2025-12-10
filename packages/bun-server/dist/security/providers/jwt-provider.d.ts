import type { Authentication, AuthenticationProvider, AuthenticationRequest } from '../types';
import { JWTUtil } from '../../auth/jwt';
/**
 * JWT 认证提供者
 */
export declare class JwtAuthenticationProvider implements AuthenticationProvider {
    private readonly jwtUtil;
    readonly supportedTypes: string[];
    constructor(jwtUtil: JWTUtil);
    /**
     * 是否支持该认证类型
     */
    supports(type: string): boolean;
    /**
     * 认证
     */
    authenticate(request: AuthenticationRequest): Promise<Authentication | null>;
}
//# sourceMappingURL=jwt-provider.d.ts.map