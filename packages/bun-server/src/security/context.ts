import { AsyncLocalStorage } from 'async_hooks';

import type { Authentication, Principal, SecurityContext } from './types';

/**
 * 安全上下文实现
 */
export class SecurityContextImpl implements SecurityContext {
  private _authentication: Authentication | null = null;

  /**
   * 当前认证信息
   */
  public get authentication(): Authentication | null {
    return this._authentication;
  }

  /**
   * 设置认证信息
   */
  public setAuthentication(authentication: Authentication | null): void {
    this._authentication = authentication;
  }

  /**
   * 是否已认证
   */
  public isAuthenticated(): boolean {
    return this._authentication?.authenticated ?? false;
  }

  /**
   * 获取主体
   */
  public getPrincipal(): Principal | null {
    return this._authentication?.principal ?? null;
  }

  /**
   * 获取权限
   */
  public getAuthorities(): string[] {
    return this._authentication?.authorities ?? [];
  }

  /**
   * 清除认证信息
   */
  public clear(): void {
    this._authentication = null;
  }
}

/**
 * 安全上下文持有者（ThreadLocal 模式）
 */
export class SecurityContextHolder {
  private static readonly storage = new AsyncLocalStorage<SecurityContextImpl>();

  /**
   * 获取当前上下文
   */
  public static getContext(): SecurityContextImpl {
    let context = this.storage.getStore();
    if (!context) {
      context = new SecurityContextImpl();
      this.storage.enterWith(context);
    }
    return context;
  }

  /**
   * 在给定回调中运行，绑定独立的安全上下文（每个请求一个）
   * @param callback - 要在安全上下文中执行的回调
   */
  public static runWithContext<T>(callback: () => T): T {
    // 总是创建新的上下文，确保每个请求都有独立的上下文
    const context = new SecurityContextImpl();
    return this.storage.run(context, callback);
  }

  /**
   * 清除当前上下文中的认证信息
   */
  public static clearContext(): void {
    const context = this.storage.getStore();
    if (context) {
      context.clear();
    }
  }
}

