import type { MetricDataPoint } from './types';

/**
 * 将指标数据点转换为 Prometheus 格式
 */
export class PrometheusFormatter {
  /**
   * 格式化指标为 Prometheus 文本格式
   */
  public format(dataPoints: MetricDataPoint[]): string {
    const lines: string[] = [];
    const metricGroups = this.groupByMetricName(dataPoints);

    for (const [metricName, points] of metricGroups.entries()) {
      // 添加帮助文本（如果有）
      const help = points[0]?.help;
      if (help) {
        lines.push(`# HELP ${metricName} ${help}`);
      }

      // 添加类型（如果有）
      const type = points[0]?.type;
      if (type) {
        lines.push(`# TYPE ${metricName} ${type}`);
      }

      // 添加数据点
      for (const point of points) {
        const labelString = this.formatLabels(point.labels);
        const line = labelString
          ? `${point.name}${labelString} ${point.value}`
          : `${point.name} ${point.value}`;
        lines.push(line);
      }

      lines.push(''); // 空行分隔
    }

    return lines.join('\n');
  }

  /**
   * 按指标名称分组
   */
  private groupByMetricName(dataPoints: MetricDataPoint[]): Map<string, MetricDataPoint[]> {
    const groups = new Map<string, MetricDataPoint[]>();

    for (const point of dataPoints) {
      const name = point.name;
      const existing = groups.get(name) || [];
      existing.push(point);
      groups.set(name, existing);
    }

    return groups;
  }

  /**
   * 格式化标签
   */
  private formatLabels(labels?: Record<string, string>): string {
    if (!labels || Object.keys(labels).length === 0) {
      return '';
    }

    const labelPairs = Object.keys(labels)
      .sort()
      .map((key) => `${key}="${this.escapeLabelValue(labels[key])}"`)
      .join(',');
    return `{${labelPairs}}`;
  }

  /**
   * 转义标签值
   */
  private escapeLabelValue(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
  }
}
