import type { Container } from '../di/container';
import type { ApplicationExtension } from '../extensions/types';

import { DATABASE_SERVICE_TOKEN } from './types';
import type { DatabaseService } from './service';

/**
 * 数据库扩展
 * 在应用启动时自动初始化数据库连接
 */
export class DatabaseExtension implements ApplicationExtension {
  public register(container: Container): void {
    // 扩展注册时不初始化，等待应用启动时初始化
    // 这里只是标记需要初始化
  }

  /**
   * 初始化数据库连接
   * 应该在应用启动时调用
   */
  public async initialize(container: Container): Promise<void> {
    try {
      const databaseService = container.resolve<DatabaseService>(
        DATABASE_SERVICE_TOKEN,
      );
      await databaseService.initialize();
    } catch (error) {
      // 如果 DatabaseService 未注册，忽略错误
      // 这意味着用户可能没有使用 DatabaseModule
      if (
        error instanceof Error &&
        error.message.includes('Provider not found')
      ) {
        return;
      }
      throw error;
    }
  }

  /**
   * 关闭数据库连接
   * 应该在应用停止时调用
   */
  public async close(container: Container): Promise<void> {
    try {
      const databaseService = container.resolve<DatabaseService>(
        DATABASE_SERVICE_TOKEN,
      );
      // 关闭连接池（关闭所有连接）
      await databaseService.closePool();
    } catch (error) {
      // 如果 DatabaseService 未注册，忽略错误
      if (
        error instanceof Error &&
        error.message.includes('Provider not found')
      ) {
        return;
      }
      throw error;
    }
  }
}
