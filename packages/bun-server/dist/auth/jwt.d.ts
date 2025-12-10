import type { JWTConfig, JWTPayload } from './types';
/**
 * JWT 工具类
 */
export declare class JWTUtil {
    private readonly config;
    constructor(config: JWTConfig);
    /**
     * 生成访问令牌
     * @param payload - JWT 载荷
     * @returns 访问令牌
     */
    generateAccessToken(payload: Omit<JWTPayload, 'exp' | 'iat'>): string;
    /**
     * 生成刷新令牌
     * @param payload - JWT 载荷
     * @returns 刷新令牌
     */
    generateRefreshToken(payload: Omit<JWTPayload, 'exp' | 'iat'>): string;
    /**
     * 验证令牌
     * @param token - JWT 令牌
     * @returns 载荷或 null（如果无效）
     */
    verify(token: string): JWTPayload | null;
    /**
     * 签名 JWT
     */
    private sign;
    /**
     * 生成签名
     */
    private signature;
    /**
     * HMAC-SHA256 实现
     */
    private hmacSha256;
    /**
     * Base64URL 编码
     */
    private base64UrlEncode;
}
//# sourceMappingURL=jwt.d.ts.map