import type { Context } from '../core/context';
import type { Middleware } from '../middleware';
import { MetricsCollector } from './collector';

/**
 * 创建 HTTP 请求指标收集中间件
 */
export function createHttpMetricsMiddleware(collector: MetricsCollector): Middleware {
  return async (context: Context, next) => {
    const startTime = Date.now();

    // 执行请求
    const response = await next();

    // 计算延迟
    const duration = Date.now() - startTime;
    const durationSeconds = duration / 1000;

    // 收集请求指标
    const method = context.method;
    const path = context.path;
    const statusCode = response.status;

    // HTTP 请求总数（计数器）
    collector.incrementCounter('http_requests_total', {
      method,
      path,
      status: statusCode.toString(),
    });

    // HTTP 请求延迟（直方图）
    collector.observeHistogram('http_request_duration_seconds', {
      method,
      path,
      status: statusCode.toString(),
    }, durationSeconds);

    // HTTP 请求延迟（摘要，用于 p50, p95, p99）
    collector.observeHistogram('http_request_duration_seconds_summary', {
      method,
      path,
    }, durationSeconds);

    return response;
  };
}
