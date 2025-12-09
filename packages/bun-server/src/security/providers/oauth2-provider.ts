import type {
  Authentication,
  AuthenticationProvider,
  AuthenticationRequest,
  Principal,
} from '../types';
import { OAuth2Service } from '../../auth/oauth2';
import { JWTUtil } from '../../auth/jwt';
import type { OAuth2TokenRequest } from '../../auth/types';

/**
 * OAuth2 认证提供者
 */
export class OAuth2AuthenticationProvider implements AuthenticationProvider {
  public readonly supportedTypes = ['oauth2', 'authorization_code'];

  public constructor(
    private readonly oauth2Service: OAuth2Service,
    private readonly jwtUtil: JWTUtil,
  ) {}

  /**
   * 是否支持该认证类型
   */
  public supports(type: string): boolean {
    return this.supportedTypes.includes(type.toLowerCase());
  }

  /**
   * 认证（通过授权码交换令牌）
   */
  public async authenticate(
    request: AuthenticationRequest,
  ): Promise<Authentication | null> {
    const credentials = request.credentials as OAuth2TokenRequest;
    if (!credentials || credentials.grantType !== 'authorization_code') {
      return null;
    }

    // 交换授权码获取令牌
    const tokenResponse = await this.oauth2Service.exchangeCodeForToken(credentials);
    if (!tokenResponse) {
      return null;
    }

    // 从访问令牌中解析用户信息
    const payload = this.jwtUtil.verify(tokenResponse.accessToken);
    if (!payload || !payload.sub) {
      return null;
    }

    const principal: Principal = {
      id: payload.sub,
      username: (payload.username as string) || payload.sub,
      roles: (payload.roles as string[]) || [],
    };

    return {
      authenticated: true,
      principal,
      credentials: {
        type: 'oauth2',
        data: tokenResponse,
      },
      authorities: principal.roles || [],
      details: tokenResponse,
    };
  }
}

