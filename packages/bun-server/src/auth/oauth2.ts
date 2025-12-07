import { JWTUtil } from './jwt';
import type {
  OAuth2Client,
  OAuth2AuthorizationRequest,
  OAuth2TokenRequest,
  OAuth2TokenResponse,
  OAuth2CodeConfig,
  JWTPayload,
  UserInfo,
} from './types';

/**
 * 授权码存储
 */
interface AuthorizationCode {
  code: string;
  clientId: string;
  redirectUri: string;
  userId: string;
  scope?: string;
  expiresAt: number;
}

/**
 * OAuth2 服务
 */
export class OAuth2Service {
  private readonly jwtUtil: JWTUtil;
  private readonly clients: Map<string, OAuth2Client>;
  private readonly codes: Map<string, AuthorizationCode>;
  private readonly codeConfig: Required<OAuth2CodeConfig>;
  private readonly userProvider?: (userId: string) => Promise<UserInfo | null>;

  public constructor(
    jwtUtil: JWTUtil,
    clients: OAuth2Client[] = [],
    codeConfig: OAuth2CodeConfig = {},
    userProvider?: (userId: string) => Promise<UserInfo | null>,
  ) {
    this.jwtUtil = jwtUtil;
    this.clients = new Map();
    this.codes = new Map();
    this.codeConfig = {
      expiresIn: codeConfig.expiresIn ?? 600,
      length: codeConfig.length ?? 32,
    };

    // 注册客户端
    for (const client of clients) {
      this.clients.set(client.clientId, client);
    }

    this.userProvider = userProvider;

    // 定期清理过期的授权码
    setInterval(() => this.cleanupExpiredCodes(), 60000);
  }

  /**
   * 注册客户端
   */
  public registerClient(client: OAuth2Client): void {
    this.clients.set(client.clientId, client);
  }

  /**
   * 验证授权请求
   */
  public validateAuthorizationRequest(
    request: OAuth2AuthorizationRequest,
  ): { valid: boolean; error?: string } {
    const client = this.clients.get(request.clientId);
    if (!client) {
      return { valid: false, error: 'invalid_client' };
    }

    if (request.responseType !== 'code') {
      return { valid: false, error: 'unsupported_response_type' };
    }

    if (!client.redirectUris.includes(request.redirectUri)) {
      return { valid: false, error: 'invalid_redirect_uri' };
    }

    return { valid: true };
  }

  /**
   * 生成授权码
   */
  public generateAuthorizationCode(
    clientId: string,
    redirectUri: string,
    userId: string,
    scope?: string,
  ): string {
    const code = this.generateRandomString(this.codeConfig.length);
    const expiresAt = Date.now() + this.codeConfig.expiresIn * 1000;

    this.codes.set(code, {
      code,
      clientId,
      redirectUri,
      userId,
      scope,
      expiresAt,
    });

    return code;
  }

  /**
   * 交换授权码获取令牌
   */
  public async exchangeCodeForToken(
    request: OAuth2TokenRequest,
  ): Promise<OAuth2TokenResponse | null> {
    if (request.grantType !== 'authorization_code') {
      return null;
    }

    const codeData = this.codes.get(request.code);
    if (!codeData) {
      return null;
    }

    // 验证授权码是否过期
    if (codeData.expiresAt < Date.now()) {
      this.codes.delete(request.code);
      return null;
    }

    // 验证客户端
    const client = this.clients.get(request.clientId);
    if (!client || client.clientSecret !== request.clientSecret) {
      return null;
    }

    // 验证重定向 URI
    if (codeData.redirectUri !== request.redirectUri) {
      return null;
    }

    // 删除已使用的授权码
    this.codes.delete(request.code);

    // 获取用户信息
    let userInfo: UserInfo | null = null;
    if (this.userProvider) {
      userInfo = await this.userProvider(codeData.userId);
    }

    if (!userInfo) {
      userInfo = {
        id: codeData.userId,
        username: codeData.userId,
      };
    }

    // 生成令牌
    const payload: Omit<JWTPayload, 'exp' | 'iat'> = {
      sub: userInfo.id,
      username: userInfo.username,
      roles: userInfo.roles,
    };

    const accessToken = this.jwtUtil.generateAccessToken(payload);
    const refreshToken = this.jwtUtil.generateRefreshToken(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.jwtUtil['config'].accessTokenExpiresIn,
      refreshToken,
      scope: codeData.scope,
    };
  }

  /**
   * 刷新令牌
   */
  public async refreshToken(refreshToken: string): Promise<OAuth2TokenResponse | null> {
    const payload = this.jwtUtil.verify(refreshToken);
    if (!payload || !payload.sub) {
      return null;
    }

    // 获取用户信息
    let userInfo: UserInfo | null = null;
    if (this.userProvider) {
      userInfo = await this.userProvider(payload.sub);
    }

    if (!userInfo) {
      userInfo = {
        id: payload.sub,
        username: payload.username as string || payload.sub,
        roles: payload.roles as string[],
      };
    }

    // 生成新令牌
    const newPayload: Omit<JWTPayload, 'exp' | 'iat'> = {
      sub: userInfo.id,
      username: userInfo.username,
      roles: userInfo.roles,
    };

    const accessToken = this.jwtUtil.generateAccessToken(newPayload);
    const newRefreshToken = this.jwtUtil.generateRefreshToken(newPayload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.jwtUtil['config'].accessTokenExpiresIn,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * 生成随机字符串
   */
  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * 清理过期的授权码
   */
  private cleanupExpiredCodes(): void {
    const now = Date.now();
    for (const [code, data] of this.codes.entries()) {
      if (data.expiresAt < now) {
        this.codes.delete(code);
      }
    }
  }
}

