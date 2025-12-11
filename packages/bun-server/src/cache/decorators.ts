import 'reflect-metadata';

/**
 * 缓存装饰器元数据键
 */
const CACHEABLE_METADATA_KEY = Symbol('@dangao/bun-server:cache:cacheable');
const CACHE_EVICT_METADATA_KEY = Symbol('@dangao/bun-server:cache:cache-evict');
const CACHE_PUT_METADATA_KEY = Symbol('@dangao/bun-server:cache:cache-put');

/**
 * 缓存配置
 */
export interface CacheableOptions {
  /**
   * 缓存键（支持 SpEL 表达式，如 'user:{id}'）
   */
  key?: string;

  /**
   * 缓存键前缀
   */
  keyPrefix?: string;

  /**
   * TTL（毫秒），0 表示永不过期
   */
  ttl?: number;

  /**
   * 条件表达式（如果返回 false，则不缓存）
   * 支持 SpEL 表达式，如 'result.status === "success"'
   */
  condition?: string;
}

/**
 * 缓存清除配置
 */
export interface CacheEvictOptions {
  /**
   * 缓存键（支持 SpEL 表达式）
   */
  key?: string;

  /**
   * 缓存键前缀
   */
  keyPrefix?: string;

  /**
   * 是否在方法执行前清除
   * @default false
   */
  beforeInvocation?: boolean;

  /**
   * 是否清除所有匹配的键（支持通配符）
   * @default false
   */
  allEntries?: boolean;
}

/**
 * 缓存更新配置
 */
export interface CachePutOptions {
  /**
   * 缓存键（支持 SpEL 表达式）
   */
  key?: string;

  /**
   * 缓存键前缀
   */
  keyPrefix?: string;

  /**
   * TTL（毫秒），0 表示永不过期
   */
  ttl?: number;

  /**
   * 条件表达式（如果返回 false，则不更新缓存）
   */
  condition?: string;
}

/**
 * 缓存装饰器元数据
 */
export interface CacheableMetadata {
  key?: string;
  keyPrefix?: string;
  ttl?: number;
  condition?: string;
}

export interface CacheEvictMetadata {
  key?: string;
  keyPrefix?: string;
  beforeInvocation?: boolean;
  allEntries?: boolean;
}

export interface CachePutMetadata {
  key?: string;
  keyPrefix?: string;
  ttl?: number;
  condition?: string;
}

/**
 * 缓存方法结果
 * @param options - 缓存配置
 */
export function Cacheable(options: CacheableOptions = {}): MethodDecorator {
  return function (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const metadata: CacheableMetadata = {
      key: options.key,
      keyPrefix: options.keyPrefix,
      ttl: options.ttl,
      condition: options.condition,
    };

    Reflect.defineMetadata(
      CACHEABLE_METADATA_KEY,
      metadata,
      descriptor.value,
    );
  };
}

/**
 * 清除缓存
 * @param options - 清除配置
 */
export function CacheEvict(options: CacheEvictOptions = {}): MethodDecorator {
  return function (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const metadata: CacheEvictMetadata = {
      key: options.key,
      keyPrefix: options.keyPrefix,
      beforeInvocation: options.beforeInvocation ?? false,
      allEntries: options.allEntries ?? false,
    };

    Reflect.defineMetadata(
      CACHE_EVICT_METADATA_KEY,
      metadata,
      descriptor.value,
    );
  };
}

/**
 * 更新缓存
 * @param options - 更新配置
 */
export function CachePut(options: CachePutOptions = {}): MethodDecorator {
  return function (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const metadata: CachePutMetadata = {
      key: options.key,
      keyPrefix: options.keyPrefix,
      ttl: options.ttl,
      condition: options.condition,
    };

    Reflect.defineMetadata(CACHE_PUT_METADATA_KEY, metadata, descriptor.value);
  };
}

/**
 * 获取缓存装饰器元数据
 */
export function getCacheableMetadata(
  target: unknown,
): CacheableMetadata | undefined {
  return Reflect.getMetadata(CACHEABLE_METADATA_KEY, target as object);
}

export function getCacheEvictMetadata(
  target: unknown,
): CacheEvictMetadata | undefined {
  return Reflect.getMetadata(CACHE_EVICT_METADATA_KEY, target as object);
}

export function getCachePutMetadata(
  target: unknown,
): CachePutMetadata | undefined {
  return Reflect.getMetadata(CACHE_PUT_METADATA_KEY, target as object);
}
