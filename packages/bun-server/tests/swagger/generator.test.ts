import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { SwaggerGenerator } from '../../src/swagger/generator';
import { Controller } from '../../src/controller';
import { GET, POST } from '../../src/router/decorators';
import { Body, Param, Query } from '../../src/controller/decorators';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '../../src/swagger/decorators';
import { ControllerRegistry } from '../../src/controller/controller';
import { RouteRegistry } from '../../src/router/registry';

describe('SwaggerGenerator', () => {
  let generator: SwaggerGenerator;

  beforeEach(() => {
    generator = new SwaggerGenerator({
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
    });
    ControllerRegistry.getInstance().clear();
    RouteRegistry.getInstance().clear();
  });

  afterEach(() => {
    ControllerRegistry.getInstance().clear();
    RouteRegistry.getInstance().clear();
  });

  test('should generate basic swagger document', () => {
    const document = generator.generate();

    expect(document.openapi).toBe('3.0.0');
    expect(document.info.title).toBe('Test API');
    expect(document.info.version).toBe('1.0.0');
    expect(document.paths).toBeDefined();
  });

  test('should generate paths from controllers', () => {
    @Controller('/api/users')
    @ApiTags('Users')
    class UserController {
      @GET('/')
      @ApiOperation({ summary: 'Get all users' })
      public getAllUsers() {
        return [];
      }
    }

    ControllerRegistry.getInstance().register(UserController);
    const document = generator.generate();

    expect(document.paths).toBeDefined();
    expect(document.paths['/api/users']).toBeDefined();
    expect(document.paths['/api/users'].get).toBeDefined();
    expect(document.paths['/api/users'].get?.summary).toBe('Get all users');
  });

  test('should include controller tags in path items', () => {
    @Controller('/api/users')
    @ApiTags('Users')
    class UserController {
      @GET('/')
      public getAllUsers() {
        return [];
      }
    }

    ControllerRegistry.getInstance().register(UserController);
    const document = generator.generate();

    const path = document.paths['/api/users'];
    expect(path).toBeDefined();
    expect(path.get?.tags).toBeDefined();
    expect(path.get?.tags).toContain('Users');
  });

  test('should include path parameters', () => {
    @Controller('/api/users')
    class UserController {
      @GET('/:id')
      @ApiParam({ name: 'id', description: 'User ID', required: true })
      public getUser(@Param('id') id: string) {
        return { id };
      }
    }

    ControllerRegistry.getInstance().register(UserController);
    const document = generator.generate();

    const path = document.paths['/api/users/{id}'];
    expect(path).toBeDefined();
    expect(path.get?.parameters).toBeDefined();
    const param = path.get?.parameters?.find((p) => p.name === 'id');
    expect(param).toBeDefined();
    expect(param?.required).toBe(true);
  });

  test('should include request body', () => {
    @Controller('/api/users')
    class UserController {
      @POST('/')
      @ApiBody({
        description: 'User data',
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
          },
        },
      })
      public createUser(@Body() data: { name: string; email: string }) {
        return data;
      }
    }

    ControllerRegistry.getInstance().register(UserController);
    const document = generator.generate();

    const path = document.paths['/api/users'];
    expect(path.post?.requestBody).toBeDefined();
    expect(path.post?.requestBody?.content).toBeDefined();
  });

  test('should include responses', () => {
    @Controller('/api/users')
    class UserController {
      @GET('/')
      @ApiResponse({ status: 200, description: 'Success' })
      @ApiResponse({ status: 404, description: 'Not found' })
      public getAllUsers() {
        return [];
      }
    }

    ControllerRegistry.getInstance().register(UserController);
    const document = generator.generate();

    const path = document.paths['/api/users'];
    expect(path.get?.responses).toBeDefined();
    expect(path.get?.responses?.['200']).toBeDefined();
    expect(path.get?.responses?.['404']).toBeDefined();
  });

  test('should handle query parameters', () => {
    @Controller('/api/users')
    class UserController {
      @GET('/')
      public getUsers(@Query('page') page?: number) {
        return [];
      }
    }

    ControllerRegistry.getInstance().register(UserController);
    const document = generator.generate();

    const path = document.paths['/api/users'];
    expect(path.get).toBeDefined();
  });

  test('should convert path parameters to OpenAPI format', () => {
    @Controller('/api/users')
    class UserController {
      @GET('/:id/posts/:postId')
      public getUserPost(
        @Param('id') id: string,
        @Param('postId') postId: string,
      ) {
        return { id, postId };
      }
    }

    ControllerRegistry.getInstance().register(UserController);
    const document = generator.generate();

    // 应该转换为 /api/users/{id}/posts/{postId}
    const pathKey = Object.keys(document.paths).find((key) =>
      key.includes('{id}'),
    );
    expect(pathKey).toBeDefined();
    expect(pathKey).toContain('{id}');
    expect(pathKey).toContain('{postId}');
  });

  test('should handle empty controllers', () => {
    @Controller('/api/empty')
    class EmptyController {}

    ControllerRegistry.getInstance().register(EmptyController);
    const document = generator.generate();

    // 没有路由的控制器不应该生成路径
    expect(document.paths['/api/empty']).toBeUndefined();
  });
});

