import type { Middleware } from '../middleware';
import { type SaveFileOptions } from './storage';
export interface FileUploadOptions extends Omit<SaveFileOptions, 'filename'> {
    filename?: (fieldName: string, file: File) => string | undefined;
}
export declare function createFileUploadMiddleware(options: FileUploadOptions): Middleware;
//# sourceMappingURL=upload-middleware.d.ts.map