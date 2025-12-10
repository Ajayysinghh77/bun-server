import type { Authentication, AuthenticationProvider, AuthenticationRequest } from '../types';
import { OAuth2Service } from '../../auth/oauth2';
import { JWTUtil } from '../../auth/jwt';
/**
 * OAuth2 认证提供者
 */
export declare class OAuth2AuthenticationProvider implements AuthenticationProvider {
    private readonly oauth2Service;
    private readonly jwtUtil;
    readonly supportedTypes: string[];
    constructor(oauth2Service: OAuth2Service, jwtUtil: JWTUtil);
    /**
     * 是否支持该认证类型
     */
    supports(type: string): boolean;
    /**
     * 认证（通过授权码交换令牌）
     */
    authenticate(request: AuthenticationRequest): Promise<Authentication | null>;
}
//# sourceMappingURL=oauth2-provider.d.ts.map