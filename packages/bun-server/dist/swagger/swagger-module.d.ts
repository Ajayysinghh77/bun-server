import type { SwaggerOptions } from './types';
/**
 * Swagger 模块配置
 */
export interface SwaggerModuleOptions extends SwaggerOptions {
    /**
     * Swagger UI 路径
     * @default '/swagger'
     */
    uiPath?: string;
    /**
     * Swagger JSON 路径
     * @default '/swagger.json'
     */
    jsonPath?: string;
    /**
     * Swagger UI 标题
     */
    uiTitle?: string;
    /**
     * 是否启用 Swagger UI
     * @default true
     */
    enableUI?: boolean;
}
/**
 * Swagger 模块
 * 提供 API 文档生成和 Swagger UI
 */
export declare class SwaggerModule {
    /**
     * 创建 Swagger 模块
     * @param options - 模块配置
     */
    static forRoot(options: SwaggerModuleOptions): typeof SwaggerModule;
}
//# sourceMappingURL=swagger-module.d.ts.map