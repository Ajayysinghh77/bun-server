import { MetricsCollector } from './collector';
import { type MetricsModuleOptions } from './types';
/**
 * Metrics 控制器
 * 提供 `/metrics` 端点用于 Prometheus 指标导出
 */
export declare class MetricsController {
    private readonly collector;
    private readonly options?;
    private readonly formatter;
    constructor(collector: MetricsCollector, options?: MetricsModuleOptions | undefined);
    /**
     * 获取 Prometheus 格式的指标
     */
    metrics(): Promise<Response>;
}
//# sourceMappingURL=controller.d.ts.map