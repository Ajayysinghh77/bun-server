# 示例项目

| 文件             | 说明                                                                    | 运行方式                          | 端口 |
| ---------------- | ----------------------------------------------------------------------- | --------------------------------- | ---- |
| `basic-app.ts`   | 最小可运行示例，包含 DI、控制器与验证                                   | `bun run examples/basic-app.ts`   | 3100 |
| `full-app.ts`    | 综合示例，集成日志、CORS、上传、静态资源与 WebSocket                    | `bun run examples/full-app.ts`    | 3200 |
| `cache-app.ts`   | 缓存示例，演示 CacheModule 的使用（@Cacheable, @CacheEvict, @CachePut） | `bun run examples/cache-app.ts`   | 3200 |
| `queue-app.ts`   | 队列示例，演示 QueueModule 的使用（任务队列、Cron 定时任务）            | `bun run examples/queue-app.ts`   | 3300 |
| `session-app.ts` | Session 示例，演示 SessionModule 的使用（登录、购物车）                 | `bun run examples/session-app.ts` | 3400 |
| `perf/app.ts`    | 性能压测示例，暴露 `/api/ping` 供 wrk 等工具测试                        | `bun run examples/perf/app.ts`    | 3300 |

> 运行前请确保 `bun install` 已完成依赖安装。示例默认监听不同端口，可通过设置
> `PORT` 环境变量覆盖（例如 `PORT=0 bun run ...` 交由系统分配端口）。

## 常用命令

```bash
# 基础示例
bun run examples/basic-app.ts

# 全功能示例
bun run examples/full-app.ts

# 缓存示例
bun run examples/cache-app.ts

# 队列示例
bun run examples/queue-app.ts

# Session 示例
bun run examples/session-app.ts

# 性能测试
bun run examples/perf/app.ts
wrk -t4 -c64 -d30s http://localhost:3300/api/ping
```

## 示例说明

### CacheModule 示例 (`cache-app.ts`)

演示缓存功能的使用：

- **装饰器方式**：使用 `@Cacheable`、`@CacheEvict`、`@CachePut`
  装饰器自动缓存方法结果
- **手动方式**：直接使用 `CacheService` 进行缓存操作
- **缓存策略**：演示缓存命中、缓存更新、缓存清除等场景

### QueueModule 示例 (`queue-app.ts`)

演示任务队列功能的使用：

- **任务队列**：将耗时操作（如发送邮件）放入队列异步处理
- **任务处理器**：注册任务处理器处理队列中的任务
- **定时任务**：使用 Cron 表达式创建定时任务（每日报告、清理任务等）
- **优先级**：演示任务优先级设置

### SessionModule 示例 (`session-app.ts`)

演示 Session 管理功能的使用：

- **登录/登出**：创建和销毁 Session
- **Session 数据**：存储和读取用户数据（如购物车）
- **Session 中间件**：自动处理 Session Cookie
- **Session 装饰器**：使用 `@Session()` 装饰器注入 Session 对象

所有示例都会在控制台输出服务地址和可用端点，按需调整端口或中间件配置即可。
