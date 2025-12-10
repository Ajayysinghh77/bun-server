import type { Container } from '../di/container';
import type { ApplicationExtension } from '../extensions/types';
import { SwaggerGenerator } from './generator';
import type { SwaggerOptions } from './types';
/**
 * Swagger 扩展
 */
export declare class SwaggerExtension implements ApplicationExtension {
    private readonly options;
    private generator?;
    constructor(options: SwaggerOptions);
    /**
     * 注册扩展
     */
    register(_container: Container): void;
    /**
     * 获取 Swagger 文档生成器
     */
    getGenerator(): SwaggerGenerator;
    /**
     * 生成 Swagger JSON
     */
    generateJSON(): string;
}
//# sourceMappingURL=swagger-extension.d.ts.map