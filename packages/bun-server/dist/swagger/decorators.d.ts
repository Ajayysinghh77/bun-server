import 'reflect-metadata';
import type { ApiBodyMetadata, ApiOperationMetadata, ApiParamMetadata, ApiResponseMetadata } from './types';
/**
 * API 标签装饰器
 * 用于标记控制器或操作的标签
 * @param metadata - 标签元数据
 */
export declare function ApiTags(...tags: string[]): ClassDecorator & MethodDecorator;
/**
 * API 操作装饰器
 * 用于描述 API 操作
 * @param metadata - 操作元数据
 */
export declare function ApiOperation(metadata: ApiOperationMetadata): MethodDecorator;
/**
 * API 参数装饰器
 * 用于描述 API 参数
 * @param metadata - 参数元数据
 */
export declare function ApiParam(metadata: ApiParamMetadata): ParameterDecorator;
/**
 * API 请求体装饰器
 * 用于描述请求体
 * @param metadata - 请求体元数据
 */
export declare function ApiBody(metadata: ApiBodyMetadata): MethodDecorator;
/**
 * API 响应装饰器
 * 用于描述 API 响应
 * @param metadata - 响应元数据
 */
export declare function ApiResponse(metadata: ApiResponseMetadata): MethodDecorator;
/**
 * 获取 API 标签
 */
export declare function getApiTags(target: unknown, propertyKey?: string | symbol): string[];
/**
 * 获取 API 操作元数据
 */
export declare function getApiOperation(target: unknown, propertyKey: string | symbol): ApiOperationMetadata | undefined;
/**
 * 获取 API 参数元数据
 */
export declare function getApiParams(target: unknown, propertyKey: string | symbol): Array<{
    index: number;
    metadata: ApiParamMetadata;
}>;
/**
 * 获取 API 请求体元数据
 */
export declare function getApiBody(target: unknown, propertyKey: string | symbol): ApiBodyMetadata | undefined;
/**
 * 获取 API 响应元数据
 */
export declare function getApiResponses(target: unknown, propertyKey: string | symbol): ApiResponseMetadata[];
//# sourceMappingURL=decorators.d.ts.map