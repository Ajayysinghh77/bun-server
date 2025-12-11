import { Module, MODULE_METADATA_KEY, type ModuleProvider } from '../di/module';

import { CacheService } from './service';
import {
  CACHE_OPTIONS_TOKEN,
  CACHE_SERVICE_TOKEN,
  MemoryCacheStore,
  type CacheModuleOptions,
  type CacheStore,
} from './types';

@Module({
  providers: [],
})
export class CacheModule {
  /**
   * 创建缓存模块
   * @param options - 模块配置
   */
  public static forRoot(
    options: CacheModuleOptions = {},
  ): typeof CacheModule {
    const providers: ModuleProvider[] = [];

    // 如果没有提供 store，使用默认的内存存储
    const store: CacheStore =
      options.store ??
      new MemoryCacheStore({
        cleanupInterval: 60000, // 每分钟清理一次
      });

    const service = new CacheService({
      store,
      defaultTtl: options.defaultTtl,
      keyPrefix: options.keyPrefix,
    });

    providers.push(
      {
        provide: CACHE_SERVICE_TOKEN,
        useValue: service,
      },
      {
        provide: CACHE_OPTIONS_TOKEN,
        useValue: options,
      },
      CacheService,
    );

    // 动态更新模块元数据
    const existingMetadata =
      Reflect.getMetadata(MODULE_METADATA_KEY, CacheModule) || {};
    const metadata = {
      ...existingMetadata,
      providers: [...(existingMetadata.providers || []), ...providers],
      exports: [
        ...(existingMetadata.exports || []),
        CACHE_SERVICE_TOKEN,
        CACHE_OPTIONS_TOKEN,
        CacheService,
      ],
    };
    Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, CacheModule);

    return CacheModule;
  }
}
