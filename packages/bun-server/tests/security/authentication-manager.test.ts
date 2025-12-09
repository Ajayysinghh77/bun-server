import { describe, expect, test, beforeEach } from 'bun:test';
import { AuthenticationManager } from '../../src/security/authentication-manager';
import { JwtAuthenticationProvider } from '../../src/security/providers/jwt-provider';
import { JWTUtil } from '../../src/auth/jwt';

describe('AuthenticationManager', () => {
  let manager: AuthenticationManager;
  let jwtUtil: JWTUtil;
  let jwtProvider: JwtAuthenticationProvider;

  beforeEach((done) => {
    manager = new AuthenticationManager();
    jwtUtil = new JWTUtil({
      secret: 'test-secret-key',
      accessTokenExpiresIn: 3600,
    });
    jwtProvider = new JwtAuthenticationProvider(jwtUtil);
    done();
  });

  test('should register provider', (done) => {
    manager.registerProvider(jwtProvider);
    const providers = manager.getProviders();
    expect(providers.length).toBe(1);
    expect(providers[0]).toBe(jwtProvider);
    done();
  });

  test('should register multiple providers', (done) => {
    const provider2 = new JwtAuthenticationProvider(jwtUtil);
    manager.registerProvider(jwtProvider);
    manager.registerProvider(provider2);
    expect(manager.getProviders().length).toBe(2);
    done();
  });

  test('should authenticate with registered provider', async (done) => {
    manager.registerProvider(jwtProvider);
    const token = jwtUtil.generateAccessToken({
      sub: 'user-1',
      username: 'testuser',
      roles: ['user'],
    });

    const authentication = await manager.authenticate({
      principal: '',
      credentials: token,
      type: 'jwt',
    });

    expect(authentication).not.toBeNull();
    expect(authentication?.authenticated).toBe(true);
    done();
  });

  test('should throw error for unsupported type', async (done) => {
    manager.registerProvider(jwtProvider);

    await expect(
      manager.authenticate({
        principal: '',
        credentials: 'token',
        type: 'unsupported',
      }),
    ).rejects.toThrow('No authentication provider found for type: unsupported');
    done();
  });

  test('should use default type when not specified', async (done) => {
    manager.registerProvider(jwtProvider);

    await expect(
      manager.authenticate({
        principal: '',
        credentials: 'token',
      }),
    ).rejects.toThrow('No authentication provider found for type: default');
    done();
  });
});

