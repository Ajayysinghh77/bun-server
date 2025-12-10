/**
 * 事务传播行为
 */
export enum Propagation {
  /**
   * 如果当前存在事务，则加入该事务；如果当前不存在事务，则创建一个新的事务
   */
  REQUIRED = 'REQUIRED',
  /**
   * 创建一个新的事务，如果当前存在事务，则把当前事务挂起
   */
  REQUIRES_NEW = 'REQUIRES_NEW',
  /**
   * 如果当前存在事务，则加入该事务；如果当前不存在事务，则以非事务的方式继续运行
   */
  SUPPORTS = 'SUPPORTS',
  /**
   * 以非事务方式执行操作，如果当前存在事务，则把当前事务挂起
   */
  NOT_SUPPORTED = 'NOT_SUPPORTED',
  /**
   * 以非事务方式执行，如果当前存在事务，则抛出异常
   */
  NEVER = 'NEVER',
  /**
   * 如果当前存在事务，则在嵌套事务内执行；如果当前不存在事务，则创建一个新的事务
   */
  NESTED = 'NESTED',
}

/**
 * 事务隔离级别
 */
export enum IsolationLevel {
  /**
   * 读未提交（最低级别）
   */
  READ_UNCOMMITTED = 'READ_UNCOMMITTED',
  /**
   * 读已提交
   */
  READ_COMMITTED = 'READ_COMMITTED',
  /**
   * 可重复读
   */
  REPEATABLE_READ = 'REPEATABLE_READ',
  /**
   * 串行化（最高级别）
   */
  SERIALIZABLE = 'SERIALIZABLE',
}

/**
 * 事务状态
 */
export enum TransactionStatus {
  /**
   * 活动状态
   */
  ACTIVE = 'ACTIVE',
  /**
   * 已提交
   */
  COMMITTED = 'COMMITTED',
  /**
   * 已回滚
   */
  ROLLED_BACK = 'ROLLED_BACK',
  /**
   * 已挂起
   */
  SUSPENDED = 'SUSPENDED',
}

/**
 * 事务配置选项
 */
export interface TransactionOptions {
  /**
   * 事务传播行为
   * @default Propagation.REQUIRED
   */
  propagation?: Propagation;
  /**
   * 事务隔离级别
   */
  isolationLevel?: IsolationLevel;
  /**
   * 超时时间（秒）
   */
  timeout?: number;
  /**
   * 是否只读
   * @default false
   */
  readOnly?: boolean;
  /**
   * 回滚异常类型（遇到这些异常时回滚）
   */
  rollbackFor?: Array<new () => Error>;
  /**
   * 不回滚异常类型（遇到这些异常时不回滚）
   */
  noRollbackFor?: Array<new () => Error>;
}

/**
 * 事务上下文
 */
export interface TransactionContext {
  /**
   * 事务 ID
   */
  id: string;
  /**
   * 事务状态
   */
  status: TransactionStatus;
  /**
   * 事务开始时间
   */
  startTime: number;
  /**
   * 嵌套层级
   */
  level: number;
  /**
   * 父事务 ID（如果有）
   */
  parentId?: string;
  /**
   * 保存点（用于嵌套事务）
   */
  savepoints?: string[];
}

/**
 * Transaction Service Token
 */
export const TRANSACTION_SERVICE_TOKEN = Symbol('@dangao/bun-server:orm:transaction:service');
