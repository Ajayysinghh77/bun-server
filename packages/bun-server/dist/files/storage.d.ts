import type { UploadedFileInfo } from './types';
export interface SaveFileOptions {
    dest: string;
    filename?: string;
    overwrite?: boolean;
}
export declare class FileStorage {
    static saveFile(file: File, options: SaveFileOptions, fieldName: string): Promise<UploadedFileInfo>;
}
//# sourceMappingURL=storage.d.ts.map