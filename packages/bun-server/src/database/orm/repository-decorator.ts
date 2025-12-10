import 'reflect-metadata';
import { Injectable } from '../../di/decorators';
import type { Constructor } from '../../core/types';

/**
 * Repository 元数据键
 */
export const REPOSITORY_METADATA_KEY = Symbol('@dangao/bun-server:orm:repository');

/**
 * Repository 装饰器
 * 标记一个类为 Repository
 * @param tableName - 表名
 * @param primaryKey - 主键字段名（默认为 'id'）
 */
export function Repository(tableName: string, primaryKey: string = 'id') {
  return function <T extends Constructor<unknown>>(target: T): T {
    // 标记为 Injectable
    Injectable()(target);

    // 添加元数据
    Reflect.defineMetadata(REPOSITORY_METADATA_KEY, { tableName, primaryKey }, target);

    return target;
  };
}

/**
 * 获取 Repository 元数据
 */
export function getRepositoryMetadata(target: unknown): {
  tableName: string;
  primaryKey: string;
} | undefined {
  if (typeof target === 'function' || (typeof target === 'object' && target !== null)) {
    return Reflect.getMetadata(REPOSITORY_METADATA_KEY, target as object);
  }
  return undefined;
}
