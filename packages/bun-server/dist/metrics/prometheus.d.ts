import type { MetricDataPoint } from './types';
/**
 * 将指标数据点转换为 Prometheus 格式
 */
export declare class PrometheusFormatter {
    /**
     * 格式化指标为 Prometheus 文本格式
     */
    format(dataPoints: MetricDataPoint[]): string;
    /**
     * 按指标名称分组
     */
    private groupByMetricName;
    /**
     * 格式化标签
     */
    private formatLabels;
    /**
     * 转义标签值
     */
    private escapeLabelValue;
}
//# sourceMappingURL=prometheus.d.ts.map