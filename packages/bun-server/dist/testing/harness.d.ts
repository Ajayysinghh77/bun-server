export interface BenchmarkResult {
    name: string;
    iterations: number;
    durationMs: number;
    opsPerSecond: number;
}
export interface StressResult {
    name: string;
    iterations: number;
    concurrency: number;
    durationMs: number;
    errors: number;
}
/**
 * 简单性能压测工具，方便在 bun:test 中快速基准测试组件
 */
export declare class PerformanceHarness {
    static benchmark(name: string, iterations: number, runner: (iteration: number) => void | Promise<void>): Promise<BenchmarkResult>;
}
/**
 * 简单压力测试运行器，支持并发执行任务并收集错误
 */
export declare class StressTester {
    static run(name: string, iterations: number, concurrency: number, task: (iteration: number) => Promise<void>): Promise<StressResult>;
}
//# sourceMappingURL=harness.d.ts.map