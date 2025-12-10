import 'reflect-metadata';
import type { RouteHandler } from './types';
import type { HttpMethod } from './types';
/**
 * 路由元数据键
 */
export declare const ROUTE_METADATA_KEY: unique symbol;
/**
 * 路由元数据
 */
export interface RouteMetadata {
    method: HttpMethod;
    path: string;
    handler: RouteHandler;
    /**
     * 属性键（用于控制器方法）
     */
    propertyKey?: string;
}
/**
 * GET 路由装饰器
 * @param path - 路由路径
 */
export declare function GET(path: string): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void;
/**
 * POST 路由装饰器
 * @param path - 路由路径
 */
export declare function POST(path: string): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void;
/**
 * PUT 路由装饰器
 * @param path - 路由路径
 */
export declare function PUT(path: string): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void;
/**
 * DELETE 路由装饰器
 * @param path - 路由路径
 */
export declare function DELETE(path: string): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void;
/**
 * PATCH 路由装饰器
 * @param path - 路由路径
 */
export declare function PATCH(path: string): (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void;
//# sourceMappingURL=decorators.d.ts.map