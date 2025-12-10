import { Container } from './container';
import { getModuleMetadata, type ModuleClass } from './module';
import type { ApplicationExtension } from '../extensions/types';
import type { Middleware } from '../middleware';
interface ModuleRef {
    moduleClass: ModuleClass;
    metadata: ReturnType<typeof getModuleMetadata>;
    container: Container;
    controllersRegistered: boolean;
    attachedParents: Set<Container>;
    extensions: ApplicationExtension[];
    middlewares: Middleware[];
}
export declare class ModuleRegistry {
    private static instance;
    private readonly moduleRefs;
    private readonly processing;
    private rootContainer?;
    static getInstance(): ModuleRegistry;
    register(moduleClass: ModuleClass, parentContainer: Container): ModuleRef;
    getModuleRef(moduleClass: ModuleClass): ModuleRef | undefined;
    clear(): void;
    private processModule;
    private getOrCreateModuleRef;
    private registerProviders;
    private registerControllers;
    private attachModuleToParent;
    /**
     * 获取模块的所有扩展（包括导入模块的扩展）
     */
    getModuleExtensions(moduleClass: ModuleClass): ApplicationExtension[];
    /**
     * 获取模块的所有中间件（包括导入模块的中间件）
     */
    getModuleMiddlewares(moduleClass: ModuleClass): Middleware[];
    private registerExport;
}
export {};
//# sourceMappingURL=module-registry.d.ts.map