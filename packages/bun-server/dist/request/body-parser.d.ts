/**
 * 请求体解析器
 * 支持 JSON、FormData、URLEncoded 等格式
 */
export declare class BodyParser {
    /**
     * 解析请求体
     * @param request - 请求对象
     * @returns 解析后的请求体
     */
    static parse(request: Request): Promise<unknown>;
    /**
     * 解析 JSON 格式
     * @param request - 请求对象
     * @returns 解析后的对象
     */
    private static parseJSON;
    /**
     * 解析 FormData 格式
     * @param request - 请求对象
     * @returns 解析后的 FormData 对象
     */
    private static parseFormData;
    /**
     * 解析 URLEncoded 格式
     * @param request - 请求对象
     * @returns 解析后的对象
     */
    private static parseURLEncoded;
    /**
     * 解析文本格式
     * @param request - 请求对象
     * @returns 文本内容
     */
    private static parseText;
}
//# sourceMappingURL=body-parser.d.ts.map