import { Injectable } from '../../di/decorators';
import type { DatabaseService } from '../service';
import type { OrmModuleOptions } from './types';

/**
 * ORM 服务
 * 提供 ORM 相关的功能，如 Drizzle 实例管理
 */
@Injectable()
export class OrmService {
  private drizzleInstance: unknown | null = null;

  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly options: OrmModuleOptions = {},
  ) {}

  /**
   * 获取 Drizzle 实例
   * 如果未提供，则根据数据库类型创建
   */
  public getDrizzle(): unknown {
    if (this.options.drizzle) {
      return this.options.drizzle;
    }

    if (this.drizzleInstance) {
      return this.drizzleInstance;
    }

    // 如果未提供 Drizzle 实例，返回 null
    // 用户需要手动创建并传入
    return null;
  }

  /**
   * 设置 Drizzle 实例
   */
  public setDrizzle(drizzle: unknown): void {
    this.drizzleInstance = drizzle;
  }

  /**
   * 获取数据库服务
   */
  public getDatabaseService(): DatabaseService {
    return this.databaseService;
  }
}
