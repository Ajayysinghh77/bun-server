import { GET } from '../router/decorators';
import { Inject } from '../di/decorators';
import { Controller } from '../controller';

import { MetricsCollector } from './collector';
import { PrometheusFormatter } from './prometheus';
import { METRICS_SERVICE_TOKEN, METRICS_OPTIONS_TOKEN, type MetricsModuleOptions } from './types';

/**
 * Metrics 控制器
 * 提供 `/metrics` 端点用于 Prometheus 指标导出
 */
@Controller('/')
export class MetricsController {
  private readonly formatter: PrometheusFormatter;

  public constructor(
    @Inject(METRICS_SERVICE_TOKEN)
    private readonly collector: MetricsCollector,
    @Inject(METRICS_OPTIONS_TOKEN)
    private readonly options?: MetricsModuleOptions,
  ) {
    this.formatter = new PrometheusFormatter();
  }

  /**
   * 获取 Prometheus 格式的指标
   */
  @GET('/metrics')
  public async metrics(): Promise<Response> {
    const dataPoints = await this.collector.getAllDataPoints();
    const prometheusText = this.formatter.format(dataPoints);

    return new Response(prometheusText, {
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
      },
    });
  }
}
