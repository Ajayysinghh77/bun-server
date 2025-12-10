import type { Middleware } from '../middleware';
export interface CorsOptions {
    origin?: string | string[] | '*';
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
}
/**
 * CORS 中间件
 */
export declare function createCorsMiddleware(options?: CorsOptions): Middleware;
//# sourceMappingURL=cors.d.ts.map