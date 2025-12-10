import { Injectable, Inject } from '../../di/decorators';
import { DATABASE_SERVICE_TOKEN } from '../types';
import type { DatabaseService } from '../service';
import {
  Propagation,
  IsolationLevel,
  TransactionStatus,
  type TransactionOptions,
  type TransactionContext,
} from './transaction-types';

/**
 * 事务管理器
 * 管理数据库事务的生命周期
 */
@Injectable()
export class TransactionManager {
  private readonly transactions = new Map<string, TransactionContext>();
  private readonly connectionTransactions = new Map<unknown, string>(); // connection -> transactionId

  public constructor(
    @Inject(DATABASE_SERVICE_TOKEN)
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * 开始事务
   */
  public async beginTransaction(
    options: TransactionOptions = {},
  ): Promise<TransactionContext> {
    const transactionId = this.generateTransactionId();
    const context: TransactionContext = {
      id: transactionId,
      status: TransactionStatus.ACTIVE,
      startTime: Date.now(),
      level: 0,
      savepoints: [],
    };

    // 获取数据库连接
    const connection = await this.databaseService.getConnection();
    this.connectionTransactions.set(connection, transactionId);
    this.transactions.set(transactionId, context);

    // 开始事务（根据数据库类型）
    await this.executeBegin(connection, options);

    return context;
  }

  /**
   * 提交事务
   */
  public async commitTransaction(transactionId: string): Promise<void> {
    const context = this.transactions.get(transactionId);
    if (!context) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    if (context.status !== TransactionStatus.ACTIVE) {
      throw new Error(`Transaction ${transactionId} is not active`);
    }

    // 查找连接
    const connection = this.findConnectionByTransactionId(transactionId);
    if (!connection) {
      throw new Error(`Connection not found for transaction ${transactionId}`);
    }

    // 提交事务
    await this.executeCommit(connection);

    context.status = TransactionStatus.COMMITTED;
    this.cleanupTransaction(transactionId);
  }

  /**
   * 回滚事务
   */
  public async rollbackTransaction(transactionId: string): Promise<void> {
    const context = this.transactions.get(transactionId);
    if (!context) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    // 查找连接
    const connection = this.findConnectionByTransactionId(transactionId);
    if (!connection) {
      throw new Error(`Connection not found for transaction ${transactionId}`);
    }

    // 回滚事务
    await this.executeRollback(connection);

    context.status = TransactionStatus.ROLLED_BACK;
    this.cleanupTransaction(transactionId);
  }

  /**
   * 创建保存点（用于嵌套事务）
   */
  public async createSavepoint(transactionId: string): Promise<string> {
    const context = this.transactions.get(transactionId);
    if (!context) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    const savepointName = `sp_${context.level}_${Date.now()}`;
    context.savepoints = context.savepoints || [];
    context.savepoints.push(savepointName);
    context.level += 1;

    const connection = this.findConnectionByTransactionId(transactionId);
    if (connection) {
      await this.executeSavepoint(connection, savepointName);
    }

    return savepointName;
  }

  /**
   * 回滚到保存点
   */
  public async rollbackToSavepoint(
    transactionId: string,
    savepointName: string,
  ): Promise<void> {
    const context = this.transactions.get(transactionId);
    if (!context) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    const connection = this.findConnectionByTransactionId(transactionId);
    if (connection) {
      await this.executeRollbackToSavepoint(connection, savepointName);
    }

    // 移除该保存点之后的所有保存点
    const index = context.savepoints?.indexOf(savepointName) ?? -1;
    if (index >= 0 && context.savepoints) {
      context.savepoints = context.savepoints.slice(0, index);
      context.level = index;
    }
  }

  /**
   * 获取当前事务上下文
   */
  public getCurrentTransaction(): TransactionContext | null {
    // 简化实现：返回最后一个活动事务
    // 实际实现中应该使用 ThreadLocal 或类似机制
    for (const context of this.transactions.values()) {
      if (context.status === TransactionStatus.ACTIVE) {
        return context;
      }
    }
    return null;
  }

  /**
   * 检查是否有活动事务
   */
  public hasActiveTransaction(): boolean {
    return this.getCurrentTransaction() !== null;
  }

  /**
   * 生成事务 ID
   */
  private generateTransactionId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * 查找连接对应的事务 ID
   */
  private findConnectionByTransactionId(transactionId: string): unknown {
    for (const [connection, txId] of this.connectionTransactions.entries()) {
      if (txId === transactionId) {
        return connection;
      }
    }
    return null;
  }

  /**
   * 清理事务
   */
  private cleanupTransaction(transactionId: string): void {
    this.transactions.delete(transactionId);
    // 清理连接映射
    for (const [connection, txId] of this.connectionTransactions.entries()) {
      if (txId === transactionId) {
        this.connectionTransactions.delete(connection);
        break;
      }
    }
  }

  /**
   * 执行 BEGIN 语句
   */
  private async executeBegin(connection: unknown, options: TransactionOptions): Promise<void> {
    const dbType = this.databaseService['config'].database.type;

    if (dbType === 'sqlite') {
      // SQLite 默认自动提交，需要显式开始事务
      await this.databaseService.query('BEGIN TRANSACTION');
    } else if (dbType === 'postgres' || dbType === 'mysql') {
      // PostgreSQL 和 MySQL 使用 Bun.SQL，需要设置隔离级别
      let sql = 'START TRANSACTION';
      if (options.isolationLevel) {
        const isolation = this.getIsolationLevelSQL(options.isolationLevel);
        sql += ` ${isolation}`;
      }
      if (options.readOnly) {
        sql += ' READ ONLY';
      }
      await this.databaseService.query(sql);
    }
  }

  /**
   * 执行 COMMIT 语句
   */
  private async executeCommit(connection: unknown): Promise<void> {
    await this.databaseService.query('COMMIT');
  }

  /**
   * 执行 ROLLBACK 语句
   */
  private async executeRollback(connection: unknown): Promise<void> {
    await this.databaseService.query('ROLLBACK');
  }

  /**
   * 执行 SAVEPOINT 语句
   */
  private async executeSavepoint(connection: unknown, savepointName: string): Promise<void> {
    await this.databaseService.query(`SAVEPOINT ${savepointName}`);
  }

  /**
   * 执行 ROLLBACK TO SAVEPOINT 语句
   */
  private async executeRollbackToSavepoint(
    connection: unknown,
    savepointName: string,
  ): Promise<void> {
    await this.databaseService.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
  }

  /**
   * 获取隔离级别的 SQL
   */
  private getIsolationLevelSQL(level: IsolationLevel): string {
    const dbType = this.databaseService['config'].database.type;
    const levelMap: Record<IsolationLevel, string> = {
      [IsolationLevel.READ_UNCOMMITTED]: 'READ UNCOMMITTED',
      [IsolationLevel.READ_COMMITTED]: 'READ COMMITTED',
      [IsolationLevel.REPEATABLE_READ]: 'REPEATABLE READ',
      [IsolationLevel.SERIALIZABLE]: 'SERIALIZABLE',
    };

    if (dbType === 'postgres') {
      return `SET TRANSACTION ISOLATION LEVEL ${levelMap[level]}`;
    } else if (dbType === 'mysql') {
      return `SET TRANSACTION ISOLATION LEVEL ${levelMap[level]}`;
    }

    // SQLite 不支持隔离级别设置
    return '';
  }
}
