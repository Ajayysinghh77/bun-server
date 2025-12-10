import type { Middleware } from '../middleware';
import { SwaggerExtension } from './swagger-extension';
/**
 * 创建 Swagger UI 中间件
 * @param extension - Swagger 扩展实例
 * @param options - 配置选项
 */
export declare function createSwaggerUIMiddleware(extension: SwaggerExtension, options?: {
    uiPath?: string;
    jsonPath?: string;
    title?: string;
}): Middleware;
//# sourceMappingURL=ui.d.ts.map