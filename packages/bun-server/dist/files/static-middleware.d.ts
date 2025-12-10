import type { Middleware } from '../middleware';
export interface StaticFileOptions {
    root: string;
    prefix?: string;
    fallthrough?: boolean;
}
export declare function createStaticFileMiddleware(options: StaticFileOptions): Middleware;
//# sourceMappingURL=static-middleware.d.ts.map