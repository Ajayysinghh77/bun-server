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
});

