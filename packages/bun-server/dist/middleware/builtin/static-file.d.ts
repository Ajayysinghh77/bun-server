import type { Middleware } from '../middleware';
import type { HeadersInit } from 'bun';
export interface StaticFileOptions {
    root: string;
    prefix?: string;
    indexFile?: string;
    enableCache?: boolean;
    headers?: HeadersInit | Headers;
}
/**
 * 静态文件服务中间件
 */
export declare function createStaticFileMiddleware(options: StaticFileOptions): Middleware;
//# sourceMappingURL=static-file.d.ts.map