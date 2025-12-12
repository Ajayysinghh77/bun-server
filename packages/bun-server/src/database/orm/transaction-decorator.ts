import 'reflect-metadata';
import { Propagation } from './transaction-types';
import type { TransactionOptions } from './transaction-types';

/**
 * Transaction 元数据键
 */
export const TRANSACTION_METADATA_KEY = Symbol('@dangao/bun-server:orm:transaction');

/**
 * Transactional 装饰器
 * 标记方法需要在事务中执行
 * @param options - 事务配置选项
 */
export function Transactional(options?: TransactionOptions): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    if (!descriptor || typeof descriptor.value !== 'function') {
      throw new Error('@Transactional() can only be applied to methods');
    }

    const metadata = {
      propagation: options?.propagation ?? Propagation.REQUIRED,
      isolationLevel: options?.isolationLevel,
      timeout: options?.timeout,
      readOnly: options?.readOnly ?? false,
      rollbackFor: options?.rollbackFor ?? [],
      noRollbackFor: options?.noRollbackFor ?? [],
    };

    Reflect.defineMetadata(TRANSACTION_METADATA_KEY, metadata, target, propertyKey);
  };
}

/**
 * 获取 Transaction 元数据
 * 支持从实例或原型上获取元数据（元数据通常存储在原型上）
 */
export function getTransactionMetadata(
  target: unknown,
  propertyKey: string | symbol,
): TransactionOptions | undefined {
  if (typeof target !== 'object' || target === null) {
    return undefined;
  }

  // 首先尝试直接从 target 获取（如果 target 是原型）
  let metadata = Reflect.getMetadata(TRANSACTION_METADATA_KEY, target, propertyKey) as TransactionOptions | undefined;
  if (metadata !== undefined) {
    return metadata;
  }

  // 如果 target 是实例，尝试从原型获取
  // 装饰器元数据通常存储在原型上，而不是实例上
  const prototype = Object.getPrototypeOf(target);
  if (prototype && prototype !== Object.prototype) {
    metadata = Reflect.getMetadata(TRANSACTION_METADATA_KEY, prototype, propertyKey) as TransactionOptions | undefined;
    if (metadata !== undefined) {
      return metadata;
    }
  }

  // 如果仍然找不到，尝试从构造函数原型获取
  // 这处理了 target 是实例但原型链查找失败的情况
  const constructor = (target as any).constructor;
  if (constructor && typeof constructor === 'function') {
    // 如果 target 本身不是构造函数原型，尝试从构造函数原型获取
    if (target !== constructor.prototype) {
      metadata = Reflect.getMetadata(TRANSACTION_METADATA_KEY, constructor.prototype, propertyKey) as TransactionOptions | undefined;
      if (metadata !== undefined) {
        return metadata;
      }
    }
  }

  return undefined;
}
