import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { Application } from '../../src/core/application';
import { Controller } from '../../src/controller';
import { GET } from '../../src/router/decorators';
import { Auth } from '../../src/auth/decorators';
import {
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '../../src/error/http-exception';
import { ErrorCode } from '../../src/error/error-codes';
import { SecurityModule } from '../../src/security/security-module';
import { RouteRegistry } from '../../src/router/registry';
import { ControllerRegistry } from '../../src/controller/controller';
import { ModuleRegistry } from '../../src/di/module-registry';
import { ExceptionFilterRegistry } from '../../src/error/filter';
import { getTestPort } from '../utils/test-port';
import type { Context } from '../../src/core/context';

let port: number;
let app: Application;

@Controller('/api/test')
class TestController {
  @GET('/unauthorized')
  @Auth()
  public unauthorized() {
    throw new UnauthorizedException('Test unauthorized');
  }

  @GET('/forbidden')
  @Auth({ roles: ['admin'] })
  public forbidden(ctx: Context) {
    // 这个端点需要 admin 角色，但用户只有 user 角色
    return ctx.createResponse({ message: 'ok' });
  }

  @GET('/not-found')
  public notFound() {
    throw new NotFoundException('Resource not found', undefined, ErrorCode.RESOURCE_NOT_FOUND);
  }
}

describe('Error I18n Integration', () => {
  beforeEach(() => {
    port = getTestPort();
  });

  afterEach(() => {
    if (app) {
      app.stop();
    }
    RouteRegistry.getInstance().clear();
    ControllerRegistry.getInstance().clear();
    ModuleRegistry.getInstance().clear();
    ExceptionFilterRegistry.getInstance().clear();
  });

  test('should return error code in response', async () => {
    app = new Application({ port });
    SecurityModule.forRoot({
      jwt: {
        secret: 'test-secret',
        accessTokenExpiresIn: 3600,
      },
      defaultAuthRequired: false,
    });
    app.registerModule(SecurityModule);
    app.registerController(TestController);
    app.listen();

    const response = await fetch(`http://localhost:${port}/api/test/not-found`);
    const data = await response.json();

    expect(response.status).toBe(404);
    // 调试：打印实际响应
    if (!data.code) {
      console.log('Actual response:', JSON.stringify(data, null, 2));
    }
    expect(data.code).toBe(ErrorCode.RESOURCE_NOT_FOUND);
    expect(data.error).toBeDefined();
  });

  test('should return English error message by default', async () => {
    app = new Application({ port });
    SecurityModule.forRoot({
      jwt: {
        secret: 'test-secret',
        accessTokenExpiresIn: 3600,
      },
      defaultAuthRequired: false,
    });
    app.registerModule(SecurityModule);
    app.registerController(TestController);
    app.listen();

    const response = await fetch(`http://localhost:${port}/api/test/not-found`);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Resource Not Found');
  });

  test('should return Chinese error message when Accept-Language is zh-CN', async () => {
    app = new Application({ port });
    SecurityModule.forRoot({
      jwt: {
        secret: 'test-secret',
        accessTokenExpiresIn: 3600,
      },
      defaultAuthRequired: false,
    });
    app.registerModule(SecurityModule);
    app.registerController(TestController);
    app.listen();

    const response = await fetch(`http://localhost:${port}/api/test/not-found`, {
      headers: {
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.code).toBe(ErrorCode.RESOURCE_NOT_FOUND);
    expect(data.error).toBe('资源未找到');
  });

  test('should return error code for authentication errors', async () => {
    app = new Application({ port });
    SecurityModule.forRoot({
      jwt: {
        secret: 'test-secret',
        accessTokenExpiresIn: 3600,
      },
      defaultAuthRequired: false,
    });
    app.registerModule(SecurityModule);
    app.registerController(TestController);
    app.listen();

    const response = await fetch(`http://localhost:${port}/api/test/unauthorized`);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.code).toBe(ErrorCode.AUTH_REQUIRED);
    expect(data.error).toBeDefined();
  });

  test('should return Chinese error message for authentication errors', async () => {
    app = new Application({ port });
    SecurityModule.forRoot({
      jwt: {
        secret: 'test-secret',
        accessTokenExpiresIn: 3600,
      },
      defaultAuthRequired: false,
    });
    app.registerModule(SecurityModule);
    app.registerController(TestController);
    app.listen();

    const response = await fetch(`http://localhost:${port}/api/test/unauthorized`, {
      headers: {
        'Accept-Language': 'zh-CN',
      },
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.code).toBe(ErrorCode.AUTH_REQUIRED);
    expect(data.error).toBe('需要认证');
  });
});

