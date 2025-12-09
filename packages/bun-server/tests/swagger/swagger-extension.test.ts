import { describe, expect, test } from 'bun:test';
import { SwaggerExtension } from '../../src/swagger/swagger-extension';
import { Container } from '../../src/di/container';

describe('SwaggerExtension', () => {
  test('should create extension with options', () => {
    const extension = new SwaggerExtension({
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
    });

    expect(extension).toBeDefined();
  });

  test('should register extension', () => {
    const container = new Container();
    const extension = new SwaggerExtension({
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
    });

    expect(() => extension.register(container)).not.toThrow();
  });

  test('should get generator', () => {
    const extension = new SwaggerExtension({
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
    });

    const generator = extension.getGenerator();
    expect(generator).toBeDefined();
  });

  test('should generate JSON', () => {
    const extension = new SwaggerExtension({
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
    });

    const json = extension.generateJSON();
    expect(json).toBeDefined();
    expect(() => JSON.parse(json)).not.toThrow();

    const document = JSON.parse(json);
    expect(document.openapi).toBe('3.0.0');
    expect(document.info.title).toBe('Test API');
  });

  test('should create generator on first access', () => {
    const extension = new SwaggerExtension({
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
    });

    // 访问两次应该返回同一个实例
    const generator1 = extension.getGenerator();
    const generator2 = extension.getGenerator();
    expect(generator1).toBe(generator2);
  });
});

