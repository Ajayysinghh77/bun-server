import type { DatabaseService } from '../service';

/**
 * Drizzle Repository 基类
 * 使用 Drizzle ORM 提供类型安全的查询
 * 注意：这是一个抽象基类，供使用 Drizzle ORM 的 Repository 继承
 * 继承此类的 Repository 需要自己添加 @Injectable() 装饰器
 */
export abstract class DrizzleBaseRepository<TTable, TSelect, TInsert, TUpdate> {
  protected abstract table: TTable;
  protected abstract drizzle: unknown;

  public constructor(protected readonly databaseService: DatabaseService) {}

  /**
   * 查找所有记录
   */
  public abstract findAll(): Promise<TSelect[]>;

  /**
   * 根据 ID 查找记录
   */
  public abstract findById(id: string | number): Promise<TSelect | null>;

  /**
   * 创建记录
   */
  public abstract create(data: TInsert): Promise<TSelect>;

  /**
   * 更新记录
   */
  public abstract update(id: string | number, data: TUpdate): Promise<TSelect>;

  /**
   * 删除记录
   */
  public abstract delete(id: string | number): Promise<boolean>;
}
