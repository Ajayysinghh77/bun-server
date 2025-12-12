import { afterEach, describe, expect, test } from 'bun:test';

import { Controller, ControllerRegistry } from '../../src/controller/controller';
import { GET } from '../../src/router/decorators';
import { getRouteMetadata } from '../../src/controller/metadata';
import { RouteRegistry } from '../../src/router/registry';

describe('Router Decorators', () => {
  afterEach(() => {
    RouteRegistry.getInstance().clear();
    ControllerRegistry.getInstance().clear();
  });

  test('should record metadata for controller methods', () => {
    @Controller('/decorator')
    class DecoratedController {
      @GET('/list')
      public list() {
        return 'ok';
      }
    }

    const metadata = getRouteMetadata(DecoratedController.prototype);
    expect(metadata.length).toBe(1);
    expect(metadata[0]?.path).toBe('/list');
    expect(metadata[0]?.method).toBe('GET');
    expect(typeof metadata[0]?.handler).toBe('function');
  });

  test('should throw error when registering class without @Controller decorator', () => {
    // 注意：由于装饰器应用顺序，@GET 装饰器会保存元数据，不会立即报错
    class PlainHandlers {
      @GET('/plain')
      public handler() {
        return { ok: true };
      }
    }

    // 但尝试注册时会报错，因为类没有 @Controller 装饰器
    const registry = ControllerRegistry.getInstance();
    expect(() => {
      registry.register(PlainHandlers);
    }).toThrow('Controller PlainHandlers must be decorated with @Controller()');
  });
});

