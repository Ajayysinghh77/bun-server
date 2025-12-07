import 'reflect-metadata';

/**
 * 认证元数据键
 */
const AUTH_METADATA_KEY = Symbol('@dangao/bun-server:auth');

/**
 * 认证配置
 */
export interface AuthConfig {
  /**
   * 是否需要认证
   * @default true
   */
  required?: boolean;
  /**
   * 允许的角色列表
   */
  roles?: string[];
  /**
   * 是否允许匿名访问
   * @default false
   */
  allowAnonymous?: boolean;
}

/**
 * 认证装饰器
 * 用于标记需要认证的路由
 */
export function Auth(config: AuthConfig = {}): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const metadata = Reflect.getMetadata(AUTH_METADATA_KEY, target) || {};
    metadata[propertyKey] = {
      required: config.required !== false,
      roles: config.roles || [],
      allowAnonymous: config.allowAnonymous || false,
    };
    Reflect.defineMetadata(AUTH_METADATA_KEY, metadata, target);
  };
}

/**
 * 获取认证元数据
 */
export function getAuthMetadata(
  target: Object,
  propertyKey: string | symbol,
): AuthConfig | undefined {
  const metadata = Reflect.getMetadata(AUTH_METADATA_KEY, target);
  return metadata?.[propertyKey];
}

/**
 * 检查是否需要认证
 */
export function requiresAuth(target: Object, propertyKey: string | symbol): boolean {
  const config = getAuthMetadata(target, propertyKey);
  return config?.required !== false;
}

/**
 * 检查角色权限
 */
export function checkRoles(
  target: Object,
  propertyKey: string | symbol,
  userRoles: string[] = [],
): boolean {
  const config = getAuthMetadata(target, propertyKey);
  if (!config?.roles || config.roles.length === 0) {
    return true;
  }
  return config.roles.some((role) => userRoles.includes(role));
}

