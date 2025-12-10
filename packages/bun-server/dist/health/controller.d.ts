import type { HealthIndicator, HealthStatus } from './types';
import type { HealthModuleOptions } from './types';
/**
 * 健康检查控制器
 *
 * 提供 `/health` 和 `/ready` 两个端点：
 * - /health：存活检查（liveness）
 * - /ready：就绪检查（readiness）
 */
export declare class HealthController {
    private readonly indicators;
    private readonly options?;
    constructor(indicators?: HealthIndicator[], options?: HealthModuleOptions | undefined);
    /**
     * 存活检查
     */
    health(): Promise<HealthStatus>;
    /**
     * 就绪检查
     */
    ready(): Promise<HealthStatus>;
    /**
     * 执行所有健康检查指示器
     */
    private checkIndicators;
}
//# sourceMappingURL=controller.d.ts.map