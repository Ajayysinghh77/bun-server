import 'reflect-metadata';
import type { Context } from '../core/context';
import { SessionService } from './service';
import { SESSION_SERVICE_TOKEN } from './types';
import { Container } from '../di/container';
import { ParamType, createParamDecorator } from '../controller/decorators';

/**
 * Session 参数装饰器
 * 用于在控制器方法中注入 Session 对象
 */
export function Session() {
  return createParamDecorator(ParamType.SESSION);
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
