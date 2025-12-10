import 'reflect-metadata';
export interface WebSocketGatewayMetadata {
    path: string;
}
export interface WebSocketHandlerMetadata {
    open?: string;
    message?: string;
    close?: string;
}
export declare function WebSocketGateway(path: string): ClassDecorator;
export declare const OnOpen: MethodDecorator;
export declare const OnMessage: MethodDecorator;
export declare const OnClose: MethodDecorator;
export declare function getGatewayMetadata(constructor: new (...args: unknown[]) => unknown): WebSocketGatewayMetadata | undefined;
export declare function getHandlerMetadata(target: object): WebSocketHandlerMetadata;
//# sourceMappingURL=decorators.d.ts.map