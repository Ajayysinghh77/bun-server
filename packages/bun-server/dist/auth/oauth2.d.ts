import { JWTUtil } from './jwt';
import type { OAuth2Client, OAuth2AuthorizationRequest, OAuth2TokenRequest, OAuth2TokenResponse, OAuth2CodeConfig, UserInfo } from './types';
/**
 * OAuth2 服务
 */
export declare class OAuth2Service {
    private readonly jwtUtil;
    private readonly clients;
    private readonly codes;
    private readonly codeConfig;
    private readonly userProvider?;
    constructor(jwtUtil: JWTUtil, clients?: OAuth2Client[], codeConfig?: OAuth2CodeConfig, userProvider?: (userId: string) => Promise<UserInfo | null>);
    /**
     * 注册客户端
     */
    registerClient(client: OAuth2Client): void;
    /**
     * 验证授权请求
     */
    validateAuthorizationRequest(request: OAuth2AuthorizationRequest): {
        valid: boolean;
        error?: string;
    };
    /**
     * 生成授权码
     */
    generateAuthorizationCode(clientId: string, redirectUri: string, userId: string, scope?: string): string;
    /**
     * 交换授权码获取令牌
     */
    exchangeCodeForToken(request: OAuth2TokenRequest): Promise<OAuth2TokenResponse | null>;
    /**
     * 刷新令牌
     */
    refreshToken(refreshToken: string): Promise<OAuth2TokenResponse | null>;
    /**
     * 生成随机字符串
     */
    private generateRandomString;
    /**
     * 清理过期的授权码
     */
    private cleanupExpiredCodes;
}
//# sourceMappingURL=oauth2.d.ts.map