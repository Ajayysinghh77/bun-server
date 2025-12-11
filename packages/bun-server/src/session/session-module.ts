import { Module, MODULE_METADATA_KEY, type ModuleProvider } from '../di/module';

import { SessionService } from './service';
import {
  SESSION_OPTIONS_TOKEN,
  SESSION_SERVICE_TOKEN,
  MemorySessionStore,
  type SessionModuleOptions,
  type SessionStore,
} from './types';

@Module({
  providers: [],
})
export class SessionModule {
  /**
   * 创建 Session 模块
   * @param options - 模块配置
   */
  public static forRoot(
    options: SessionModuleOptions = {},
  ): typeof SessionModule {
    const providers: ModuleProvider[] = [];

    // 如果没有提供 store，使用默认的内存存储
    const store: SessionStore =
      options.store ??
      new MemorySessionStore({
        cleanupInterval: 60000, // 每分钟清理一次
      });

    const service = new SessionService({
      store,
      name: options.name,
      maxAge: options.maxAge,
      rolling: options.rolling,
      cookie: options.cookie,
    });

    providers.push(
      {
        provide: SESSION_SERVICE_TOKEN,
        useValue: service,
      },
      {
        provide: SESSION_OPTIONS_TOKEN,
        useValue: options,
      },
      SessionService,
    );

    // 动态更新模块元数据
    const existingMetadata =
      Reflect.getMetadata(MODULE_METADATA_KEY, SessionModule) || {};
    const metadata = {
      ...existingMetadata,
      providers: [...(existingMetadata.providers || []), ...providers],
      exports: [
        ...(existingMetadata.exports || []),
        SESSION_SERVICE_TOKEN,
        SESSION_OPTIONS_TOKEN,
        SessionService,
      ],
    };
    Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, SessionModule);

    return SessionModule;
  }
}
