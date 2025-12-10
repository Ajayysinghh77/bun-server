import { Injectable, Inject } from '../../di/decorators';
import { DATABASE_SERVICE_TOKEN } from '../types';
import type { DatabaseService } from '../service';

/**
 * Repository 基类
 * 提供基础的 CRUD 操作
 */
export abstract class BaseRepository<T = unknown> {
  protected abstract tableName: string;
  protected abstract primaryKey: string;

  public constructor(
    @Inject(DATABASE_SERVICE_TOKEN)
    protected readonly databaseService: DatabaseService,
  ) {}

  /**
   * 查找所有记录
   */
  public async findAll(): Promise<T[]> {
    const sql = `SELECT * FROM ${this.tableName}`;
    const result = await this.executeQuery<T>(sql);
    return Array.isArray(result) ? result : [];
  }

  /**
   * 根据 ID 查找记录
   */
  public async findById(id: string | number): Promise<T | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
    const result = await this.executeQuery<T>(sql, [id]);
    if (Array.isArray(result) && result.length > 0) {
      return result[0] as T;
    }
    return null;
  }

  /**
   * 创建记录
   */
  public async create(data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;

    await this.executeQuery(sql, values);

    // 获取最后插入的 ID
    const lastIdResult = await this.executeQuery<{ id: number }>(
      'SELECT last_insert_rowid() as id',
    );
    const lastId = Array.isArray(lastIdResult) && lastIdResult[0]
      ? lastIdResult[0].id
      : null;

    if (lastId !== null) {
      return (await this.findById(lastId)) as T;
    }

    return data as T;
  }

  /**
   * 更新记录
   */
  public async update(id: string | number, data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.primaryKey} = ?`;

    await this.executeQuery(sql, [...values, id]);

    return (await this.findById(id)) as T;
  }

  /**
   * 删除记录
   */
  public async delete(id: string | number): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
    await this.executeQuery(sql, [id]);
    return true;
  }

  /**
   * 执行查询
   */
  protected async executeQuery<T = unknown>(
    sql: string,
    params?: unknown[],
  ): Promise<T[]> {
    const result = this.databaseService.query<T>(sql, params);
    // SQLite 返回同步结果，PostgreSQL/MySQL 返回 Promise
    if (result instanceof Promise) {
      const resolved = await result;
      return Array.isArray(resolved) ? resolved : [resolved];
    }
    return Array.isArray(result) ? result : [result];
  }
}
