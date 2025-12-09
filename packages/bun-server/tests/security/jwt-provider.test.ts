import { describe, expect, test, beforeEach } from 'bun:test';
import { JwtAuthenticationProvider } from '../../src/security/providers/jwt-provider';
import { JWTUtil } from '../../src/auth/jwt';

describe('JwtAuthenticationProvider', () => {
  let jwtUtil: JWTUtil;
  let provider: JwtAuthenticationProvider;

  beforeEach(() => {
    jwtUtil = new JWTUtil({
      secret: 'test-secret-key',
      accessTokenExpiresIn: 3600,
    });
    provider = new JwtAuthenticationProvider(jwtUtil);
  });

  test('should support jwt and bearer types', () => {
    expect(provider.supports('jwt')).toBe(true);
    expect(provider.supports('bearer')).toBe(true);
    expect(provider.supports('JWT')).toBe(true);
    expect(provider.supports('BEARER')).toBe(true);
    expect(provider.supports('oauth2')).toBe(false);
  });

  test('should authenticate with valid JWT token', async () => {
    const token = jwtUtil.generateAccessToken({
      sub: 'user-1',
      username: 'testuser',
      roles: ['user'],
    });

    const authentication = await provider.authenticate({
      principal: '',
      credentials: token,
      type: 'jwt',
    });

    expect(authentication).not.toBeNull();
    expect(authentication?.authenticated).toBe(true);
    expect(authentication?.principal.id).toBe('user-1');
    expect(authentication?.principal.username).toBe('testuser');
    expect(authentication?.principal.roles).toEqual(['user']);
    expect(authentication?.authorities).toEqual(['user']);
  });

  test('should return null for invalid token', async () => {
    const authentication = await provider.authenticate({
      principal: '',
      credentials: 'invalid-token',
      type: 'jwt',
    });

    expect(authentication).toBeNull();
  });

  test('should return null for missing token', async () => {
    const authentication = await provider.authenticate({
      principal: '',
      credentials: '',
      type: 'jwt',
    });

    expect(authentication).toBeNull();
  });

  test('should return null for expired token', async () => {
    const expiredJwtUtil = new JWTUtil({
      secret: 'test-secret-key',
      accessTokenExpiresIn: -1, // 已过期
    });
    const expiredProvider = new JwtAuthenticationProvider(expiredJwtUtil);
    const token = expiredJwtUtil.generateAccessToken({
      sub: 'user-1',
      username: 'testuser',
    });

    // 等待一下确保过期
    await new Promise((resolve) => setTimeout(resolve, 100));

    const authentication = await expiredProvider.authenticate({
      principal: '',
      credentials: token,
      type: 'jwt',
    });

    expect(authentication).toBeNull();
  });

  test('should handle token without roles', async () => {
    const token = jwtUtil.generateAccessToken({
      sub: 'user-1',
      username: 'testuser',
    });

    const authentication = await provider.authenticate({
      principal: '',
      credentials: token,
      type: 'jwt',
    });

    expect(authentication).not.toBeNull();
    expect(authentication?.principal.roles).toEqual([]);
    expect(authentication?.authorities).toEqual([]);
  });
});

