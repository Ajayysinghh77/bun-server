import type { DatabaseService } from '../service';

/**
 * ORM 配置选项
 */
export interface OrmModuleOptions {
  /**
   * 是否启用 ORM
   * @default true
   */
  enabled?: boolean;
  /**
   * Drizzle 数据库实例（如果使用 Drizzle ORM）
   */
  drizzle?: unknown;
  /**
   * 数据库服务（用于创建 Drizzle 实例）
   */
  databaseService?: DatabaseService;
}

/**
 * Repository 基类接口
 */
export interface BaseRepository<T = unknown> {
  /**
   * 查找所有记录
   */
  findAll(): Promise<T[]>;
  /**
   * 根据 ID 查找记录
   */
  findById(id: string | number): Promise<T | null>;
  /**
   * 创建记录
   */
  create(data: Partial<T>): Promise<T>;
  /**
   * 更新记录
   */
  update(id: string | number, data: Partial<T>): Promise<T>;
  /**
   * 删除记录
   */
  delete(id: string | number): Promise<boolean>;
}

/**
 * Entity 元数据
 */
export interface EntityMetadata {
  /**
   * 表名
   */
  tableName: string;
  /**
   * 主键字段名
   */
  primaryKey?: string;
  /**
   * 字段元数据
   */
  columns: ColumnMetadata[];
}

/**
 * 列元数据
 */
export interface ColumnMetadata {
  /**
   * 字段名
   */
  name: string;
  /**
   * 字段类型
   */
  type: string;
  /**
   * 是否为主键
   */
  primaryKey?: boolean;
  /**
   * 是否自动递增
   */
  autoIncrement?: boolean;
  /**
   * 是否可为空
   */
  nullable?: boolean;
  /**
   * 默认值
   */
  defaultValue?: unknown;
}

/**
 * ORM Service Token
 */
export const ORM_SERVICE_TOKEN = Symbol('@dangao/bun-server:orm:service');
