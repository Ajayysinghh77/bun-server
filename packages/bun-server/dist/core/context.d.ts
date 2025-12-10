import type { UploadedFileInfo } from '../files';
/**
 * 请求上下文
 * 封装 Request 和 Response，提供便捷的访问方法
 */
export declare class Context {
    /**
     * 原始请求对象
     */
    readonly request: Request;
    /**
     * 响应对象（可选，由框架创建）
     */
    response?: Response;
    /**
     * 请求 URL
     */
    readonly url: URL;
    /**
     * 请求方法
     */
    readonly method: string;
    /**
     * 请求路径
     */
    readonly path: string;
    /**
     * 查询参数
     */
    readonly query: URLSearchParams;
    /**
     * 路径参数（由路由匹配后填充）
     */
    params: Record<string, string>;
    /**
     * 请求头
     */
    readonly headers: Headers;
    /**
     * 响应头
     */
    responseHeaders: Headers;
    /**
     * 状态码
     */
    statusCode: number;
    /**
     * 上传文件信息
     */
    files: UploadedFileInfo[];
    /**
     * 请求体（解析后的）
     */
    private _body?;
    /**
     * 是否已解析请求体
     */
    private _bodyParsed;
    constructor(request: Request);
    /**
     * 获取请求体（自动解析）
     * @returns 解析后的请求体
     */
    getBody(): Promise<unknown>;
    /**
     * 获取请求体（已解析的，如果未解析则返回 undefined）
     * @returns 请求体或 undefined
     */
    get body(): unknown;
    /**
     * 设置请求体
     * @param body - 请求体
     */
    set body(body: unknown);
    /**
     * 获取查询参数
     * @param key - 参数名
     * @returns 参数值
     */
    getQuery(key: string): string | null;
    /**
     * 获取所有查询参数
     * @returns 查询参数对象
     */
    getQueryAll(): Record<string, string>;
    /**
     * 获取路径参数
     * @param key - 参数名
     * @returns 参数值
     */
    getParam(key: string): string | undefined;
    /**
     * 获取请求头
     * @param key - 头名称
     * @returns 头值
     */
    getHeader(key: string): string | null;
    /**
     * 获取客户端 IP 地址
     * 优先从 X-Forwarded-For 头获取（代理场景），否则从连接信息获取
     * @returns 客户端 IP 地址
     */
    getClientIp(): string;
    /**
     * 设置响应头
     * @param key - 头名称
     * @param value - 头值
     */
    setHeader(key: string, value: string): void;
    /**
     * 设置状态码
     * @param code - HTTP 状态码
     */
    setStatus(code: number): void;
    /**
     * 创建响应
     * @param body - 响应体
     * @param init - 响应初始化选项
     * @returns Response 对象
     */
    createResponse(body?: unknown, init?: ResponseInit): Response;
}
//# sourceMappingURL=context.d.ts.map