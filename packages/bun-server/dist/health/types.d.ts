export declare const HEALTH_INDICATORS_TOKEN: unique symbol;
export declare const HEALTH_OPTIONS_TOKEN: unique symbol;
export type HealthStatusValue = 'up' | 'down';
export interface HealthIndicatorResult {
    status: HealthStatusValue;
    details?: Record<string, unknown>;
}
export interface HealthIndicator {
    name: string;
    check(): Promise<HealthIndicatorResult> | HealthIndicatorResult;
}
export interface HealthStatus {
    status: HealthStatusValue;
    details: Record<string, HealthIndicatorResult>;
}
export interface HealthModuleOptions {
    /**
     * 健康检查指示器列表
     */
    indicators?: HealthIndicator[];
}
//# sourceMappingURL=types.d.ts.map