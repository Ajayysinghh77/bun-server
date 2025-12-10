import type { Context } from '../core/context';
/**
 * 参数绑定器
 * 根据装饰器元数据绑定参数
 */
export declare class ParamBinder {
    /**
     * 绑定参数
     * @param target - 目标对象
     * @param propertyKey - 属性键
     * @param context - 请求上下文
     * @returns 参数数组
     */
    static bind(target: any, propertyKey: string, context: Context): Promise<unknown[]>;
    /**
     * 获取参数值
     * @param meta - 参数元数据
     * @param context - 请求上下文
     * @returns 参数值
     */
    private static getValue;
    /**
     * 获取 Body 值
     * @param key - 键（可选）
     * @param context - 请求上下文
     * @returns Body 值
     */
    private static getBodyValue;
    /**
     * 获取 Query 值
     * @param key - 键
     * @param context - 请求上下文
     * @returns Query 值
     */
    private static getQueryValue;
    /**
     * 获取 Param 值
     * @param key - 键
     * @param context - 请求上下文
     * @returns Param 值
     */
    private static getParamValue;
    /**
     * 获取 Header 值
     * @param key - 键
     * @param context - 请求上下文
     * @returns Header 值
     */
    private static getHeaderValue;
}
//# sourceMappingURL=param-binder.d.ts.map