import { Module, MODULE_METADATA_KEY, type ModuleProvider } from '../di/module';

import { MetricsController } from './controller';
import { MetricsCollector } from './collector';
import type { MetricsModuleOptions } from './types';
import { METRICS_SERVICE_TOKEN, METRICS_OPTIONS_TOKEN } from './types';

@Module({
  controllers: [MetricsController],
  providers: [],
})
export class MetricsModule {
  /**
   * 创建指标监控模块
   * @param options - 模块配置
   */
  public static forRoot(options: MetricsModuleOptions = {}): typeof MetricsModule {
    const providers: ModuleProvider[] = [];

    const collector = new MetricsCollector();

    // 注册自定义指标
    if (options.customMetrics) {
      for (const metric of options.customMetrics) {
        collector.registerCustomMetric(metric);
      }
    }

    providers.push(
      {
        provide: METRICS_SERVICE_TOKEN,
        useValue: collector,
      },
      {
        provide: METRICS_OPTIONS_TOKEN,
        useValue: options,
      },
      MetricsCollector,
    );

    // 动态更新模块元数据
    const existingMetadata =
      Reflect.getMetadata(MODULE_METADATA_KEY, MetricsModule) || {};
    const metadata = {
      ...existingMetadata,
      controllers: [...(existingMetadata.controllers || []), MetricsController],
      providers: [...(existingMetadata.providers || []), ...providers],
      exports: [
        ...(existingMetadata.exports || []),
        METRICS_SERVICE_TOKEN,
        MetricsCollector,
      ],
    };
    Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, MetricsModule);

    return MetricsModule;
  }
}
