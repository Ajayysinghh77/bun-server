import { describe, expect, test, beforeEach } from 'bun:test';
import { RoleBasedAccessDecisionManager } from '../../src/security/access-decision-manager';
import type { Authentication } from '../../src/security/types';

describe('RoleBasedAccessDecisionManager', () => {
  let manager: RoleBasedAccessDecisionManager;

  beforeEach(() => {
    manager = new RoleBasedAccessDecisionManager();
  });

  test('should allow access when no roles required', () => {
    const authentication: Authentication = {
      authenticated: true,
      principal: { id: 'user-1', username: 'test', roles: [] },
      credentials: { type: 'jwt', data: 'token' },
      authorities: [],
    };

    const result = manager.decide(authentication, []);
    expect(result).toBe(true);
  });

  test('should deny access when not authenticated', () => {
    const authentication: Authentication = {
      authenticated: false,
      principal: { id: 'user-1', username: 'test', roles: [] },
      credentials: { type: 'jwt', data: 'token' },
      authorities: [],
    };

    const result = manager.decide(authentication, ['admin']);
    expect(result).toBe(false);
  });

  test('should allow access when user has required role', () => {
    const authentication: Authentication = {
      authenticated: true,
      principal: { id: 'user-1', username: 'test', roles: ['admin'] },
      credentials: { type: 'jwt', data: 'token' },
      authorities: ['admin'],
    };

    const result = manager.decide(authentication, ['admin']);
    expect(result).toBe(true);
  });

  test('should allow access when user has one of required roles', () => {
    const authentication: Authentication = {
      authenticated: true,
      principal: { id: 'user-1', username: 'test', roles: ['user'] },
      credentials: { type: 'jwt', data: 'token' },
      authorities: ['user'],
    };

    const result = manager.decide(authentication, ['admin', 'user']);
    expect(result).toBe(true);
  });

  test('should deny access when user does not have required role', () => {
    const authentication: Authentication = {
      authenticated: true,
      principal: { id: 'user-1', username: 'test', roles: ['user'] },
      credentials: { type: 'jwt', data: 'token' },
      authorities: ['user'],
    };

    const result = manager.decide(authentication, ['admin']);
    expect(result).toBe(false);
  });

  test('should handle empty authorities', () => {
    const authentication: Authentication = {
      authenticated: true,
      principal: { id: 'user-1', username: 'test', roles: [] },
      credentials: { type: 'jwt', data: 'token' },
      authorities: [],
    };

    const result = manager.decide(authentication, ['admin']);
    expect(result).toBe(false);
  });
});

