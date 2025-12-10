import 'reflect-metadata';

/**
 * Entity 元数据键
 */
export const ENTITY_METADATA_KEY = Symbol('@dangao/bun-server:orm:entity');

/**
 * Column 元数据键
 */
export const COLUMN_METADATA_KEY = Symbol('@dangao/bun-server:orm:column');

/**
 * Entity 装饰器
 * 标记一个类为数据库实体
 * @param tableName - 表名
 */
export function Entity(tableName: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(ENTITY_METADATA_KEY, { tableName }, target);
  };
}

/**
 * Column 装饰器
 * 标记一个属性为数据库列
 * @param options - 列选项
 */
export function Column(options?: {
  /**
   * 列名（默认为属性名）
   */
  name?: string;
  /**
   * 列类型
   */
  type?: string;
  /**
   * 是否为主键
   */
  primaryKey?: boolean;
  /**
   * 是否自动递增
   */
  autoIncrement?: boolean;
  /**
   * 是否可为空
   */
  nullable?: boolean;
  /**
   * 默认值
   */
  defaultValue?: unknown;
}): PropertyDecorator {
  return (target, propertyKey) => {
    const existingColumns =
      Reflect.getMetadata(COLUMN_METADATA_KEY, target.constructor) || [];
    
    // 检查是否已存在该属性的列定义
    const existingIndex = existingColumns.findIndex(
      (col: { propertyKey: string }) => col.propertyKey === String(propertyKey),
    );
    
    const columnDef = {
      name: options?.name ?? String(propertyKey),
      type: options?.type ?? 'TEXT',
      primaryKey: options?.primaryKey ?? false,
      autoIncrement: options?.autoIncrement ?? false,
      nullable: options?.nullable !== undefined ? options.nullable : true,
      defaultValue: options?.defaultValue,
      propertyKey: String(propertyKey),
    };
    
    if (existingIndex >= 0) {
      // 合并现有定义（保留已有的 primaryKey、nullable 等设置）
      const existing = existingColumns[existingIndex] as {
        primaryKey: boolean;
        nullable: boolean;
        autoIncrement: boolean;
        type: string;
        name: string;
        defaultValue?: unknown;
      };
      existingColumns[existingIndex] = {
        ...existing,
        // 合并时，如果新定义中明确设置了属性，使用新值；否则保留旧值
        name: options?.name ?? existing.name,
        type: options?.type ?? existing.type,
        primaryKey:
          options?.primaryKey !== undefined
            ? options.primaryKey
            : existing.primaryKey,
        nullable:
          options?.nullable !== undefined ? options.nullable : existing.nullable,
        autoIncrement:
          options?.autoIncrement !== undefined
            ? options.autoIncrement
            : existing.autoIncrement,
        defaultValue:
          options?.defaultValue !== undefined
            ? options.defaultValue
            : existing.defaultValue,
        propertyKey: String(propertyKey),
      };
    } else {
      existingColumns.push(columnDef);
    }
    
    Reflect.defineMetadata(
      COLUMN_METADATA_KEY,
      existingColumns,
      target.constructor,
    );
  };
}

/**
 * PrimaryKey 装饰器
 * 标记一个属性为主键
 */
export function PrimaryKey(): PropertyDecorator {
  return Column({ primaryKey: true, nullable: false });
}

/**
 * 获取 Entity 元数据
 */
export function getEntityMetadata(
  target: unknown,
): { tableName: string } | undefined {
  if (typeof target === 'function' || (typeof target === 'object' && target !== null)) {
    return Reflect.getMetadata(ENTITY_METADATA_KEY, target as object);
  }
  return undefined;
}

/**
 * 获取 Column 元数据
 */
export function getColumnMetadata(
  target: unknown,
): Array<{
  name: string;
  type: string;
  primaryKey: boolean;
  autoIncrement: boolean;
  nullable: boolean;
  defaultValue?: unknown;
  propertyKey: string;
}> {
  if (typeof target === 'function' || (typeof target === 'object' && target !== null)) {
    return Reflect.getMetadata(COLUMN_METADATA_KEY, target as object) || [];
  }
  return [];
}
