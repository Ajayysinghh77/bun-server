import type {
  HealthIndicator,
  HealthIndicatorResult,
} from '../health/types';
import { DATABASE_SERVICE_TOKEN } from './types';
import type { DatabaseService } from './service';

/**
 * 数据库健康检查指示器
 */
export class DatabaseHealthIndicator implements HealthIndicator {
  public readonly name = 'database';

  public constructor(private readonly databaseService: DatabaseService) {}

  /**
   * 执行数据库健康检查
   */
  public async check(): Promise<HealthIndicatorResult> {
    try {
      const isHealthy = await this.databaseService.healthCheck();
      const connectionInfo = this.databaseService.getConnectionInfo();

      if (isHealthy) {
        return {
          status: 'up',
          details: {
            type: connectionInfo.type,
            status: connectionInfo.status,
          },
        };
      }

      return {
        status: 'down',
        details: {
          type: connectionInfo.type,
          status: connectionInfo.status,
          error: connectionInfo.error,
        },
      };
    } catch (error) {
      return {
        status: 'down',
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }
}
