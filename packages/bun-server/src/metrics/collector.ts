import type {
  CustomMetric,
  MetricDataPoint,
  MetricLabels,
  MetricType,
  MetricValue,
} from './types';

/**
 * 指标收集器
 */
export class MetricsCollector {
  private counters: Map<string, Map<string, number>> = new Map();
  private gauges: Map<string, Map<string, number>> = new Map();
  private histograms: Map<string, Map<string, number[]>> = new Map();
  private customMetrics: CustomMetric[] = [];

  /**
   * 注册自定义指标
   */
  public registerCustomMetric(metric: CustomMetric): void {
    this.customMetrics.push(metric);
  }

  /**
   * 增加计数器
   */
  public incrementCounter(name: string, labels?: MetricLabels, value: number = 1): void {
    const key = this.getKey(name, labels);
    const counterMap = this.counters.get(name) || new Map();
    const current = counterMap.get(key) || 0;
    counterMap.set(key, current + value);
    this.counters.set(name, counterMap);
  }

  /**
   * 设置仪表值
   */
  public setGauge(name: string, labels: MetricLabels | undefined, value: number): void {
    const key = this.getKey(name, labels);
    const gaugeMap = this.gauges.get(name) || new Map();
    gaugeMap.set(key, value);
    this.gauges.set(name, gaugeMap);
  }

  /**
   * 观察直方图值
   */
  public observeHistogram(name: string, labels: MetricLabels | undefined, value: number): void {
    const key = this.getKey(name, labels);
    const histogramMap = this.histograms.get(name) || new Map();
    const values = histogramMap.get(key) || [];
    values.push(value);
    histogramMap.set(key, values);
    this.histograms.set(name, histogramMap);
  }

  /**
   * 获取所有指标数据点
   */
  public async getAllDataPoints(): Promise<MetricDataPoint[]> {
    const dataPoints: MetricDataPoint[] = [];

    // 收集计数器
    for (const [name, counterMap] of this.counters.entries()) {
      for (const [key, value] of counterMap.entries()) {
        const labels = this.parseKey(key);
        dataPoints.push({
          name,
          type: 'counter',
          value,
          labels: labels && Object.keys(labels).length > 0 ? labels : undefined,
        });
      }
    }

    // 收集仪表
    for (const [name, gaugeMap] of this.gauges.entries()) {
      for (const [key, value] of gaugeMap.entries()) {
        const labels = this.parseKey(key);
        dataPoints.push({
          name,
          type: 'gauge',
          value,
          labels: labels && Object.keys(labels).length > 0 ? labels : undefined,
        });
      }
    }

    // 收集直方图（计算统计信息）
    for (const [name, histogramMap] of this.histograms.entries()) {
      for (const [key, values] of histogramMap.entries()) {
        const labels = this.parseKey(key);
        const sum = values.reduce((a, b) => a + b, 0);
        const count = values.length;
        const buckets = this.calculateBuckets(values);

        // 添加 sum
        dataPoints.push({
          name: `${name}_sum`,
          type: 'histogram',
          value: sum,
          labels: labels && Object.keys(labels).length > 0 ? labels : undefined,
        });

        // 添加 count
        dataPoints.push({
          name: `${name}_count`,
          type: 'histogram',
          value: count,
          labels: labels && Object.keys(labels).length > 0 ? labels : undefined,
        });

        // 添加 buckets
        for (const [bucket, bucketCount] of Object.entries(buckets)) {
          dataPoints.push({
            name: `${name}_bucket`,
            type: 'histogram',
            value: bucketCount,
            labels: {
              ...labels,
              le: bucket,
            },
          });
        }
      }
    }

    // 收集自定义指标
    for (const metric of this.customMetrics) {
      try {
        const value = await metric.getValue();
        dataPoints.push({
          name: metric.name,
          type: metric.type,
          value,
          help: metric.help,
        });
      } catch (error) {
        // 忽略自定义指标错误
        console.error(`Failed to collect custom metric ${metric.name}:`, error);
      }
    }

    return dataPoints;
  }

  /**
   * 重置所有指标
   */
  public reset(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
  }

  /**
   * 生成标签键
   */
  private getKey(name: string, labels?: MetricLabels): string {
    if (!labels || Object.keys(labels).length === 0) {
      return '';
    }

    const sortedLabels = Object.keys(labels)
      .sort()
      .map((key) => `${key}="${labels[key]}"`)
      .join(',');
    return `{${sortedLabels}}`;
  }

  /**
   * 解析标签键
   */
  private parseKey(key: string): MetricLabels | undefined {
    if (!key || key === '') {
      return undefined;
    }

    const labels: MetricLabels = {};
    const match = key.match(/\{([^}]+)\}/);
    if (match) {
      const labelPairs = match[1].split(',');
      for (const pair of labelPairs) {
        const [k, v] = pair.split('=');
        if (k && v) {
          labels[k.trim()] = v.trim().replace(/^"|"$/g, '');
        }
      }
    }
    return Object.keys(labels).length > 0 ? labels : undefined;
  }

  /**
   * 计算直方图桶
   */
  private calculateBuckets(values: number[]): Record<string, number> {
    // Prometheus 默认桶：.005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5, 10, +Inf
    const defaultBuckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];
    const buckets: Record<string, number> = {};

    for (const bucket of defaultBuckets) {
      buckets[bucket.toString()] = values.filter((v) => v <= bucket).length;
    }
    buckets['+Inf'] = values.length;

    return buckets;
  }
}
