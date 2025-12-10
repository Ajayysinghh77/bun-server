export interface ValidationIssue {
    /**
     * 参数索引
     */
    index: number;
    /**
     * 失败的规则名称
     */
    rule: string;
    /**
     * 错误信息
     */
    message: string;
}
export declare class ValidationError extends Error {
    readonly issues: ValidationIssue[];
    constructor(message: string, issues: ValidationIssue[]);
}
//# sourceMappingURL=errors.d.ts.map