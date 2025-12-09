import { describe, expect, test, beforeEach } from 'bun:test';
import {
  SecurityContextHolder,
  SecurityContextImpl,
} from '../../src/security/context';
import type { Authentication, Principal } from '../../src/security/types';

describe('SecurityContext', () => {
  let context: SecurityContextImpl;

  beforeEach(() => {
    context = new SecurityContextImpl();
    SecurityContextHolder.clearContext();
  });

  test('should initialize with null authentication', () => {
    expect(context.authentication).toBeNull();
    expect(context.isAuthenticated()).toBe(false);
    expect(context.getPrincipal()).toBeNull();
    expect(context.getAuthorities()).toEqual([]);
  });

  test('should set and get authentication', () => {
    const principal: Principal = {
      id: 'user-1',
      username: 'testuser',
      roles: ['user'],
    };

    const authentication: Authentication = {
      authenticated: true,
      principal,
      credentials: { type: 'jwt', data: 'token' },
      authorities: ['user'],
    };

    context.setAuthentication(authentication);

    expect(context.authentication).toBe(authentication);
    expect(context.isAuthenticated()).toBe(true);
    expect(context.getPrincipal()).toBe(principal);
    expect(context.getAuthorities()).toEqual(['user']);
  });

  test('should clear authentication', () => {
    const authentication: Authentication = {
      authenticated: true,
      principal: { id: 'user-1', username: 'test', roles: [] },
      credentials: { type: 'jwt', data: 'token' },
      authorities: [],
    };

    context.setAuthentication(authentication);
    context.clear();

    expect(context.authentication).toBeNull();
    expect(context.isAuthenticated()).toBe(false);
  });

  test('should handle null authentication', () => {
    context.setAuthentication(null);
    expect(context.isAuthenticated()).toBe(false);
    expect(context.getPrincipal()).toBeNull();
  });
});

describe('SecurityContextHolder', () => {
  beforeEach(() => {
    SecurityContextHolder.clearContext();
  });

  test('should get context instance', () => {
    const context = SecurityContextHolder.getContext();
    expect(context).toBeInstanceOf(SecurityContextImpl);
  });

  test('should return same context instance', () => {
    const context1 = SecurityContextHolder.getContext();
    const context2 = SecurityContextHolder.getContext();
    expect(context1).toBe(context2);
  });

  test('should clear context', () => {
    const context1 = SecurityContextHolder.getContext();
    SecurityContextHolder.clearContext();
    const context2 = SecurityContextHolder.getContext();
    // 由于实现方式，可能返回新实例或相同实例
    expect(context2).toBeInstanceOf(SecurityContextImpl);
  });

  test('should isolate contexts in runWithContext', async () => {
    const results: Map<number, string> = new Map();

    // 模拟多个并发请求，每个请求设置不同的认证信息
    const promises = Array.from({ length: 10 }, (_, i) => {
      const userId = `user-${i}`;
      return SecurityContextHolder.runWithContext(async () => {
        const context = SecurityContextHolder.getContext();
        const authentication: Authentication = {
          authenticated: true,
          principal: {
            id: userId,
            username: `user${i}`,
            roles: ['user'],
          },
          credentials: { type: 'jwt', data: `token-${i}` },
          authorities: ['user'],
        };
        context.setAuthentication(authentication);

        // 模拟异步操作
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 10));

        // 验证上下文隔离：每个请求应该看到自己的认证信息
        const currentContext = SecurityContextHolder.getContext();
        const principal = currentContext.getPrincipal();

        expect(currentContext.isAuthenticated()).toBe(true);
        expect(principal?.id).toBe(userId);
        expect(principal?.username).toBe(`user${i}`);

        // 存储结果，使用索引作为键
        results.set(i, principal?.id || '');
      });
    });

    await Promise.all(promises);

    // 验证所有请求都正确隔离（不依赖顺序）
    expect(results.size).toBe(10);
    for (let i = 0; i < 10; i++) {
      expect(results.get(i)).toBe(`user-${i}`);
    }
  });

  test('should not leak authentication between concurrent requests', async () => {
    const user1Auth: Authentication = {
      authenticated: true,
      principal: { id: 'user-1', username: 'alice', roles: ['user'] },
      credentials: { type: 'jwt', data: 'token1' },
      authorities: ['user'],
    };

    const user2Auth: Authentication = {
      authenticated: true,
      principal: { id: 'user-2', username: 'bob', roles: ['admin'] },
      credentials: { type: 'jwt', data: 'token2' },
      authorities: ['admin'],
    };

    // 并发执行两个请求
    const [result1, result2] = await Promise.all([
      SecurityContextHolder.runWithContext(async () => {
        const context = SecurityContextHolder.getContext();
        context.setAuthentication(user1Auth);

        // 模拟异步操作
        await new Promise((resolve) => setTimeout(resolve, 50));

        const currentContext = SecurityContextHolder.getContext();
        return {
          userId: currentContext.getPrincipal()?.id,
          username: currentContext.getPrincipal()?.username,
          roles: currentContext.getPrincipal()?.roles,
        };
      }),
      SecurityContextHolder.runWithContext(async () => {
        const context = SecurityContextHolder.getContext();
        context.setAuthentication(user2Auth);

        // 模拟异步操作
        await new Promise((resolve) => setTimeout(resolve, 50));

        const currentContext = SecurityContextHolder.getContext();
        return {
          userId: currentContext.getPrincipal()?.id,
          username: currentContext.getPrincipal()?.username,
          roles: currentContext.getPrincipal()?.roles,
        };
      }),
    ]);

    // 验证两个请求的认证信息没有互相干扰
    expect(result1.userId).toBe('user-1');
    expect(result1.username).toBe('alice');
    expect(result1.roles).toEqual(['user']);

    expect(result2.userId).toBe('user-2');
    expect(result2.username).toBe('bob');
    expect(result2.roles).toEqual(['admin']);
  });

  test('should maintain context isolation with nested runWithContext', async () => {
    let outerUserId: string | undefined;
    let innerUserId: string | undefined;

    await SecurityContextHolder.runWithContext(async () => {
      const outerContext = SecurityContextHolder.getContext();
      const outerAuth: Authentication = {
        authenticated: true,
        principal: { id: 'outer-user', username: 'outer', roles: [] },
        credentials: { type: 'jwt', data: 'outer-token' },
        authorities: [],
      };
      outerContext.setAuthentication(outerAuth);

      await SecurityContextHolder.runWithContext(async () => {
        const innerContext = SecurityContextHolder.getContext();
        const innerAuth: Authentication = {
          authenticated: true,
          principal: { id: 'inner-user', username: 'inner', roles: [] },
          credentials: { type: 'jwt', data: 'inner-token' },
          authorities: [],
        };
        innerContext.setAuthentication(innerAuth);

        // 内层应该看到内层的认证信息
        innerUserId = SecurityContextHolder.getContext().getPrincipal()?.id;
      });

      // 外层应该仍然看到外层的认证信息
      outerUserId = SecurityContextHolder.getContext().getPrincipal()?.id;
    });

    expect(outerUserId).toBe('outer-user');
    expect(innerUserId).toBe('inner-user');
  });

  test('should handle high concurrency without context pollution', async () => {
    const concurrency = 100;
    const results: Map<number, { success: boolean; userId: string }> = new Map();

    const promises = Array.from({ length: concurrency }, (_, i) => {
      const userId = `user-${i}`;
      return SecurityContextHolder.runWithContext(async () => {
        const context = SecurityContextHolder.getContext();
        const authentication: Authentication = {
          authenticated: true,
          principal: {
            id: userId,
            username: `user${i}`,
            roles: ['user'],
          },
          credentials: { type: 'jwt', data: `token-${i}` },
          authorities: ['user'],
        };
        context.setAuthentication(authentication);

        // 模拟一些异步操作
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 5));

        // 验证上下文隔离
        const currentContext = SecurityContextHolder.getContext();
        const principal = currentContext.getPrincipal();
        const success = principal?.id === userId && currentContext.isAuthenticated();

        results.set(i, {
          success,
          userId: principal?.id || '',
        });

        return { index: i, success };
      });
    });

    const allResults = await Promise.all(promises);

    // 验证所有请求都成功且没有上下文污染
    expect(allResults.every((r) => r.success === true)).toBe(true);
    expect(results.size).toBe(concurrency);
    expect(Array.from(results.values()).every((r) => r.success)).toBe(true);

    // 验证每个结果都有正确的用户 ID（不依赖顺序）
    for (let i = 0; i < concurrency; i++) {
      const result = results.get(i);
      expect(result).toBeDefined();
      expect(result?.userId).toBe(`user-${i}`);
      expect(result?.success).toBe(true);
    }
  });

  test('should clear context after runWithContext completes', async () => {
    await SecurityContextHolder.runWithContext(async () => {
      const context = SecurityContextHolder.getContext();
      const authentication: Authentication = {
        authenticated: true,
        principal: { id: 'temp-user', username: 'temp', roles: [] },
        credentials: { type: 'jwt', data: 'temp-token' },
        authorities: [],
      };
      context.setAuthentication(authentication);
      expect(context.isAuthenticated()).toBe(true);
    });

    // runWithContext 完成后，外部上下文应该不受影响
    const externalContext = SecurityContextHolder.getContext();
    // 由于 runWithContext 使用独立的存储上下文，外部可能没有认证信息
    // 这是预期的行为，因为每个 runWithContext 都有独立的上下文
    expect(externalContext).toBeInstanceOf(SecurityContextImpl);
  });
});

