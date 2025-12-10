import 'reflect-metadata';
import type { Constructor } from '@/core/types';
import type { Container } from './container';
import type { Lifecycle } from './types';
import type { ApplicationExtension } from '../extensions/types';
import type { Middleware } from '../middleware';
export type ModuleClass<T = unknown> = Constructor<T>;
export type ProviderToken = Constructor<unknown> | string | symbol;
export interface ClassProvider {
    provide?: ProviderToken;
    useClass: Constructor<unknown>;
    lifecycle?: Lifecycle;
}
export interface ValueProvider {
    provide: ProviderToken;
    useValue: unknown;
}
export interface FactoryProvider {
    provide: ProviderToken;
    useFactory: (container: Container) => unknown;
    lifecycle?: Lifecycle;
}
export type ModuleProvider = Constructor<unknown> | ClassProvider | ValueProvider | FactoryProvider;
export interface ModuleMetadata {
    imports?: ModuleClass[];
    controllers?: Constructor<unknown>[];
    providers?: ModuleProvider[];
    exports?: ProviderToken[];
    /**
     * 应用扩展列表
     */
    extensions?: ApplicationExtension[];
    /**
     * 中间件列表
     */
    middlewares?: Middleware[];
}
export declare const MODULE_METADATA_KEY: unique symbol;
export declare function Module(metadata: ModuleMetadata): ClassDecorator;
export declare function getModuleMetadata(moduleClass: ModuleClass): Required<Omit<ModuleMetadata, 'extensions' | 'middlewares'>> & Pick<ModuleMetadata, 'extensions' | 'middlewares'>;
//# sourceMappingURL=module.d.ts.map