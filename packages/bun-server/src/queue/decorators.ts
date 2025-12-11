import 'reflect-metadata';

/**
 * 队列装饰器元数据键
 */
const QUEUE_METADATA_KEY = Symbol('@dangao/bun-server:queue:queue');
const CRON_METADATA_KEY = Symbol('@dangao/bun-server:queue:cron');

/**
 * 队列配置
 */
export interface QueueOptions {
  /**
   * 队列名称
   * @default 'default'
   */
  name?: string;
}

/**
 * Cron 配置
 */
export interface CronDecoratorOptions {
  /**
   * Cron 表达式
   */
  pattern: string;

  /**
   * 时区
   * @default 'UTC'
   */
  timezone?: string;

  /**
   * 是否立即执行一次
   * @default false
   */
  runOnInit?: boolean;

  /**
   * 队列名称
   * @default 'default'
   */
  queueName?: string;
}

/**
 * 队列装饰器元数据
 */
export interface QueueMetadata {
  name?: string;
}

export interface CronMetadata {
  pattern: string;
  timezone?: string;
  runOnInit?: boolean;
  queueName?: string;
}

/**
 * 标记方法为队列任务处理器
 * @param options - 队列配置
 */
export function Queue(options: QueueOptions = {}): MethodDecorator {
  return function (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const metadata: QueueMetadata = {
      name: options.name,
    };

    Reflect.defineMetadata(QUEUE_METADATA_KEY, metadata, descriptor.value);
  };
}

/**
 * 标记方法为定时任务（Cron）
 * @param options - Cron 配置
 */
export function Cron(options: CronDecoratorOptions): MethodDecorator {
  return function (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const metadata: CronMetadata = {
      pattern: options.pattern,
      timezone: options.timezone,
      runOnInit: options.runOnInit ?? false,
      queueName: options.queueName,
    };

    Reflect.defineMetadata(CRON_METADATA_KEY, metadata, descriptor.value);
  };
}

/**
 * 获取队列装饰器元数据
 */
export function getQueueMetadata(target: unknown): QueueMetadata | undefined {
  return Reflect.getMetadata(QUEUE_METADATA_KEY, target as object);
}

export function getCronMetadata(target: unknown): CronMetadata | undefined {
  return Reflect.getMetadata(CRON_METADATA_KEY, target as object);
}
