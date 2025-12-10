import type { Context } from '../core/context';
export interface ExceptionFilter {
    /**
     * 捕获异常并返回 Response
     * 如果返回 undefined，则继续交给下一个过滤器
     */
    catch(error: unknown, context: Context): Response | Promise<Response> | undefined;
}
export declare class ExceptionFilterRegistry {
    private static instance;
    private readonly filters;
    private constructor();
    static getInstance(): ExceptionFilterRegistry;
    register(filter: ExceptionFilter): void;
    clear(): void;
    execute(error: unknown, context: Context): Promise<Response | undefined>;
}
//# sourceMappingURL=filter.d.ts.map