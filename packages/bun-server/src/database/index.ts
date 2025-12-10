export { DatabaseModule } from './database-module';
export { DatabaseService } from './service';
export { DatabaseConnectionManager } from './connection-manager';
export { ConnectionPool } from './connection-pool';
export { DatabaseHealthIndicator } from './health-indicator';
export { DatabaseExtension } from './database-extension';
export {
  DATABASE_OPTIONS_TOKEN,
  DATABASE_SERVICE_TOKEN,
  type ConnectionInfo,
  type ConnectionPoolOptions,
  type DatabaseConfig,
  type DatabaseModuleOptions,
  type DatabaseType,
  type MysqlConfig,
  type PostgresConfig,
  type SqliteConfig,
} from './types';
// ORM 导出
export {
  Entity,
  Column,
  PrimaryKey,
  Repository,
  BaseRepository,
  DrizzleBaseRepository,
  OrmService,
  ORM_SERVICE_TOKEN,
  getEntityMetadata,
  getColumnMetadata,
  getRepositoryMetadata,
  type OrmModuleOptions,
  type BaseRepository as BaseRepositoryInterface,
  type EntityMetadata,
  type ColumnMetadata,
  // Transaction exports
  Transactional,
  TransactionManager,
  TransactionInterceptor,
  Propagation,
  IsolationLevel,
  TransactionStatus,
  TRANSACTION_SERVICE_TOKEN,
  getTransactionMetadata,
  type TransactionOptions,
  type TransactionContext,
} from './orm';
