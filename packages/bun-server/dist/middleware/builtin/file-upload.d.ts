import type { Middleware } from '../middleware';
export interface FileUploadOptions {
    maxSize?: number;
}
/**
 * 简单的文件上传中间件：解析 multipart/form-data 并将文件附加到 context.body
 */
export declare function createFileUploadMiddleware(options?: FileUploadOptions): Middleware;
//# sourceMappingURL=file-upload.d.ts.map