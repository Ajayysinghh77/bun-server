# Changelog - v0.3.0

## 🎉 新功能

- ✨ 添加速率限制中间件（Rate Limiting）
  - 支持滑动窗口算法
  - 支持基于 IP 的限流
  - 支持基于 Token/User 的限流
  - 提供 `@RateLimit()` 装饰器
  - 包含内存存储实现（MemoryRateLimitStore）
- ✨ 添加指标监控模块（MetricsModule）
  - Prometheus 格式指标导出
  - HTTP 请求指标自动收集（延迟、状态码）
  - 支持自定义指标注册
  - 提供 `/metrics` 端点
  - 支持 Counter、Gauge、Histogram 指标类型
- ✨ 添加 `getClientIp()` 方法到 Context
  - 支持从 X-Forwarded-For 头获取 IP
  - 支持从 X-Real-IP 头获取 IP

## 🐛 修复

- 🔧 修复 MetricsCollector 在控制器中的依赖注入问题
- 🔧 修复 DI 容器中 emitDecoratorMetadata 配置

## 📝 改进

- ⚡ 优化速率限制中间件的响应头信息
- ⚡ 改进指标收集器的性能

## 📊 测试

- ✅ 添加速率限制中间件测试（14 个测试用例）
- ✅ 添加指标监控模块测试（11 个测试用例）
- ✅ 所有测试通过（25 个测试用例，61 个断言）

## 📦 示例

- 📝 添加 metrics-rate-limit-app.ts 示例
  - 演示速率限制功能
  - 演示指标监控功能
  - 包含完整的 Web UI 界面

---

**完整变更列表：**

- feat(middleware/metrics): add rate limiting and metrics monitoring
- feat(examples): add web UI for metrics and rate limit demo
- feat(examples): add metrics and rate limiting demo
- fix(examples): fix MetricsCollector injection in ApiController
- fix(di): enable emitDecoratorMetadata for reflect-metadata support
- chore(examples): add start script for metrics-rate-limit-app
