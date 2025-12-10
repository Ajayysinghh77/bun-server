import type { CustomMetric, MetricDataPoint, MetricLabels } from './types';
/**
 * 指标收集器
 */
export declare class MetricsCollector {
    private counters;
    private gauges;
    private histograms;
    private customMetrics;
    /**
     * 注册自定义指标
     */
    registerCustomMetric(metric: CustomMetric): void;
    /**
     * 增加计数器
     */
    incrementCounter(name: string, labels?: MetricLabels, value?: number): void;
    /**
     * 设置仪表值
     */
    setGauge(name: string, labels: MetricLabels | undefined, value: number): void;
    /**
     * 观察直方图值
     */
    observeHistogram(name: string, labels: MetricLabels | undefined, value: number): void;
    /**
     * 获取所有指标数据点
     */
    getAllDataPoints(): Promise<MetricDataPoint[]>;
    /**
     * 重置所有指标
     */
    reset(): void;
    /**
     * 生成标签键
     */
    private getKey;
    /**
     * 解析标签键
     */
    private parseKey;
    /**
     * 计算直方图桶
     */
    private calculateBuckets;
}
//# sourceMappingURL=collector.d.ts.map