import { Controller, Query, Body } from '../controller';
import { GET, POST } from '../router/decorators';
import { Injectable, Inject } from '../di';
import { ResponseBuilder } from '../request';
import { OAuth2Service } from './oauth2';
import { Auth } from './decorators';
import type {
  OAuth2AuthorizationRequest,
  OAuth2TokenRequest,
  OAuth2TokenResponse,
} from './types';

/**
 * OAuth2 令牌 Token
 */
export const OAUTH2_SERVICE_TOKEN = Symbol('OAUTH2_SERVICE');
export const JWT_UTIL_TOKEN = Symbol('JWT_UTIL');

/**
 * OAuth2 控制器
 */
@Controller('/oauth2')
@Injectable()
export class OAuth2Controller {
  public constructor(
    @Inject(OAUTH2_SERVICE_TOKEN) private readonly oauth2Service: OAuth2Service,
  ) {}

  /**
   * 授权端点
   * GET /oauth2/authorize?client_id=...&redirect_uri=...&response_type=code&state=...
   */
  @GET('/authorize')
  public authorize(@Query('client_id') clientId: string, @Query('redirect_uri') redirectUri: string, @Query('state') state?: string, @Query('scope') scope?: string) {
    const query: Record<string, string> = {
      client_id: clientId,
      redirect_uri: redirectUri,
      ...(state && { state }),
      ...(scope && { scope }),
    };
    const request: OAuth2AuthorizationRequest = {
      clientId: query.client_id || '',
      redirectUri: query.redirect_uri || '',
      responseType: 'code',
      scope: query.scope,
      state: query.state,
    };

    // 验证请求
    const validation = this.oauth2Service.validateAuthorizationRequest(request);
    if (!validation.valid) {
      throw new Error(`Invalid authorization request: ${validation.error}`);
    }

    // 这里应该显示授权页面，让用户登录并授权
    // 为了简化，我们假设用户已经登录，使用默认用户 ID
    const userId = 'user-1';

    // 生成授权码
    const code = this.oauth2Service.generateAuthorizationCode(
      request.clientId,
      request.redirectUri,
      userId,
      request.scope,
    );

    // 构建重定向 URL
    const redirectUrl = new URL(request.redirectUri);
    redirectUrl.searchParams.set('code', code);
    if (request.state) {
      redirectUrl.searchParams.set('state', request.state);
    }

    // 返回重定向 URL（框架会处理）
    // 注意：实际实现中可能需要使用 ResponseBuilder.redirect()
    return ResponseBuilder.redirect(redirectUrl.toString());
  }

  /**
   * 令牌端点
   * POST /oauth2/token
   */
  @POST('/token')
  public async token(@Body() body: Record<string, string>): Promise<OAuth2TokenResponse | any> {
    const request: OAuth2TokenRequest = {
      code: body.code || '',
      clientId: body.client_id || '',
      clientSecret: body.client_secret || '',
      redirectUri: body.redirect_uri || '',
      grantType: (body.grant_type as 'authorization_code' | 'refresh_token') || 'authorization_code',
      refreshToken: body.refresh_token,
    };

    if (request.grantType === 'authorization_code') {
      const tokenResponse = await this.oauth2Service.exchangeCodeForToken(request);
      if (!tokenResponse) {
        return {
          error: 'invalid_grant',
          error_description: 'Invalid authorization code',
        };
      }
      return tokenResponse;
    }

    if (request.grantType === 'refresh_token' && request.refreshToken) {
      const tokenResponse = await this.oauth2Service.refreshToken(request.refreshToken);
      if (!tokenResponse) {
        return {
          error: 'invalid_grant',
          error_description: 'Invalid refresh token',
        };
      }
      return tokenResponse;
    }

    return {
      error: 'unsupported_grant_type',
      error_description: 'Unsupported grant type',
    };
  }

  /**
   * 用户信息端点
   * GET /oauth2/userinfo
   * 注意：此端点需要认证，应该通过认证中间件保护
   */
  @GET('/userinfo')
  @Auth()
  public userinfo() {
    // 用户信息应该通过认证中间件注入到 Context
    // 这里简化处理，返回占位符
    return {
      sub: 'user-1',
      username: 'alice',
      roles: ['user'],
    };
  }
}

