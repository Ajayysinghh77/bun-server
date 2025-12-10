import type { Server } from "bun";
import { Context } from "./context";
import type { WebSocketGatewayRegistry } from "../websocket/registry";
import type { WebSocketConnectionData } from "../websocket/registry";
/**
 * 服务器配置选项
 */
export interface ServerOptions {
    /**
     * 端口号
     */
    port?: number;
    /**
     * 主机名
     */
    hostname?: string;
    /**
     * 请求处理函数
     */
    fetch: (context: Context) => Response | Promise<Response>;
    /**
     * WebSocket 网关注册表
     */
    websocketRegistry?: WebSocketGatewayRegistry;
}
/**
 * 服务器封装类
 * 基于 Bun.serve() 构建
 */
export declare class BunServer {
    private server?;
    private readonly options;
    constructor(options: ServerOptions);
    /**
     * 启动服务器
     */
    start(): void;
    /**
     * 停止服务器
     */
    stop(): void;
    /**
     * 获取服务器实例
     * @returns Bun Server 实例
     */
    getServer(): Server<WebSocketConnectionData> | undefined;
    /**
     * 检查服务器是否运行中
     * @returns 是否运行中
     */
    isRunning(): boolean;
}
//# sourceMappingURL=server.d.ts.map