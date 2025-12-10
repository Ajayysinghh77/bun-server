import type { Context } from '../core/context';
export interface UploadedFile {
    name: string;
    type: string;
    size: number;
    data: ArrayBuffer;
}
export declare class FileHandler {
    private static readonly MAX_SIZE;
    static parseFormData(context: Context): Promise<FormData>;
    static getFiles(formData: FormData): Promise<Record<string, UploadedFile[]>>;
}
//# sourceMappingURL=file-handler.d.ts.map