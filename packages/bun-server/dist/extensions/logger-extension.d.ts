import type { Container } from "../di/container";
import type { ApplicationExtension } from "./types";
import { type LoggerOptions } from "@dangao/logsmith";
export declare const LOGGER_TOKEN: unique symbol;
/**
 * Bun Server Logger Provider
 */
export declare class LoggerExtension implements ApplicationExtension {
    private readonly options;
    constructor(options?: LoggerOptions);
    register(container: Container): void;
}
//# sourceMappingURL=logger-extension.d.ts.map