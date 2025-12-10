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
 */
export function getTransactionMetadata(
  target: unknown,
  propertyKey: string | symbol,
): TransactionOptions | undefined {
  if (typeof target === 'object' && target !== null) {
    return Reflect.getMetadata(TRANSACTION_METADATA_KEY, target, propertyKey);
  }
  return undefined;
}
