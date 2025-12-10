/**
 * 数据库类型
 */
export type DatabaseType = 'sqlite' | 'postgres' | 'mysql';

/**
 * SQLite 配置
 */
export interface SqliteConfig {
  /**
   * 数据库文件路径（相对或绝对路径）
   * 例如：':memory:' 表示内存数据库，'./data.db' 表示文件数据库
   */
  path: string;
}

/**
 * PostgreSQL 配置
 */
export interface PostgresConfig {
  /**
   * 数据库主机
   */
  host: string;
  /**
   * 数据库端口
   */
  port: number;
  /**
   * 数据库名称
   */
  database: string;
  /**
   * 用户名
   */
  user: string;
  /**
   * 密码
   */
  password: string;
  /**
   * SSL 配置（可选）
   */
  ssl?: boolean;
}

/**
 * MySQL 配置
 */
export interface MysqlConfig {
  /**
   * 数据库主机
   */
  host: string;
  /**
   * 数据库端口
   */
  port: number;
  /**
   * 数据库名称
   */
  database: string;
  /**
   * 用户名
   */
  user: string;
  /**
   * 密码
   */
  password: string;
}

/**
 * 数据库配置（联合类型）
 */
export type DatabaseConfig =
  | { type: 'sqlite'; config: SqliteConfig }
  | { type: 'postgres'; config: PostgresConfig }
  | { type: 'mysql'; config: MysqlConfig };

/**
 * 连接池配置
 */
export interface ConnectionPoolOptions {
  /**
   * 最大连接数
   * @default 10
   */
  maxConnections?: number;
  /**
   * 连接超时时间（毫秒）
   * @default 30000
   */
  connectionTimeout?: number;
  /**
   * 连接重试次数
   * @default 3
   */
  retryCount?: number;
  /**
   * 重试延迟（毫秒）
   * @default 1000
   */
  retryDelay?: number;
}

/**
 * DatabaseModule 配置选项
 */
export interface DatabaseModuleOptions {
  /**
   * 数据库配置
   */
  database: DatabaseConfig;
  /**
   * 连接池配置
   */
  pool?: ConnectionPoolOptions;
  /**
   * 是否启用连接健康检查
   * @default true
   */
  enableHealthCheck?: boolean;
  /**
   * ORM 配置（可选）
   */
  orm?: {
    /**
     * 是否启用 ORM
     * @default false
     */
    enabled?: boolean;
    /**
     * Drizzle 数据库实例（如果使用 Drizzle ORM）
     */
    drizzle?: unknown;
  };
}

/**
 * 数据库连接状态
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

/**
 * 数据库连接信息
 */
export interface ConnectionInfo {
  /**
   * 连接状态
   */
  status: ConnectionStatus;
  /**
   * 数据库类型
   */
  type: DatabaseType;
  /**
   * 连接错误信息（如果有）
   */
  error?: string;
}

/**
 * DatabaseService Token
 */
export const DATABASE_SERVICE_TOKEN = Symbol('@dangao/bun-server:database:service');

/**
 * DatabaseModule Options Token
 */
export const DATABASE_OPTIONS_TOKEN = Symbol('@dangao/bun-server:database:options');
