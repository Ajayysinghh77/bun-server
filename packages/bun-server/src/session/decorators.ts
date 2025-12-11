import 'reflect-metadata';
import type { Context } from '../core/context';
import { SessionService } from './service';
import { SESSION_SERVICE_TOKEN } from './types';
import { Container } from '../di/container';

/**
 * Session 装饰器元数据键
 */
const SESSION_METADATA_KEY = Symbol('@dangao/bun-server:session:session');

/**
 * Session 参数装饰器工厂
 * 用于在控制器方法中注入 Session 对象
 * @returns 参数装饰器函数
 */
export function Session() {
  return function (
    target: any,
    propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ): void {
    // 参数装饰器的 target 可能是构造函数本身（用于构造函数参数）
    // 也可能是类的原型（用于方法参数）
    // 如果 propertyKey 不存在，说明装饰器用在了构造函数参数上，这是不支持的
    if (!propertyKey) {
      // 对于构造函数参数，我们无法使用 Session，因为此时还没有 Context
      // 所以静默返回，不抛出错误，避免破坏其他装饰器的执行
      return;
    }

    // 确保 target 是对象或函数类型（函数也是对象）
    // 参数装饰器的 target 应该是类的原型对象（对于方法参数）
    if (!target || (typeof target !== 'object' && typeof target !== 'function')) {
      return;
    }

    // 使用 Object 类型确保 Reflect.defineMetadata 可以正常工作
    Reflect.defineMetadata(
      SESSION_METADATA_KEY,
      parameterIndex,
      target,
      propertyKey as string,
    );
  };
}

/**
 * 获取 Session 对象（用于参数绑定）
 * @param context - 请求上下文
 * @param container - DI 容器
 * @returns Session 对象，如果不存在则返回 undefined
 */
export async function getSessionFromContext(
  context: Context,
  container: Container,
): Promise<unknown | undefined> {
  // 从 Context 中获取 Session（由中间件设置）
  const session = (context as unknown as { session?: unknown }).session;
  if (session) {
    return session;
  }

  // 如果没有 Session，尝试创建新 Session
  const sessionService = container.resolve<SessionService>(
    SESSION_SERVICE_TOKEN,
  );
  if (sessionService) {
    const newSession = await sessionService.create();
    (context as unknown as { session: typeof newSession }).session =
      newSession;
    (context as unknown as { sessionId: string }).sessionId = newSession.id;
    return newSession;
  }

  return undefined;
}
