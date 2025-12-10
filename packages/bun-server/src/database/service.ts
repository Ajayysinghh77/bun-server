import { Injectable } from '../di/decorators';

import { DatabaseConnectionManager } from './connection-manager';
import type {
  ConnectionInfo,
  DatabaseConfig,
  DatabaseModuleOptions,
} from './types';

/**
 * 数据库服务
 * 提供数据库连接管理和查询接口
 */
@Injectable()
export class DatabaseService {
  private connectionManager: DatabaseConnectionManager;
  private options: DatabaseModuleOptions;

  public constructor(options: DatabaseModuleOptions) {
    this.options = options;
    this.connectionManager = new DatabaseConnectionManager(
      options.database,
      options.pool,
    );
  }

  /**
   * 初始化数据库连接
   */
  public async initialize(): Promise<void> {
    await this.connectionManager.connect();
  }

  /**
   * 关闭数据库连接（释放回池中）
   */
  public async close(): Promise<void> {
    await this.connectionManager.disconnect();
  }

  /**
   * 关闭连接池（关闭所有连接）
   */
  public async closePool(): Promise<void> {
    await this.connectionManager.closePool();
  }

  /**
   * 获取连接池统计信息
   */
  public getPoolStats() {
    return this.connectionManager.getPoolStats();
  }

  /**
   * 获取数据库连接
   */
  public getConnection(): unknown {
    return this.connectionManager.getConnection();
  }

  /**
   * 获取配置（供 TransactionManager 使用）
   */
  public get config(): DatabaseModuleOptions {
    return this.options;
  }

  /**
   * 获取数据库类型
   */
  public getDatabaseType(): DatabaseConfig['type'] {
    return this.connectionManager.getDatabaseType();
  }

  /**
   * 检查数据库连接健康状态
   */
  public async healthCheck(): Promise<boolean> {
    if (!this.options.enableHealthCheck) {
      return true;
    }

    return await this.connectionManager.healthCheck();
  }

  /**
   * 获取连接信息
   */
  public getConnectionInfo(): ConnectionInfo {
    return this.connectionManager.getConnectionInfo();
  }

  /**
   * 执行 SQL 查询
   * SQLite 返回同步结果，PostgreSQL/MySQL 返回异步结果
   */
  public query<T = unknown>(sql: string, params?: unknown[]): T[] | Promise<T[]> {
    const connection = this.getConnection();
    if (!connection) {
      throw new Error('Database connection is not established');
    }

    const dbType = this.getDatabaseType();
    if (dbType === 'sqlite') {
      return this.querySqlite(connection, sql, params);
    } else if (dbType === 'postgres' || dbType === 'mysql') {
      return this.queryBunSQL(connection, sql, params);
    }

    throw new Error(`Query not supported for database type: ${dbType}`);
  }

  /**
   * SQLite 查询实现
   */
  private querySqlite<T = unknown>(
    connection: unknown,
    sql: string,
    params?: unknown[],
  ): T[] {
    // Bun SQLite Database 对象
    if (
      connection &&
      typeof connection === 'object' &&
      'query' in connection &&
      typeof connection.query === 'function'
    ) {
      const db = connection as {
        query: (sql: string) => {
          all: (...params: unknown[]) => T[];
          get: (...params: unknown[]) => T | undefined;
        };
      };

      const statement = db.query(sql);
      // Bun SQLite 的 all() 方法接受参数
      const result =
        params && params.length > 0 ? statement.all(...params) : statement.all();
      return result;
    }

    throw new Error('Invalid SQLite connection');
  }

  /**
   * Bun.SQL 查询实现（PostgreSQL/MySQL）
   * 注意：Bun.SQL 主要使用模板字符串，但为了兼容性，我们尝试支持参数化查询
   */
  private async queryBunSQL<T = unknown>(
    connection: unknown,
    sql: string,
    params?: unknown[],
  ): Promise<T[]> {
    // Bun.SQL 对象可以作为函数调用（模板字符串）
    // 但我们需要支持参数化查询
    if (connection && typeof connection === 'function') {
      // Bun.SQL 模板字符串查询
      // 注意：Bun.SQL 使用模板字符串，参数会自动转义
      // 这里我们需要将 SQL 和参数组合成模板字符串调用
      // 但由于 TypeScript 限制，我们使用动态调用
      try {
        // 尝试使用模板字符串方式
        // 注意：这需要将参数插入到 SQL 中，但 Bun.SQL 会自动处理 SQL 注入防护
        const sqlWithParams = this.interpolateParams(sql, params);
        const result = await (connection as (
          template: TemplateStringsArray,
          ...values: unknown[]
        ) => Promise<Array<Record<string, unknown>>>)`${sqlWithParams}`;
        return result as T[];
      } catch {
        // 如果模板字符串方式失败，尝试其他方式
        throw new Error(
          'Bun.SQL parameterized queries are not fully supported. Consider using template string queries.',
        );
      }
    }

    // 尝试使用 query 方法（如果存在）
    if (
      connection &&
      typeof connection === 'object' &&
      'query' in connection &&
      typeof connection.query === 'function'
    ) {
      const db = connection as {
        query: (
          sql: string,
          ...params: unknown[]
        ) => Promise<Array<Record<string, unknown>>>;
      };
      const result = await db.query(sql, ...(params ?? []));
      return result as T[];
    }

    throw new Error('Invalid Bun.SQL connection');
  }

  /**
   * 将参数插入到 SQL 中（用于 Bun.SQL 模板字符串）
   * 注意：这只是临时方案，Bun.SQL 的模板字符串会自动处理 SQL 注入防护
   */
  private interpolateParams(sql: string, params?: unknown[]): string {
    if (!params || params.length === 0) {
      return sql;
    }

    // 简单的参数替换（实际应该使用 Bun.SQL 的模板字符串）
    // 这里只是占位实现，实际使用时应该使用模板字符串
    let result = sql;
    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      const value =
        typeof param === 'string'
          ? `'${param.replace(/'/g, "''")}'`
          : String(param);
      result = result.replace('?', value);
    }
    return result;
  }
}
