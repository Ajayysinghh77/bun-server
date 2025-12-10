import 'reflect-metadata';
/**
 * 参数类型枚举
 */
export declare enum ParamType {
    BODY = "body",
    QUERY = "query",
    PARAM = "param",
    HEADER = "header"
}
/**
 * 参数元数据
 */
export interface ParamMetadata {
    type: ParamType;
    key?: string;
    index: number;
}
/**
 * Body 参数装饰器
 * @param key - 参数键（可选，用于提取对象中的特定字段）
 */
export declare function Body(key?: string): (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => void;
/**
 * Query 参数装饰器
 * @param key - 查询参数键
 */
export declare function Query(key: string): (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => void;
/**
 * Param 参数装饰器（路径参数）
 * @param key - 路径参数键
 */
export declare function Param(key: string): (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => void;
/**
 * Header 参数装饰器
 * @param key - 请求头键
 */
export declare function Header(key: string): (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => void;
/**
 * 获取参数元数据
 * @param target - 目标对象
 * @param propertyKey - 属性键
 * @returns 参数元数据列表
 */
export declare function getParamMetadata(target: any, propertyKey: string): ParamMetadata[];
//# sourceMappingURL=decorators.d.ts.map