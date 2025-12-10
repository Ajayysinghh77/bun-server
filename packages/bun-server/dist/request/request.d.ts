/**
 * 请求封装类
 * 扩展原生 Request，提供便捷方法
 */
export declare class RequestWrapper {
    /**
     * 原始请求对象
     */
    readonly request: Request;
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
     * 请求头
     */
    readonly headers: Headers;
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
    body(): Promise<unknown>;
    /**
     * 获取请求体（已解析的，如果未解析则返回 undefined）
     * @returns 请求体或 undefined
     */
    getBody(): unknown;
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
     * 获取请求头
     * @param key - 头名称
     * @returns 头值
     */
    getHeader(key: string): string | null;
}
//# sourceMappingURL=request.d.ts.map