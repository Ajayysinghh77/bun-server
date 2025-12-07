import type { Context } from '../core/context';
import type { Middleware } from '../middleware';
import { UnauthorizedException, ForbiddenException } from '../error/http-exception';
import { JWTUtil } from './jwt';
import type { AuthContext, JWTPayload } from './types';
import { requiresAuth, checkRoles } from './decorators';

/**
 * 认证中间件配置
 */
export interface AuthMiddlewareOptions {
  /**
   * JWT 工具实例
   */
  jwtUtil: JWTUtil;
  /**
   * 是否启用全局认证（所有路由都需要认证）
   * @default false
   */
  globalAuth?: boolean;
  /**
   * 排除的路径列表（不需要认证）
   */
  excludePaths?: string[];
  /**
   * 令牌提取函数
   */
  extractToken?: (ctx: Context) => string | null;
}

/**
 * 创建认证中间件
 */
export function createAuthMiddleware(options: AuthMiddlewareOptions): Middleware {
  const { jwtUtil, globalAuth = false, excludePaths = [], extractToken } = options;

  return async (ctx: Context, next) => {
    // 检查是否在排除列表中
    const path = ctx.request.url.split('?')[0];
    if (excludePaths.some((exclude) => path.startsWith(exclude))) {
      return await next();
    }

    // 提取令牌
    const token = extractToken
      ? extractToken(ctx)
      : extractTokenFromHeader(ctx);

    // 验证令牌
    let payload: JWTPayload | null = null;
    if (token) {
      payload = jwtUtil.verify(token);
    }

    // 设置认证上下文
    const authContext: AuthContext = {
      isAuthenticated: !!payload,
      payload: payload || undefined,
      user: payload
        ? {
            id: payload.sub,
            username: (payload.username as string) || payload.sub,
            roles: payload.roles as string[] || [],
          }
        : undefined,
    };

    // 将认证上下文附加到 Context
    (ctx as any).auth = authContext;

    // 检查是否需要认证
    const handler = (ctx as any).routeHandler;
    if (handler) {
      const controller = handler.controller;
      const method = handler.method;

      if (requiresAuth(controller, method)) {
        if (!authContext.isAuthenticated) {
          throw new UnauthorizedException('Authentication required');
        }

        if (!checkRoles(controller, method, authContext.user?.roles)) {
          throw new ForbiddenException('Insufficient permissions');
        }
      }
    } else if (globalAuth && !authContext.isAuthenticated) {
      throw new UnauthorizedException('Authentication required');
    }

    return await next();
  };
}

/**
 * 从请求头提取令牌
 */
function extractTokenFromHeader(ctx: Context): string | null {
  const authHeader = ctx.getHeader('authorization');
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

