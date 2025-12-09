import { describe, expect, test, beforeEach } from 'bun:test';
import { OAuth2AuthenticationProvider } from '../../src/security/providers/oauth2-provider';
import { OAuth2Service } from '../../src/auth/oauth2';
import { JWTUtil } from '../../src/auth/jwt';
import type { OAuth2TokenRequest } from '../../src/auth/types';

describe('OAuth2AuthenticationProvider', () => {
  let jwtUtil: JWTUtil;
  let oauth2Service: OAuth2Service;
  let provider: OAuth2AuthenticationProvider;

  beforeEach(() => {
    jwtUtil = new JWTUtil({
      secret: 'test-secret-key',
      accessTokenExpiresIn: 3600,
    });
    oauth2Service = new OAuth2Service(jwtUtil, [
      {
        clientId: 'test-client',
        clientSecret: 'test-secret',
        redirectUris: ['http://localhost/callback'],
        grantTypes: ['authorization_code'],
      },
    ]);
    provider = new OAuth2AuthenticationProvider(oauth2Service, jwtUtil);
  });

  test('should support oauth2 and authorization_code types', () => {
    expect(provider.supports('oauth2')).toBe(true);
    expect(provider.supports('authorization_code')).toBe(true);
    expect(provider.supports('OAUTH2')).toBe(true);
    expect(provider.supports('AUTHORIZATION_CODE')).toBe(true);
    expect(provider.supports('jwt')).toBe(false);
    expect(provider.supports('bearer')).toBe(false);
  });

  test('should authenticate with valid authorization code', async () => {
    // 生成授权码
    const code = oauth2Service.generateAuthorizationCode(
      'test-client',
      'http://localhost/callback',
      'user-1',
      'read write',
    );

    const tokenRequest: OAuth2TokenRequest = {
      code,
      clientId: 'test-client',
      clientSecret: 'test-secret',
      redirectUri: 'http://localhost/callback',
      grantType: 'authorization_code',
    };

    const authentication = await provider.authenticate({
      principal: '',
      credentials: tokenRequest,
      type: 'oauth2',
    });

    expect(authentication).not.toBeNull();
    expect(authentication?.authenticated).toBe(true);
    expect(authentication?.principal.id).toBe('user-1');
    expect(authentication?.principal.username).toBe('user-1'); // OAuth2Service 默认使用 userId 作为 username
    expect(authentication?.credentials.type).toBe('oauth2');
    expect(authentication?.credentials.data).toBeDefined();
    expect(authentication?.credentials.data.accessToken).toBeDefined();
    expect(authentication?.credentials.data.refreshToken).toBeDefined();
    expect(authentication?.authorities).toEqual([]);
  });

  test('should return null for invalid grant type', async () => {
    const tokenRequest: OAuth2TokenRequest = {
      code: 'invalid-code',
      clientId: 'test-client',
      clientSecret: 'test-secret',
      redirectUri: 'http://localhost/callback',
      grantType: 'refresh_token', // 不支持的 grant type
    };

    const authentication = await provider.authenticate({
      principal: '',
      credentials: tokenRequest,
      type: 'oauth2',
    });

    expect(authentication).toBeNull();
  });

  test('should return null for invalid authorization code', async () => {
    const tokenRequest: OAuth2TokenRequest = {
      code: 'invalid-code',
      clientId: 'test-client',
      clientSecret: 'test-secret',
      redirectUri: 'http://localhost/callback',
      grantType: 'authorization_code',
    };

    const authentication = await provider.authenticate({
      principal: '',
      credentials: tokenRequest,
      type: 'oauth2',
    });

    expect(authentication).toBeNull();
  });

  test('should return null for invalid client credentials', async () => {
    const code = oauth2Service.generateAuthorizationCode(
      'test-client',
      'http://localhost/callback',
      'user-1',
    );

    const tokenRequest: OAuth2TokenRequest = {
      code,
      clientId: 'test-client',
      clientSecret: 'wrong-secret', // 错误的 secret
      redirectUri: 'http://localhost/callback',
      grantType: 'authorization_code',
    };

    const authentication = await provider.authenticate({
      principal: '',
      credentials: tokenRequest,
      type: 'oauth2',
    });

    expect(authentication).toBeNull();
  });

  test('should return null for invalid redirect URI', async () => {
    const code = oauth2Service.generateAuthorizationCode(
      'test-client',
      'http://localhost/callback',
      'user-1',
    );

    const tokenRequest: OAuth2TokenRequest = {
      code,
      clientId: 'test-client',
      clientSecret: 'test-secret',
      redirectUri: 'http://localhost/wrong-callback', // 错误的 redirect URI
      grantType: 'authorization_code',
    };

    const authentication = await provider.authenticate({
      principal: '',
      credentials: tokenRequest,
      type: 'oauth2',
    });

    expect(authentication).toBeNull();
  });

  test('should return null for expired authorization code', async () => {
    // 创建一个快速过期的 OAuth2Service
    const expiredOAuth2Service = new OAuth2Service(jwtUtil, [
      {
        clientId: 'test-client',
        clientSecret: 'test-secret',
        redirectUris: ['http://localhost/callback'],
        grantTypes: ['authorization_code'],
      },
    ], {
      expiresIn: 0.1, // 0.1 秒过期
    });
    const expiredProvider = new OAuth2AuthenticationProvider(
      expiredOAuth2Service,
      jwtUtil,
    );

    const code = expiredOAuth2Service.generateAuthorizationCode(
      'test-client',
      'http://localhost/callback',
      'user-1',
    );

    // 等待授权码过期
    await new Promise((resolve) => setTimeout(resolve, 200));

    const tokenRequest: OAuth2TokenRequest = {
      code,
      clientId: 'test-client',
      clientSecret: 'test-secret',
      redirectUri: 'http://localhost/callback',
      grantType: 'authorization_code',
    };

    const authentication = await expiredProvider.authenticate({
      principal: '',
      credentials: tokenRequest,
      type: 'oauth2',
    });

    expect(authentication).toBeNull();
  });

  test('should return null for missing credentials', async () => {
    const authentication = await provider.authenticate({
      principal: '',
      credentials: null as any,
      type: 'oauth2',
    });

    expect(authentication).toBeNull();
  });

  test('should return null for invalid credentials format', async () => {
    const authentication = await provider.authenticate({
      principal: '',
      credentials: 'invalid-string' as any,
      type: 'oauth2',
    });

    expect(authentication).toBeNull();
  });

  test('should include user roles when available', async () => {
    // 创建带用户提供者的 OAuth2Service
    const oauth2ServiceWithUser = new OAuth2Service(
      jwtUtil,
      [
        {
          clientId: 'test-client',
          clientSecret: 'test-secret',
          redirectUris: ['http://localhost/callback'],
          grantTypes: ['authorization_code'],
        },
      ],
      {},
      async (userId: string) => {
        return {
          id: userId,
          username: 'testuser',
          roles: ['admin', 'user'],
        };
      },
    );
    const providerWithUser = new OAuth2AuthenticationProvider(
      oauth2ServiceWithUser,
      jwtUtil,
    );

    const code = oauth2ServiceWithUser.generateAuthorizationCode(
      'test-client',
      'http://localhost/callback',
      'user-1',
    );

    const tokenRequest: OAuth2TokenRequest = {
      code,
      clientId: 'test-client',
      clientSecret: 'test-secret',
      redirectUri: 'http://localhost/callback',
      grantType: 'authorization_code',
    };

    const authentication = await providerWithUser.authenticate({
      principal: '',
      credentials: tokenRequest,
      type: 'oauth2',
    });

    expect(authentication).not.toBeNull();
    expect(authentication?.principal.roles).toEqual(['admin', 'user']);
    expect(authentication?.authorities).toEqual(['admin', 'user']);
  });
});

