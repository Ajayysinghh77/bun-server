import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { createSecurityFilter } from '../../src/security/filter';
import { AuthenticationManager } from '../../src/security/authentication-manager';
import { JwtAuthenticationProvider } from '../../src/security/providers/jwt-provider';
import { JWTUtil } from '../../src/auth/jwt';
import { Context } from '../../src/core/context';
import { Controller } from '../../src/controller';
import { GET } from '../../src/router/decorators';
import { Auth } from '../../src/auth/decorators';
import { UnauthorizedException, ForbiddenException } from '../../src/error/http-exception';
import { SecurityContextHolder } from '../../src/security/context';

describe('SecurityFilter', () => {
  let jwtUtil: JWTUtil;
  let authManager: AuthenticationManager;
  let filter: ReturnType<typeof createSecurityFilter>;

  beforeEach(() => {
    jwtUtil = new JWTUtil({
      secret: 'test-secret-key',
      accessTokenExpiresIn: 3600,
    });
    authManager = new AuthenticationManager();
    authManager.registerProvider(new JwtAuthenticationProvider(jwtUtil));
    SecurityContextHolder.clearContext();
  });

  afterEach(() => {
    SecurityContextHolder.clearContext();
  });

  test('should allow access to excluded paths', async () => {
    filter = createSecurityFilter({
      authenticationManager: authManager,
      excludePaths: ['/public'],
    });

    // filter 使用 ctx.request.url.split('?')[0] 来获取路径
    // 所以需要包含协议和主机
    const request = new Request('http://localhost/public');
    const context = new Context(request);
    let nextCalled = false;

    const next = async () => {
      nextCalled = true;
      return context.createResponse({ ok: true });
    };

    const result = await filter(context, next);

    expect(nextCalled).toBe(true);
    expect(result).toBeDefined();
  });

  test('should authenticate with valid token', async () => {
    filter = createSecurityFilter({
      authenticationManager: authManager,
      excludePaths: [],
      defaultAuthRequired: false,
    });

    const token = jwtUtil.generateAccessToken({
      sub: 'user-1',
      username: 'testuser',
      roles: ['user'],
    });

    const request = new Request('http://localhost/api/test', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const context = new Context(request);
    let nextCalled = false;

    const next = async () => {
      nextCalled = true;
      return context.createResponse({ ok: true });
    };

    await filter(context, next);

    expect(nextCalled).toBe(true);
    expect((context as any).auth.isAuthenticated).toBe(true);
    expect((context as any).auth.user.id).toBe('user-1');
  });

  test('should throw UnauthorizedException when auth required but no token', async () => {
    @Controller('/api')
    class TestController {
      @GET('/protected')
      @Auth()
      public protected() {
        return { ok: true };
      }
    }

    filter = createSecurityFilter({
      authenticationManager: authManager,
      excludePaths: [],
      defaultAuthRequired: false,
    });

    const request = new Request('http://localhost/api/protected');
    const context = new Context(request);
    (context as any).routeHandler = {
      controller: TestController.prototype,
      method: 'protected',
    };

    const next = async () => context.createResponse({ ok: true });

    await expect(filter(context, next)).rejects.toThrow(UnauthorizedException);
  });

  test('should throw ForbiddenException when user lacks required role', async () => {
    @Controller('/api')
    class TestController {
      @GET('/admin')
      @Auth({ roles: ['admin'] })
      public admin() {
        return { ok: true };
      }
    }

    filter = createSecurityFilter({
      authenticationManager: authManager,
      excludePaths: [],
      defaultAuthRequired: false,
    });

    const token = jwtUtil.generateAccessToken({
      sub: 'user-1',
      username: 'testuser',
      roles: ['user'], // 只有 user 角色，没有 admin
    });

    const request = new Request('http://localhost/api/admin', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const context = new Context(request);
    // routeHandler 需要在认证之前设置，因为 filter 会检查它
    // 使用原型来获取元数据
    (context as any).routeHandler = {
      controller: TestController.prototype,
      method: 'admin',
    };

    const next = async () => context.createResponse({ ok: true });

    await expect(filter(context, next)).rejects.toThrow(ForbiddenException);
  });

  test('should allow access when user has required role', async () => {
    @Controller('/api')
    class TestController {
      @GET('/admin')
      @Auth({ roles: ['admin'] })
      public admin() {
        return { ok: true };
      }
    }

    filter = createSecurityFilter({
      authenticationManager: authManager,
      excludePaths: [],
      defaultAuthRequired: false,
    });

    const token = jwtUtil.generateAccessToken({
      sub: 'user-1',
      username: 'admin',
      roles: ['admin'],
    });

    const request = new Request('http://localhost/api/admin', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const context = new Context(request);
    (context as any).routeHandler = {
      controller: TestController.prototype,
      method: 'admin',
    };
    let nextCalled = false;

    const next = async () => {
      nextCalled = true;
      return context.createResponse({ ok: true });
    };

    await filter(context, next);

    expect(nextCalled).toBe(true);
  });

  test('should use custom token extractor', async () => {
    filter = createSecurityFilter({
      authenticationManager: authManager,
      excludePaths: [],
      defaultAuthRequired: false,
      extractToken: (ctx) => ctx.getHeader('x-custom-token'),
    });

    const token = jwtUtil.generateAccessToken({
      sub: 'user-1',
      username: 'testuser',
      roles: ['user'],
    });

    const request = new Request('http://localhost/api/test', {
      headers: { 'x-custom-token': token },
    });
    const context = new Context(request);
    let nextCalled = false;

    const next = async () => {
      nextCalled = true;
      return context.createResponse({ ok: true });
    };

    await filter(context, next);

    expect(nextCalled).toBe(true);
    expect((context as any).auth.isAuthenticated).toBe(true);
  });
});

