import 'reflect-metadata';
import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { Application } from '../../src/core/application';
import { Controller, ControllerRegistry } from '../../src/controller/controller';
import { GET, POST } from '../../src/router/decorators';
import { Param } from '../../src/controller/decorators';
import { RouteRegistry } from '../../src/router/registry';
import { getTestPort } from '../utils/test-port';

describe('Controller Path Combination', () => {
  let app: Application;
  let port: number;

  beforeEach(() => {
    port = getTestPort();
    app = new Application({ port });
  });

  afterEach(async () => {
    if (app) {
      await app.stop();
    }
    RouteRegistry.getInstance().clear();
    ControllerRegistry.getInstance().clear();
  });

  test('should correctly combine base path with method path starting with /', async () => {
    @Controller('/api/products')
    class ProductController {
      @GET('/')
      public listProducts() {
        return { products: ['product1', 'product2'] };
      }

      @GET('/:id')
      public getProduct(@Param('id') id: string) {
        return { id, name: `Product ${id}` };
      }
    }

    app.registerController(ProductController);
    await app.listen();

    // 应该访问 /api/products，而不是 /
    const response = await fetch(`http://localhost:${port}/api/products`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.products).toBeDefined();

    // 访问 / 应该返回 404，而不是访问到 listProducts
    const rootResponse = await fetch(`http://localhost:${port}/`);
    expect(rootResponse.status).toBe(404);
  });

  test('should correctly combine base path with empty method path', async () => {
    @Controller('/api/users')
    class UserController {
      @GET('')
      public listUsers() {
        return { users: ['user1', 'user2'] };
      }
    }

    app.registerController(UserController);
    await app.listen();

    const response = await fetch(`http://localhost:${port}/api/users`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.users).toBeDefined();

    // 访问 / 应该返回 404
    const rootResponse = await fetch(`http://localhost:${port}/`);
    expect(rootResponse.status).toBe(404);
  });

  test('should correctly combine base path with method path without leading /', async () => {
    @Controller('/api/orders')
    class OrderController {
      @GET('list')
      public listOrders() {
        return { orders: ['order1', 'order2'] };
      }
    }

    app.registerController(OrderController);
    await app.listen();

    const response = await fetch(`http://localhost:${port}/api/orders/list`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.orders).toBeDefined();

    // 访问 /api/orders 应该返回 404
    const baseResponse = await fetch(`http://localhost:${port}/api/orders`);
    expect(baseResponse.status).toBe(404);
  });

  test('should handle root controller with method path /', async () => {
    @Controller('')
    class RootController {
      @GET('/')
      public root() {
        return { message: 'root' };
      }
    }

    app.registerController(RootController);
    await app.listen();

    const response = await fetch(`http://localhost:${port}/`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe('root');
  });

  test('should handle root controller with empty method path', async () => {
    @Controller('/')
    class RootController {
      @GET('')
      public root() {
        return { message: 'root' };
      }
    }

    app.registerController(RootController);
    await app.listen();

    const response = await fetch(`http://localhost:${port}/`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe('root');
  });

  test('should not allow / to match when controller has base path', async () => {
    @Controller('/api/products')
    class ProductController {
      @GET('/')
      public listProducts() {
        return { products: ['product1'] };
      }
    }

    @Controller('/')
    class RootController {
      @GET('/')
      public root() {
        return { message: 'root' };
      }
    }

    app.registerController(ProductController);
    app.registerController(RootController);
    await app.listen();

    // /api/products 应该访问 ProductController
    const productsResponse = await fetch(`http://localhost:${port}/api/products`);
    expect(productsResponse.status).toBe(200);
    const productsData = await productsResponse.json();
    expect(productsData.products).toBeDefined();

    // / 应该访问 RootController
    const rootResponse = await fetch(`http://localhost:${port}/`);
    expect(rootResponse.status).toBe(200);
    const rootData = await rootResponse.json();
    expect(rootData.message).toBe('root');
  });

  test('should handle multiple controllers with different base paths', async () => {
    @Controller('/api/products')
    class ProductController {
      @GET('/')
      public listProducts() {
        return { source: 'products' };
      }
    }

    @Controller('/api/users')
    class UserController {
      @GET('/')
      public listUsers() {
        return { source: 'users' };
      }
    }

    app.registerController(ProductController);
    app.registerController(UserController);
    await app.listen();

    // 访问 /api/products 应该返回 products
    const productsResponse = await fetch(`http://localhost:${port}/api/products`);
    expect(productsResponse.status).toBe(200);
    const productsData = await productsResponse.json();
    expect(productsData.source).toBe('products');

    // 访问 /api/users 应该返回 users
    const usersResponse = await fetch(`http://localhost:${port}/api/users`);
    expect(usersResponse.status).toBe(200);
    const usersData = await usersResponse.json();
    expect(usersData.source).toBe('users');

    // 访问 / 应该返回 404
    const rootResponse = await fetch(`http://localhost:${port}/`);
    expect(rootResponse.status).toBe(404);
  });
});

