/**
 * 速率限制和指标监控示例
 *
 * 演示功能：
 * 1. 速率限制中间件 - 防止 API 滥用
 * 2. 指标监控模块 - Prometheus 指标导出
 * 3. HTTP 请求指标收集 - 自动收集请求延迟和状态码
 */

import {
  Application,
  ConfigModule,
  ConfigService,
  CONFIG_SERVICE_TOKEN,
  Controller,
  createRateLimitMiddleware,
  createHttpMetricsMiddleware,
  GET,
  Inject,
  Injectable,
  MetricsModule,
  MetricsCollector,
  METRICS_SERVICE_TOKEN,
  RateLimit,
  POST,
} from '@dangao/bun-server';

// 配置模块
ConfigModule.forRoot({
  defaultConfig: {
    app: {
      name: 'Metrics & Rate Limit Demo',
      port: 3000,
    },
  },
});

// 指标监控模块
MetricsModule.forRoot({
  enableHttpMetrics: true,
  customMetrics: [
    {
      name: 'app_active_users',
      type: 'gauge',
      help: 'Number of active users',
      getValue: () => {
        // 模拟获取活跃用户数
        return Math.floor(Math.random() * 100) + 50;
      },
    },
  ],
});

@Injectable()
class ApiService {
  /**
   * 模拟 API 调用
   */
  public async processRequest(data: string): Promise<{ success: boolean; data: string }> {
    // 模拟处理延迟
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
    return { success: true, data: `Processed: ${data}` };
  }
}

@Controller('/api')
class ApiController {
  public constructor(
    @Inject(ApiService) private readonly apiService: ApiService,
    @Inject(CONFIG_SERVICE_TOKEN) private readonly config: ConfigService,
  ) {}

  /**
   * 公开端点 - 无速率限制
   */
  @GET('/public')
  public publicEndpoint() {
    return {
      message: 'This is a public endpoint',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 受限端点 - 使用装饰器应用速率限制
   * 限制：每分钟最多 5 次请求
   */
  @RateLimit({
    max: 5,
    windowMs: 60000, // 1 分钟
    message: 'Too many requests, please try again later',
  })
  @GET('/limited')
  public limitedEndpoint() {
    return {
      message: 'This endpoint has rate limiting (5 requests per minute)',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 严格限制端点 - 更严格的速率限制
   * 限制：每分钟最多 2 次请求
   */
  @RateLimit({
    max: 2,
    windowMs: 60000,
    message: 'Rate limit exceeded for this endpoint',
  })
  @POST('/strict')
  public strictEndpoint() {
    return {
      message: 'This endpoint has strict rate limiting (2 requests per minute)',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 基于 Token 的速率限制示例
   * 注意：实际使用时需要通过中间件配置 keyGenerator
   */
  @GET('/token-based')
  public tokenBasedEndpoint() {
    return {
      message: 'This endpoint would use token-based rate limiting',
      note: 'Configure keyGenerator in middleware to use token-based limiting',
    };
  }

  /**
   * 指标信息端点
   */
  @GET('/metrics-info')
  public async metricsInfo(
    @Inject(METRICS_SERVICE_TOKEN) collector: MetricsCollector,
  ) {
    const dataPoints = await collector.getAllDataPoints();
    return {
      message: 'Metrics are available at /metrics endpoint',
      totalMetrics: dataPoints.length,
      metrics: dataPoints.map((p) => ({
        name: p.name,
        type: p.type,
        value: p.value,
      })),
    };
  }
}

@Controller('/')
class HealthController {
  @GET('/health')
  public health() {
    return { status: 'ok' };
  }
}

// 创建应用
const port = Number(process.env.PORT) || 3000;
const app = new Application({ port });

// 注册模块
app.registerModule(ConfigModule);
app.registerModule(MetricsModule);

// 注册全局速率限制中间件（可选）
// 这里演示如何为特定路径应用全局速率限制
const globalRateLimit = createRateLimitMiddleware({
  max: 100, // 每分钟最多 100 次请求
  windowMs: 60000,
  keyGenerator: (context) => {
    // 基于 IP 的限流
    return `global:${context.getClientIp()}`;
  },
});

// 只对 /api 路径应用全局速率限制
app.use(async (context, next) => {
  if (context.path.startsWith('/api')) {
    return await globalRateLimit(context, next);
  }
  return await next();
});

// 注册 HTTP 指标收集中间件
const config = app.getContainer().resolve<ConfigService>(CONFIG_SERVICE_TOKEN);
const metricsCollector = app.getContainer().resolve<MetricsCollector>(METRICS_SERVICE_TOKEN);
const httpMetricsMiddleware = createHttpMetricsMiddleware(metricsCollector);
app.use(httpMetricsMiddleware);

// 注册控制器
app.registerController(ApiController);
app.registerController(HealthController);

// 启动服务器
app.listen();

console.log(`🚀 Server running on http://localhost:${port}`);
console.log(`📊 Metrics endpoint: http://localhost:${port}/metrics`);
console.log(`📖 API endpoints:`);
console.log(`   GET  /api/public          - Public endpoint (no rate limit)`);
console.log(`   GET  /api/limited         - Rate limited (5 req/min)`);
console.log(`   POST /api/strict         - Strict rate limit (2 req/min)`);
console.log(`   GET  /api/token-based     - Token-based rate limit example`);
console.log(`   GET  /api/metrics-info    - View collected metrics`);
console.log(`   GET  /health              - Health check`);
console.log(`\n💡 Try making multiple requests to /api/limited to see rate limiting in action!`);
