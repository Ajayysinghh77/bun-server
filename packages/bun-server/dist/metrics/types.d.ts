/**
 * 指标类型
 */
export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';
/**
 * 指标标签
 */
export type MetricLabels = Record<string, string>;
/**
 * 指标值
 */
export type MetricValue = number;
/**
 * 指标数据点
 */
export interface MetricDataPoint {
    /**
     * 指标名称
     */
    name: string;
    /**
     * 指标类型
     */
    type: MetricType;
    /**
     * 指标值
     */
    value: MetricValue;
    /**
     * 标签
     */
    labels?: MetricLabels;
    /**
     * 帮助文本
     */
    help?: string;
}
/**
 * 自定义指标
 */
export interface CustomMetric {
    /**
     * 指标名称
     */
    name: string;
    /**
     * 指标类型
     */
    type: MetricType;
    /**
     * 帮助文本
     */
    help?: string;
    /**
     * 获取当前值
     * @param labels - 标签
     * @returns 指标值
     */
    getValue(labels?: MetricLabels): MetricValue | Promise<MetricValue>;
}
/**
 * MetricsModule 配置选项
 */
export interface MetricsModuleOptions {
    /**
     * 是否启用 HTTP 请求指标收集
     * @default true
     */
    enableHttpMetrics?: boolean;
    /**
     * 自定义指标列表
     */
    customMetrics?: CustomMetric[];
    /**
     * Metrics 端点路径
     * @default '/metrics'
     */
    path?: string;
}
/**
 * Metrics 服务 Token
 */
export declare const METRICS_SERVICE_TOKEN: unique symbol;
/**
 * Metrics 选项 Token
 */
export declare const METRICS_OPTIONS_TOKEN: unique symbol;
//# sourceMappingURL=types.d.ts.map