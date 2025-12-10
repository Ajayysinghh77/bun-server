import type { HeadersInit } from 'bun';
/**
 * 响应封装类
 * 提供便捷的响应创建方法
 */
export declare class ResponseBuilder {
    /**
     * 创建 JSON 响应
     * @param data - 响应数据
     * @param status - HTTP 状态码
     * @param headers - 响应头
     * @returns Response 对象
     */
    static json(data: unknown, status?: number, headers?: HeadersInit): Response;
    /**
     * 创建文本响应
     * @param text - 响应文本
     * @param status - HTTP 状态码
     * @param headers - 响应头
     * @returns Response 对象
     */
    static text(text: string, status?: number, headers?: HeadersInit): Response;
    /**
     * 创建 HTML 响应
     * @param html - HTML 内容
     * @param status - HTTP 状态码
     * @param headers - 响应头
     * @returns Response 对象
     */
    static html(html: string, status?: number, headers?: HeadersInit): Response;
    /**
     * 创建空响应
     * @param status - HTTP 状态码
     * @param headers - 响应头
     * @returns Response 对象
     */
    static empty(status?: number, headers?: HeadersInit): Response;
    /**
     * 创建重定向响应
     * @param url - 重定向 URL
     * @param status - HTTP 状态码（默认 302）
     * @returns Response 对象
     */
    static redirect(url: string, status?: number): Response;
    /**
     * 创建错误响应
     * @param message - 错误消息
     * @param status - HTTP 状态码
     * @returns Response 对象
     */
    static error(message: string, status?: number): Response;
    /**
     * 创建文件/下载响应
     * @param source - 文件路径或二进制数据
     * @param options - 响应配置
     * @returns Response 对象
     */
    static file(source: string | Blob | ArrayBuffer | ArrayBufferView, options?: {
        fileName?: string;
        contentType?: string;
        status?: number;
        headers?: HeadersInit;
    }): Response;
}
//# sourceMappingURL=response.d.ts.map