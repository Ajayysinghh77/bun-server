import { Module, MODULE_METADATA_KEY } from '../di/module';
import { JWTUtil } from './jwt';
import { OAuth2Service } from './oauth2';
import { createAuthMiddleware } from './middleware';
import { OAuth2Controller, OAUTH2_SERVICE_TOKEN, JWT_UTIL_TOKEN } from './controller';
import type {
  AuthModuleOptions,
  UserInfo,
} from './types';

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
 * 认证模块配置
 */
export interface AuthModuleConfig extends AuthModuleOptions {
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
   * 排除的路径列表（不需要认证）
   */
  excludePaths?: string[];
}

/**
 * 认证模块
 */
@Module({
  controllers: [
    // 将在运行时根据配置添加
  ],
  providers: [
    // 将在运行时根据配置添加
  ],
  middlewares: [
    // 将在运行时根据配置添加
  ],
})
export class AuthModule {
  /**
   * 创建认证模块
   * @param config - 模块配置
   */
  public static forRoot(config: AuthModuleConfig): typeof AuthModule {
    // 创建 JWT 工具
    const jwtUtil = new JWTUtil(config.jwt);

    // 创建 OAuth2 服务
    const userProvider = config.userProvider
      ? async (userId: string) => config.userProvider!.findById(userId)
      : undefined;
    const oauth2Service = new OAuth2Service(
      jwtUtil,
      config.clients || [],
      config.codeConfig,
      userProvider,
    );

    const controllers: any[] = [];
    const providers: any[] = [];
    const middlewares: any[] = [];

    // 如果启用 OAuth2 端点，添加控制器
    if (config.enableOAuth2Endpoints !== false) {
      controllers.push(OAuth2Controller);
    }

    // 注册服务提供者
    providers.push(
      {
        provide: JWT_UTIL_TOKEN,
        useValue: jwtUtil,
      },
      {
        provide: OAUTH2_SERVICE_TOKEN,
        useValue: oauth2Service,
      },
    );

    // 如果启用认证中间件，添加中间件
    if (config.enableAuthMiddleware !== false) {
      const authMiddleware = createAuthMiddleware({
        jwtUtil,
        globalAuth: false,
        excludePaths: [
          ...(config.excludePaths || []),
          ...(config.enableOAuth2Endpoints !== false
            ? [config.oauth2Prefix || '/oauth2']
            : []),
        ],
      });
      middlewares.push(authMiddleware);
    }

    // 动态更新模块元数据
    const existingMetadata = Reflect.getMetadata(MODULE_METADATA_KEY, AuthModule) || {};
    const metadata = {
      ...existingMetadata,
      controllers: [...(existingMetadata.controllers || []), ...controllers],
      providers: [...(existingMetadata.providers || []), ...providers],
      middlewares: [...(existingMetadata.middlewares || []), ...middlewares],
    };
    Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, AuthModule);

    return AuthModule;
  }
}

