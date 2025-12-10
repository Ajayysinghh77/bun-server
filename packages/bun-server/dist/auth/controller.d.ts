import { OAuth2Service } from './oauth2';
import type { OAuth2TokenResponse } from './types';
/**
 * OAuth2 令牌 Token
 */
export declare const OAUTH2_SERVICE_TOKEN: unique symbol;
export declare const JWT_UTIL_TOKEN: unique symbol;
/**
 * OAuth2 控制器
 */
export declare class OAuth2Controller {
    private readonly oauth2Service;
    constructor(oauth2Service: OAuth2Service);
    /**
     * 授权端点
     * GET /oauth2/authorize?client_id=...&redirect_uri=...&response_type=code&state=...
     */
    authorize(clientId: string | null, redirectUri: string | null, responseType: string | null, state?: string | null, scope?: string | null): Response;
    /**
     * 令牌端点
     * POST /oauth2/token
     */
    token(body: Record<string, string>): Promise<OAuth2TokenResponse | any>;
    /**
     * 用户信息端点
     * GET /oauth2/userinfo
     * 注意：此端点需要认证，应该通过认证中间件保护
     */
    userinfo(): {
        sub: string;
        username: string;
        roles: string[];
    };
}
//# sourceMappingURL=controller.d.ts.map