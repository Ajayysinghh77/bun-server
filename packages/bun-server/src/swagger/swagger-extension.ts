import type { Container } from '../di/container';
import type { ApplicationExtension } from '../extensions/types';
import { SwaggerGenerator } from './generator';
import type { SwaggerOptions } from './types';

/**
 * Swagger 扩展
 */
export class SwaggerExtension implements ApplicationExtension {
  private readonly options: SwaggerOptions;
  private generator?: SwaggerGenerator;

  public constructor(options: SwaggerOptions) {
    this.options = options;
  }

  /**
   * 注册扩展
   */
  public register(_container: Container): void {
    this.generator = new SwaggerGenerator(this.options);
  }

  /**
   * 获取 Swagger 文档生成器
   */
  public getGenerator(): SwaggerGenerator {
    if (!this.generator) {
      this.generator = new SwaggerGenerator(this.options);
    }
    return this.generator;
  }

  /**
   * 生成 Swagger JSON
   */
  public generateJSON(): string {
    return JSON.stringify(this.getGenerator().generate(), null, 2);
  }
}

