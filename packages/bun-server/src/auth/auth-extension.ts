import type { Container } from '../di/container';
import type { ApplicationExtension } from '../extensions/types';
import { JWTUtil } from './jwt';
import { OAuth2Service } from './oauth2';
import { createAuthMiddleware } from './middleware';
import { OAuth2Controller, OAUTH2_SERVICE_TOKEN, JWT_UTIL_TOKEN } from './controller';
import type { AuthModuleOptions, UserInfo } from './types';

/**
 * 用户提供者接口
 */
export interface UserProvider {
  /**
   * 根据用户 ID 获取用户信息
   */
  findById(userId: string): Promise<UserInfo | null>;
}

/**
 * 认证扩展配置
 */
export interface AuthExtensionOptions extends AuthModuleOptions {
  /**
   * 用户提供者（可选）
   */
  userProvider?: UserProvider;
  /**
   * 是否启用认证中间件
   * @default true
   */
  enableAuthMiddleware?: boolean;
  /**
   * 是否启用 OAuth2 控制器
   * @default true
   */
  enableOAuth2Controller?: boolean;
  /**
   * 排除的路径列表（不需要认证）
   */
  excludePaths?: string[];
}

/**
 * 认证扩展
 */
export class AuthExtension implements ApplicationExtension {
  private readonly options: AuthExtensionOptions;
  private jwtUtil?: JWTUtil;
  private oauth2Service?: OAuth2Service;

  public constructor(options: AuthExtensionOptions) {
    this.options = options;
  }

  /**
   * 注册扩展
   */
  public register(container: Container): void {
    // 创建 JWT 工具
    this.jwtUtil = new JWTUtil(this.options.jwt);
    container.registerInstance(JWT_UTIL_TOKEN, this.jwtUtil);

    // 创建 OAuth2 服务
    const userProvider = this.options.userProvider
      ? async (userId: string) => this.options.userProvider!.findById(userId)
      : undefined;
    this.oauth2Service = new OAuth2Service(
      this.jwtUtil,
      this.options.clients || [],
      this.options.codeConfig,
      userProvider,
    );
    container.registerInstance(OAUTH2_SERVICE_TOKEN, this.oauth2Service);

    // 注册 OAuth2 控制器
    if (this.options.enableOAuth2Controller !== false) {
      container.register(OAuth2Controller);
    }
  }

  /**
   * 获取 JWT 工具实例
   */
  public getJWTUtil(): JWTUtil {
    if (!this.jwtUtil) {
      throw new Error('AuthExtension not registered');
    }
    return this.jwtUtil;
  }

  /**
   * 获取 OAuth2 服务实例
   */
  public getOAuth2Service(): OAuth2Service {
    if (!this.oauth2Service) {
      throw new Error('AuthExtension not registered');
    }
    return this.oauth2Service;
  }

  /**
   * 创建认证中间件
   */
  public createAuthMiddleware() {
    if (!this.jwtUtil) {
      throw new Error('AuthExtension not registered');
    }
    return createAuthMiddleware({
      jwtUtil: this.jwtUtil,
      globalAuth: false,
      excludePaths: [
        ...(this.options.excludePaths || []),
        ...(this.options.enableOAuth2Controller !== false
          ? [this.options.oauth2Prefix || '/oauth2']
          : []),
      ],
    });
  }
}

