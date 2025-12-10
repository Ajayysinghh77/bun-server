import type { Context } from '../../core/context';
import type { Middleware } from '../middleware';
/**
 * 速率限制存储接口
 */
export interface RateLimitStore {
    /**
     * 获取当前计数
     * @param key - 存储键
     * @returns 当前计数
     */
    get(key: string): Promise<number>;
    /**
     * 增加计数
     * @param key - 存储键
     * @param windowMs - 时间窗口（毫秒）
     * @returns 增加后的计数
     */
    increment(key: string, windowMs: number): Promise<number>;
    /**
     * 重置计数
     * @param key - 存储键
     */
    reset(key: string): Promise<void>;
}
/**
 * 内存存储实现（使用 Map）
 */
export declare class MemoryRateLimitStore implements RateLimitStore {
    private store;
    get(key: string): Promise<number>;
    increment(key: string, windowMs: number): Promise<number>;
    reset(key: string): Promise<void>;
    /**
     * 清理过期条目（可选，用于内存管理）
     */
    cleanup(): void;
}
/**
 * 速率限制选项
 */
export interface RateLimitOptions {
    /**
     * 时间窗口内的最大请求数
     */
    max: number;
    /**
     * 时间窗口（毫秒）
     * @default 60000 (1 分钟)
     */
    windowMs?: number;
    /**
     * 存储实现（默认使用内存存储）
     */
    store?: RateLimitStore;
    /**
     * 获取限流键的函数
     * @param context - 请求上下文
     * @returns 限流键
     */
    keyGenerator?: (context: Context) => string | Promise<string>;
    /**
     * 是否跳过成功响应（只对错误响应计数）
     * @default false
     */
    skipSuccessfulRequests?: boolean;
    /**
     * 是否跳过失败响应（只对成功响应计数）
     * @default false
     */
    skipFailedRequests?: boolean;
    /**
     * 自定义错误消息
     */
    message?: string;
    /**
     * 自定义错误状态码
     * @default 429
     */
    statusCode?: number;
    /**
     * 是否在响应头中包含限流信息
     * @default true
     */
    standardHeaders?: boolean;
    /**
     * 是否启用 X-RateLimit-* 响应头
     * @default true
     */
    legacyHeaders?: boolean;
}
/**
 * 创建速率限制中间件
 */
export declare function createRateLimitMiddleware(options: RateLimitOptions): Middleware;
/**
 * 基于 Token/User 的键生成器
 */
export declare function createTokenKeyGenerator(tokenHeader?: string): (context: Context) => string;
/**
 * 基于用户 ID 的键生成器（需要从认证上下文获取）
 */
export declare function createUserKeyGenerator(getUserId: (context: Context) => string | null | undefined): (context: Context) => string;
//# sourceMappingURL=rate-limit.d.ts.map