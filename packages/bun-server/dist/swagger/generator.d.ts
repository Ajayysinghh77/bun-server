import type { SwaggerDocument, SwaggerOptions } from './types';
/**
 * Swagger 文档生成器
 */
export declare class SwaggerGenerator {
    private readonly options;
    constructor(options: SwaggerOptions);
    /**
     * 生成 Swagger 文档
     */
    generate(): SwaggerDocument;
    /**
     * 规范化路径
     */
    private normalizePath;
}
//# sourceMappingURL=generator.d.ts.map