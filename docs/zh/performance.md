# 性能优化指南

本文档介绍 Bun Server Framework 应用的性能优化技术。

## 目录

- [基准测试](#基准测试)
- [缓存策略](#缓存策略)
- [数据库优化](#数据库优化)
- [中间件优化](#中间件优化)
- [响应优化](#响应优化)
- [内存管理](#内存管理)
- [并发处理](#并发处理)

## 基准测试

### 使用 Performance Harness

使用内置的 `PerformanceHarness` 进行基准测试：

```typescript
import { PerformanceHarness } from "@dangao/bun-server/testing";

const result = await PerformanceHarness.benchmark(
  "my-operation",
  1000,
  async () => {
    // Your code to benchmark
    await doSomething();
  },
);

console.log(`Operations per second: ${result.opsPerSecond}`);
console.log(`Total duration: ${result.durationMs}ms`);
```

### 压力测试

使用 `StressTester` 进行并发负载测试：

```typescript
import { StressTester } from "@dangao/bun-server/testing";

const result = await StressTester.run(
  "my-endpoint",
  1000, // iterations
  10, // concurrency
  async (iteration) => {
    const response = await fetch("http://localhost:3000/api/test");
    await response.text();
  },
);

console.log(`Errors: ${result.errors}`);
console.log(`Duration: ${result.durationMs}ms`);
```

## 缓存策略

### 使用 CacheModule

为频繁访问的数据启用缓存：

```typescript
import {
  CACHE_SERVICE_TOKEN,
  CacheModule,
  CacheService,
} from "@dangao/bun-server";

CacheModule.forRoot({
  store: new RedisCacheStore(redisClient), // Use Redis for distributed caching
  defaultTtl: 3600000, // 1 hour
});

@Injectable()
class ProductService {
  public constructor(
    @Inject(CACHE_SERVICE_TOKEN) private readonly cache: CacheService,
  ) {}

  public async getProduct(id: string) {
    return await this.cache.getOrSet(
      `product:${id}`,
      async () => {
        return await this.db.findProduct(id);
      },
      3600000, // Cache for 1 hour
    );
  }
}
```

### 缓存装饰器

使用缓存装饰器实现自动缓存：

```typescript
import { Cacheable, CacheEvict, CachePut } from "@dangao/bun-server";

@Controller("/api/products")
class ProductController {
  @GET("/:id")
  @Cacheable({ key: "product", ttl: 3600000 })
  public async getProduct(@Param("id") id: string) {
    return await this.productService.find(id);
  }

  @PUT("/:id")
  @CachePut({ key: "product" })
  @CacheEvict({ key: "products:list" })
  public async updateProduct(@Param("id") id: string, @Body() data: any) {
    return await this.productService.update(id, data);
  }
}
```

### 缓存失效

实现缓存失效策略：

```typescript
// Invalidate on update
@PUT('/:id')
@CacheEvict({ key: 'product', pattern: true })
public async updateProduct(@Param('id') id: string) {
  // Cache for 'product:*' will be invalidated
}

// Invalidate multiple keys
@DELETE('/:id')
@CacheEvict({ keys: ['product', 'products:list'] })
public async deleteProduct(@Param('id') id: string) {
  // Both caches invalidated
}
```

## 数据库优化

### 连接池

配置适当的连接池大小：

```typescript
DatabaseModule.forRoot({
  database: {
    type: "postgres",
    config: {
      connectionString: process.env.DATABASE_URL,
      max: 20, // Maximum connections
      min: 5, // Minimum connections
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
  },
});
```

### 查询优化

使用索引并优化查询：

```typescript
// Use indexes
@Table("users")
class User {
  @Column({ primaryKey: true })
  public id!: number;

  @Column({ index: true }) // Add index
  public email!: string;
}

// Use select specific fields
const users = await db.select("id", "name").from("users").where("active", true);

// Use pagination
const users = await db
  .select()
  .from("users")
  .limit(20)
  .offset((page - 1) * 20);
```

### 批量操作

对多个插入/更新使用批量操作：

```typescript
// Batch insert
await db.batchInsert("users", [
  { name: "User 1", email: "user1@example.com" },
  { name: "User 2", email: "user2@example.com" },
]);

// Batch update
await db.transaction(async (trx) => {
  for (const user of users) {
    await trx("users").where("id", user.id).update(user);
  }
});
```

## 中间件优化

### 最小化中间件

只使用必要的中间件：

```typescript
// ❌ Too many middleware
app.use(middleware1);
app.use(middleware2);
app.use(middleware3);
app.use(middleware4);
app.use(middleware5);

// ✅ Combine or remove unnecessary middleware
app.use(combinedMiddleware);
```

### 条件中间件

使用条件中间件以获得更好的性能：

```typescript
app.use(async (ctx, next) => {
  // Skip middleware for static files
  if (ctx.path.startsWith("/static")) {
    return await next();
  }
  // Apply middleware
  return await middleware(ctx, next);
});
```

### 异步中间件

确保中间件正确使用异步：

```typescript
// ✅ Correct: Properly await next()
app.use(async (ctx, next) => {
  const start = Date.now();
  const response = await next();
  const duration = Date.now() - start;
  console.log(`Request took ${duration}ms`);
  return response;
});

// ❌ Wrong: Not awaiting next()
app.use(async (ctx, next) => {
  next(); // Missing await
  return new Response("ok");
});
```

## 响应优化

### 压缩

在反向代理（Nginx、Caddy）中启用 gzip 压缩：

```nginx
# Nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript;
```

### 响应流

对大型响应使用流式传输：

```typescript
@GET('/large-data')
public async getLargeData() {
  const stream = new ReadableStream({
    async start(controller) {
      // Stream data in chunks
      for (const chunk of largeData) {
        controller.enqueue(JSON.stringify(chunk));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
```

### 分页

始终对大型数据集进行分页：

```typescript
@GET('/users')
public async getUsers(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 20,
) {
  const offset = (page - 1) * limit;
  const users = await this.userService.findAll({ limit, offset });
  return {
    data: users,
    pagination: {
      page,
      limit,
      total: await this.userService.count(),
    },
  };
}
```

## 内存管理

### 避免内存泄漏

正确清理资源：

```typescript
// Clean up in afterEach/afterAll
afterEach(async () => {
  await app.stop();
  ModuleRegistry.getInstance().clear();
  RouteRegistry.getInstance().clear();
});

// Clear intervals/timeouts
const intervalId = setInterval(() => {}, 1000);
// ... later
clearInterval(intervalId);
```

### 使用 TTL 缓存

为缓存条目设置适当的 TTL：

```typescript
CacheModule.forRoot({
  defaultTtl: 3600000, // 1 hour
});

// Override for specific entries
await cache.set("key", "value", 60000); // 1 minute
```

### 监控内存使用

在生产环境中监控内存使用：

```typescript
import { performance } from "node:perf_hooks";

setInterval(() => {
  const usage = process.memoryUsage();
  console.log({
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
    rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
  });
}, 60000); // Every minute
```

## 并发处理

### 使用 Async/Await

对 I/O 操作始终使用 async/await：

```typescript
// ✅ Correct: Async
@GET('/users')
public async getUsers() {
  return await this.userService.findAll();
}

// ❌ Wrong: Synchronous
@GET('/users')
public getUsers() {
  return this.userService.findAllSync();  // Blocks event loop
}
```

### 并行操作

对并行操作使用 `Promise.all()`：

```typescript
// ✅ Parallel execution
const [user, profile, settings] = await Promise.all([
  this.userService.find(id),
  this.profileService.find(id),
  this.settingsService.find(id),
]);

// ❌ Sequential execution
const user = await this.userService.find(id);
const profile = await this.profileService.find(id);
const settings = await this.settingsService.find(id);
```

### Worker 线程

对 CPU 密集型任务使用 worker 线程：

```typescript
import { Worker } from 'worker_threads';

@POST('/process')
public async processData(@Body() data: any) {
  return await new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', {
      workerData: data,
    });
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}
```

## 最佳实践总结

1. **缓存频繁访问的数据** - 使用 CacheModule 并设置适当的 TTL
2. **优化数据库查询** - 使用索引、分页、批量操作
3. **最小化中间件** - 只使用必要的中间件
4. **使用 async/await** - 永远不要阻塞事件循环
5. **启用压缩** - 使用 gzip/brotli 压缩
6. **监控性能** - 使用 PerformanceHarness 和监控工具
7. **清理资源** - 在测试和关闭处理程序中正确清理
8. **使用连接池** - 配置适当的池大小
9. **流式传输大型响应** - 对大型数据使用流式传输
10. **并行化操作** - 对独立操作使用 Promise.all()

## 性能检查清单

- [ ] 为频繁访问的数据启用了缓存
- [ ] 配置了数据库连接池
- [ ] 优化了数据库查询（索引、分页）
- [ ] 最小化并优化了中间件
- [ ] 启用了压缩（gzip/brotli）
- [ ] 所有 I/O 操作都使用了 async/await
- [ ] 防止了内存泄漏（清理处理程序）
- [ ] 启用了性能监控
- [ ] 大型响应已分页或流式传输
- [ ] 在可能的情况下使用了并行操作
