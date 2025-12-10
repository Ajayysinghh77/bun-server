import type { ServerWebSocket } from 'bun';
import type { Constructor } from '@/core/types';
export interface WebSocketConnectionData {
    path: string;
}
export declare class WebSocketGatewayRegistry {
    private static instance;
    private readonly container;
    private readonly gateways;
    private constructor();
    static getInstance(): WebSocketGatewayRegistry;
    register(gatewayClass: Constructor<unknown>): void;
    hasGateway(path: string): boolean;
    clear(): void;
    private getGateway;
    private getGatewayInstance;
    private invokeHandler;
    handleOpen(ws: ServerWebSocket<WebSocketConnectionData>): void;
    handleMessage(ws: ServerWebSocket<WebSocketConnectionData>, message: string | ArrayBuffer | ArrayBufferView): void;
    handleClose(ws: ServerWebSocket<WebSocketConnectionData>, code: number, reason: string): void;
}
//# sourceMappingURL=registry.d.ts.map