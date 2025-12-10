// @bun
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __legacyDecorateClassTS = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1;i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __legacyDecorateParamTS = (index, decorator) => (target, key) => decorator(target, key, index);
var __legacyMetadataTS = (k, v) => {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);

// src/validation/decorators.ts
import"reflect-metadata";
function getOrCreateMetadata(target, propertyKey) {
  const existing = Reflect.getMetadata(VALIDATION_METADATA_KEY, target, propertyKey);
  if (existing) {
    return existing;
  }
  const metadata = [];
  Reflect.defineMetadata(VALIDATION_METADATA_KEY, metadata, target, propertyKey);
  return metadata;
}
function Validate(...rules) {
  return (target, propertyKey, parameterIndex) => {
    if (!propertyKey) {
      throw new Error("@Validate decorator can only be used on methods");
    }
    if (!rules.length) {
      throw new Error("@Validate requires at least one validation rule");
    }
    const metadata = getOrCreateMetadata(target, propertyKey);
    let entry = metadata.find((item) => item.index === parameterIndex);
    if (!entry) {
      entry = { index: parameterIndex, rules: [] };
      metadata.push(entry);
    }
    entry.rules.push(...rules);
  };
}
function IsString(options = {}) {
  return {
    name: "isString",
    message: options.message ?? "\u5FC5\u987B\u662F\u5B57\u7B26\u4E32",
    validate: (value) => typeof value === "string"
  };
}
function IsNumber(options = {}) {
  return {
    name: "isNumber",
    message: options.message ?? "\u5FC5\u987B\u662F\u6570\u5B57",
    validate: (value) => typeof value === "number" && !Number.isNaN(value)
  };
}
function IsEmail(options = {}) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    name: "isEmail",
    message: options.message ?? "\u5FC5\u987B\u662F\u5408\u6CD5\u7684\u90AE\u7BB1\u5730\u5740",
    validate: (value) => typeof value === "string" && emailRegex.test(value)
  };
}
function IsOptional() {
  return {
    name: "isOptional",
    message: "",
    optional: true,
    validate: () => true
  };
}
function MinLength(min, options = {}) {
  return {
    name: "minLength",
    message: options.message ?? `\u957F\u5EA6\u4E0D\u80FD\u5C0F\u4E8E ${min}`,
    validate: (value) => typeof value === "string" && value.length >= min
  };
}
function getValidationMetadata(target, propertyKey) {
  return Reflect.getMetadata(VALIDATION_METADATA_KEY, target, propertyKey) || [];
}
var VALIDATION_METADATA_KEY;
var init_decorators = __esm(() => {
  VALIDATION_METADATA_KEY = Symbol("validation:param");
});

// src/validation/errors.ts
var ValidationError;
var init_errors = __esm(() => {
  ValidationError = class ValidationError extends Error {
    issues;
    constructor(message, issues) {
      super(message);
      this.name = "ValidationError";
      this.issues = issues;
    }
  };
});

// src/validation/validator.ts
function shouldSkip(rule, value) {
  return rule.optional === true && (value === undefined || value === null);
}
function validateRule(rule, value, index) {
  if (shouldSkip(rule, value)) {
    return null;
  }
  const passed = rule.validate(value);
  if (passed) {
    return null;
  }
  return {
    index,
    rule: rule.name,
    message: rule.message
  };
}
function validateParameters(params, metadata) {
  if (!metadata.length) {
    return;
  }
  const issues = [];
  for (const item of metadata) {
    const value = params[item.index];
    let skipped = false;
    for (const rule of item.rules) {
      if (rule.optional && (value === undefined || value === null)) {
        skipped = true;
        break;
      }
      const issue = validateRule(rule, value, item.index);
      if (issue) {
        issues.push(issue);
      }
    }
    if (skipped) {
      continue;
    }
  }
  if (issues.length > 0) {
    throw new ValidationError("Validation failed", issues);
  }
}
var init_validator = __esm(() => {
  init_errors();
});

// src/validation/index.ts
var init_validation = __esm(() => {
  init_decorators();
  init_validator();
  init_errors();
});

// src/error/error-codes.ts
var ERROR_CODE_TO_STATUS, ERROR_CODE_MESSAGES;
var init_error_codes = __esm(() => {
  ERROR_CODE_TO_STATUS = {
    ["INTERNAL_ERROR" /* INTERNAL_ERROR */]: 500,
    ["INVALID_REQUEST" /* INVALID_REQUEST */]: 400,
    ["RESOURCE_NOT_FOUND" /* RESOURCE_NOT_FOUND */]: 404,
    ["METHOD_NOT_ALLOWED" /* METHOD_NOT_ALLOWED */]: 405,
    ["AUTH_REQUIRED" /* AUTH_REQUIRED */]: 401,
    ["AUTH_INVALID_TOKEN" /* AUTH_INVALID_TOKEN */]: 401,
    ["AUTH_TOKEN_EXPIRED" /* AUTH_TOKEN_EXPIRED */]: 401,
    ["AUTH_INSUFFICIENT_PERMISSIONS" /* AUTH_INSUFFICIENT_PERMISSIONS */]: 403,
    ["VALIDATION_FAILED" /* VALIDATION_FAILED */]: 400,
    ["VALIDATION_REQUIRED_FIELD" /* VALIDATION_REQUIRED_FIELD */]: 400,
    ["VALIDATION_INVALID_FORMAT" /* VALIDATION_INVALID_FORMAT */]: 400,
    ["VALIDATION_OUT_OF_RANGE" /* VALIDATION_OUT_OF_RANGE */]: 400,
    ["OAUTH2_INVALID_CLIENT" /* OAUTH2_INVALID_CLIENT */]: 400,
    ["OAUTH2_INVALID_GRANT" /* OAUTH2_INVALID_GRANT */]: 400,
    ["OAUTH2_INVALID_SCOPE" /* OAUTH2_INVALID_SCOPE */]: 400,
    ["OAUTH2_INVALID_REDIRECT_URI" /* OAUTH2_INVALID_REDIRECT_URI */]: 400,
    ["OAUTH2_UNSUPPORTED_GRANT_TYPE" /* OAUTH2_UNSUPPORTED_GRANT_TYPE */]: 400
  };
  ERROR_CODE_MESSAGES = {
    ["INTERNAL_ERROR" /* INTERNAL_ERROR */]: "Internal Server Error",
    ["INVALID_REQUEST" /* INVALID_REQUEST */]: "Invalid Request",
    ["RESOURCE_NOT_FOUND" /* RESOURCE_NOT_FOUND */]: "Resource Not Found",
    ["METHOD_NOT_ALLOWED" /* METHOD_NOT_ALLOWED */]: "Method Not Allowed",
    ["AUTH_REQUIRED" /* AUTH_REQUIRED */]: "Authentication Required",
    ["AUTH_INVALID_TOKEN" /* AUTH_INVALID_TOKEN */]: "Invalid Authentication Token",
    ["AUTH_TOKEN_EXPIRED" /* AUTH_TOKEN_EXPIRED */]: "Authentication Token Expired",
    ["AUTH_INSUFFICIENT_PERMISSIONS" /* AUTH_INSUFFICIENT_PERMISSIONS */]: "Insufficient Permissions",
    ["VALIDATION_FAILED" /* VALIDATION_FAILED */]: "Validation Failed",
    ["VALIDATION_REQUIRED_FIELD" /* VALIDATION_REQUIRED_FIELD */]: "Required Field Missing",
    ["VALIDATION_INVALID_FORMAT" /* VALIDATION_INVALID_FORMAT */]: "Invalid Format",
    ["VALIDATION_OUT_OF_RANGE" /* VALIDATION_OUT_OF_RANGE */]: "Value Out of Range",
    ["OAUTH2_INVALID_CLIENT" /* OAUTH2_INVALID_CLIENT */]: "Invalid Client",
    ["OAUTH2_INVALID_GRANT" /* OAUTH2_INVALID_GRANT */]: "Invalid Grant",
    ["OAUTH2_INVALID_SCOPE" /* OAUTH2_INVALID_SCOPE */]: "Invalid Scope",
    ["OAUTH2_INVALID_REDIRECT_URI" /* OAUTH2_INVALID_REDIRECT_URI */]: "Invalid Redirect URI",
    ["OAUTH2_UNSUPPORTED_GRANT_TYPE" /* OAUTH2_UNSUPPORTED_GRANT_TYPE */]: "Unsupported Grant Type"
  };
});

// src/error/http-exception.ts
var HttpException, BadRequestException, UnauthorizedException, ForbiddenException, NotFoundException, InternalServerErrorException;
var init_http_exception = __esm(() => {
  init_error_codes();
  HttpException = class HttpException extends Error {
    status;
    code;
    details;
    constructor(status, message, details, code) {
      super(message);
      this.name = this.constructor.name;
      this.status = status;
      this.code = code;
      this.details = details;
    }
    static withCode(code, message, details) {
      const status = ERROR_CODE_TO_STATUS[code] || 500;
      const finalMessage = message || ERROR_CODE_MESSAGES[code] || "Internal Server Error";
      return new HttpException(status, finalMessage, details, code);
    }
  };
  BadRequestException = class BadRequestException extends HttpException {
    constructor(message = "Bad Request", details, code) {
      super(400, message, details, code);
    }
  };
  UnauthorizedException = class UnauthorizedException extends HttpException {
    constructor(message = "Unauthorized", details, code) {
      super(401, message, details, code);
    }
  };
  ForbiddenException = class ForbiddenException extends HttpException {
    constructor(message = "Forbidden", details, code) {
      super(403, message, details, code);
    }
  };
  NotFoundException = class NotFoundException extends HttpException {
    constructor(message = "Not Found", details, code) {
      super(404, message, details, code);
    }
  };
  InternalServerErrorException = class InternalServerErrorException extends HttpException {
    constructor(message = "Internal Server Error", details, code) {
      super(500, message, details, code);
    }
  };
});

// src/error/filter.ts
class ExceptionFilterRegistry {
  static instance;
  filters = [];
  constructor() {}
  static getInstance() {
    if (!ExceptionFilterRegistry.instance) {
      ExceptionFilterRegistry.instance = new ExceptionFilterRegistry;
    }
    return ExceptionFilterRegistry.instance;
  }
  register(filter) {
    this.filters.push(filter);
  }
  clear() {
    this.filters.length = 0;
  }
  async execute(error, context) {
    for (const filter of this.filters) {
      const result = await filter.catch(error, context);
      if (result) {
        return result;
      }
    }
    return;
  }
}

// src/error/i18n.ts
class ErrorMessageI18n {
  static currentLanguage = "en";
  static setLanguage(language) {
    this.currentLanguage = language;
  }
  static getLanguage() {
    return this.currentLanguage;
  }
  static getMessage(code, language) {
    const lang = language || this.currentLanguage;
    const messages = ERROR_MESSAGES_I18N[lang];
    return messages?.[code] || ERROR_CODE_MESSAGES[code] || "Internal Server Error";
  }
  static parseLanguageFromHeader(acceptLanguage) {
    if (!acceptLanguage) {
      return "en";
    }
    if (acceptLanguage.includes("zh-CN") || acceptLanguage.includes("zh")) {
      return "zh-CN";
    }
    return "en";
  }
}
var ERROR_MESSAGES_I18N;
var init_i18n = __esm(() => {
  init_error_codes();
  ERROR_MESSAGES_I18N = {
    en: {
      ...ERROR_CODE_MESSAGES
    },
    "zh-CN": {
      ["INTERNAL_ERROR" /* INTERNAL_ERROR */]: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF",
      ["INVALID_REQUEST" /* INVALID_REQUEST */]: "\u65E0\u6548\u7684\u8BF7\u6C42",
      ["RESOURCE_NOT_FOUND" /* RESOURCE_NOT_FOUND */]: "\u8D44\u6E90\u672A\u627E\u5230",
      ["METHOD_NOT_ALLOWED" /* METHOD_NOT_ALLOWED */]: "\u65B9\u6CD5\u4E0D\u5141\u8BB8",
      ["AUTH_REQUIRED" /* AUTH_REQUIRED */]: "\u9700\u8981\u8BA4\u8BC1",
      ["AUTH_INVALID_TOKEN" /* AUTH_INVALID_TOKEN */]: "\u65E0\u6548\u7684\u8BA4\u8BC1\u4EE4\u724C",
      ["AUTH_TOKEN_EXPIRED" /* AUTH_TOKEN_EXPIRED */]: "\u8BA4\u8BC1\u4EE4\u724C\u5DF2\u8FC7\u671F",
      ["AUTH_INSUFFICIENT_PERMISSIONS" /* AUTH_INSUFFICIENT_PERMISSIONS */]: "\u6743\u9650\u4E0D\u8DB3",
      ["VALIDATION_FAILED" /* VALIDATION_FAILED */]: "\u9A8C\u8BC1\u5931\u8D25",
      ["VALIDATION_REQUIRED_FIELD" /* VALIDATION_REQUIRED_FIELD */]: "\u5FC5\u586B\u5B57\u6BB5\u7F3A\u5931",
      ["VALIDATION_INVALID_FORMAT" /* VALIDATION_INVALID_FORMAT */]: "\u683C\u5F0F\u65E0\u6548",
      ["VALIDATION_OUT_OF_RANGE" /* VALIDATION_OUT_OF_RANGE */]: "\u503C\u8D85\u51FA\u8303\u56F4",
      ["OAUTH2_INVALID_CLIENT" /* OAUTH2_INVALID_CLIENT */]: "\u65E0\u6548\u7684\u5BA2\u6237\u7AEF",
      ["OAUTH2_INVALID_GRANT" /* OAUTH2_INVALID_GRANT */]: "\u65E0\u6548\u7684\u6388\u6743",
      ["OAUTH2_INVALID_SCOPE" /* OAUTH2_INVALID_SCOPE */]: "\u65E0\u6548\u7684\u4F5C\u7528\u57DF",
      ["OAUTH2_INVALID_REDIRECT_URI" /* OAUTH2_INVALID_REDIRECT_URI */]: "\u65E0\u6548\u7684\u91CD\u5B9A\u5411 URI",
      ["OAUTH2_UNSUPPORTED_GRANT_TYPE" /* OAUTH2_UNSUPPORTED_GRANT_TYPE */]: "\u4E0D\u652F\u6301\u7684\u6388\u6743\u7C7B\u578B"
    }
  };
});

// src/error/handler.ts
var exports_handler = {};
__export(exports_handler, {
  handleError: () => handleError
});
async function handleError(error, context) {
  const registry = ExceptionFilterRegistry.getInstance();
  const filterResponse = await registry.execute(error, context);
  if (filterResponse) {
    return filterResponse;
  }
  if (error instanceof HttpException) {
    context.setStatus(error.status);
    let errorMessage = error.message;
    if (error.code) {
      const acceptLanguage = context.getHeader("accept-language");
      const language = ErrorMessageI18n.parseLanguageFromHeader(acceptLanguage);
      errorMessage = ErrorMessageI18n.getMessage(error.code, language);
    }
    const responseBody = {
      error: errorMessage
    };
    if (error.code) {
      responseBody.code = error.code;
    }
    if (error.details !== undefined) {
      responseBody.details = error.details;
    }
    return context.createResponse(responseBody);
  }
  if (error instanceof ValidationError) {
    context.setStatus(400);
    return context.createResponse({
      error: error.message,
      code: "VALIDATION_FAILED",
      issues: error.issues
    });
  }
  const message = error instanceof Error ? error.message : String(error);
  context.setStatus(500);
  return context.createResponse({
    error: "Internal Server Error",
    details: message
  });
}
var init_handler = __esm(() => {
  init_http_exception();
  init_validation();
  init_i18n();
});

// src/request/body-parser.ts
class BodyParser {
  static async parse(request) {
    const contentType = request.headers.get("content-type") ?? "";
    if (request.method === "GET" || request.method === "HEAD") {
      return;
    }
    const contentLength = request.headers.get("content-length");
    if (contentLength === "0") {
      return;
    }
    try {
      if (contentType.includes("application/json")) {
        const result = await this.parseJSON(request);
        return result;
      }
      if (contentType.includes("multipart/form-data")) {
        return await this.parseFormData(request);
      }
      if (contentType.includes("application/x-www-form-urlencoded")) {
        const result = await this.parseURLEncoded(request);
        return result;
      }
      if (contentType.includes("text/")) {
        return await this.parseText(request);
      }
      if (!contentType && !contentLength) {
        try {
          const text = await request.text();
          if (!text || text.length === 0) {
            return;
          }
          try {
            return JSON.parse(text);
          } catch {
            return text;
          }
        } catch {
          return;
        }
      }
      const fallbackText = await request.text();
      if (!fallbackText) {
        return;
      }
      try {
        return JSON.parse(fallbackText);
      } catch {
        return fallbackText;
      }
    } catch (error) {
      return;
    }
  }
  static async parseJSON(request) {
    const text = await request.text();
    if (!text) {
      return;
    }
    return JSON.parse(text);
  }
  static async parseFormData(request) {
    return await request.formData();
  }
  static async parseURLEncoded(request) {
    const text = await request.text();
    if (!text || text.length === 0) {
      return;
    }
    const params = new URLSearchParams(text);
    const result = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  static async parseText(request) {
    return await request.text();
  }
}

// src/core/context.ts
class Context {
  request;
  response;
  url;
  method;
  path;
  query;
  params = {};
  headers;
  responseHeaders;
  statusCode = 200;
  files = [];
  _body;
  _bodyParsed = false;
  constructor(request) {
    this.request = request;
    this.url = new URL(request.url);
    this.method = request.method;
    this.path = this.url.pathname;
    this.query = this.url.searchParams;
    this.headers = request.headers;
    this.responseHeaders = new Headers;
  }
  async getBody() {
    if (!this._bodyParsed) {
      this._body = await BodyParser.parse(this.request);
      this._bodyParsed = true;
    }
    return this._body;
  }
  get body() {
    return this._body;
  }
  set body(body) {
    this._body = body;
    this._bodyParsed = true;
  }
  getQuery(key) {
    return this.query.get(key);
  }
  getQueryAll() {
    const result = {};
    this.query.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  getParam(key) {
    return this.params[key];
  }
  getHeader(key) {
    return this.headers.get(key);
  }
  getClientIp() {
    const forwardedFor = this.getHeader("X-Forwarded-For");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }
    const realIp = this.getHeader("X-Real-IP");
    if (realIp) {
      return realIp.trim();
    }
    return "unknown";
  }
  setHeader(key, value) {
    this.responseHeaders.set(key, value);
  }
  setStatus(code) {
    this.statusCode = code;
  }
  createResponse(body, init) {
    if (body instanceof Response) {
      return body;
    }
    const headers = new Headers(this.responseHeaders);
    if (body !== undefined && body !== null) {
      if (typeof body === "object" && !(body instanceof ArrayBuffer) && !(body instanceof Blob)) {
        headers.set("Content-Type", "application/json");
        const jsonString = JSON.stringify(body);
        return new Response(jsonString, {
          status: this.statusCode,
          headers,
          ...init
        });
      }
    }
    return new Response(body, {
      status: this.statusCode,
      headers,
      ...init
    });
  }
}

// src/core/server.ts
import { LoggerManager } from "@dangao/logsmith";

class BunServer {
  server;
  options;
  constructor(options) {
    this.options = options;
  }
  start() {
    if (this.server) {
      throw new Error("Server is already running");
    }
    const logger = LoggerManager.getLogger();
    this.server = Bun.serve({
      port: this.options.port ?? 3000,
      hostname: this.options.hostname,
      fetch: (request, server) => {
        const upgradeHeader = request.headers.get("upgrade");
        if (this.options.websocketRegistry && upgradeHeader && upgradeHeader.toLowerCase() === "websocket") {
          const url = new URL(request.url);
          if (!this.options.websocketRegistry.hasGateway(url.pathname)) {
            return new Response("WebSocket gateway not found", { status: 404 });
          }
          const upgraded = server.upgrade(request, {
            data: { path: url.pathname }
          });
          if (upgraded) {
            return;
          }
          return new Response("WebSocket upgrade failed", { status: 400 });
        }
        const context = new Context(request);
        return this.options.fetch(context);
      },
      websocket: {
        open: (ws) => {
          this.options.websocketRegistry?.handleOpen(ws);
        },
        message: (ws, message) => {
          this.options.websocketRegistry?.handleMessage(ws, message);
        },
        close: (ws, code, reason) => {
          this.options.websocketRegistry?.handleClose(ws, code, reason);
        }
      }
    });
    const hostname = this.options.hostname ?? "localhost";
    const port = this.options.port ?? 3000;
    logger.info(`Server started at http://${hostname}:${port}`);
  }
  stop() {
    if (this.server) {
      const logger = LoggerManager.getLogger();
      this.server.stop();
      this.server = undefined;
      logger.info("Server stopped");
    }
  }
  getServer() {
    return this.server;
  }
  isRunning() {
    return this.server !== undefined;
  }
}

// src/middleware/pipeline.ts
class MiddlewarePipeline {
  middlewares = [];
  constructor(initialMiddlewares = []) {
    this.middlewares.push(...initialMiddlewares);
  }
  use(middleware) {
    this.middlewares.push(middleware);
  }
  clear() {
    this.middlewares.length = 0;
  }
  hasMiddlewares() {
    return this.middlewares.length > 0;
  }
  async run(context, finalHandler) {
    const length = this.middlewares.length;
    if (length === 0) {
      return await finalHandler();
    }
    const called = new Array(length).fill(false);
    const chain = new Array(length + 1);
    chain[length] = finalHandler;
    for (let i = length - 1;i >= 0; i--) {
      const middleware = this.middlewares[i];
      const downstream = chain[i + 1];
      chain[i] = async () => {
        if (called[i]) {
          throw new Error("next() called multiple times");
        }
        called[i] = true;
        return await middleware(context, downstream);
      };
    }
    return await chain[0]();
  }
}

// src/router/route.ts
class Route {
  method;
  path;
  handler;
  controllerClass;
  methodName;
  pattern;
  paramNames;
  middlewarePipeline;
  staticKey;
  isStatic;
  constructor(method, path, handler, middlewares = [], controllerClass, methodName) {
    this.method = method;
    this.path = path;
    this.handler = handler;
    this.controllerClass = controllerClass;
    this.methodName = methodName;
    const { pattern, paramNames } = this.parsePath(path);
    this.pattern = pattern;
    this.paramNames = paramNames;
    this.middlewarePipeline = middlewares.length > 0 ? new MiddlewarePipeline(middlewares) : null;
    this.isStatic = !path.includes(":") && !path.includes("*");
    if (this.isStatic) {
      this.staticKey = `${method}:${path}`;
    }
  }
  parsePath(path) {
    const paramNames = [];
    const patternString = path.replace(/:([^/]+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return "([^/]+)";
    }).replace(/\*/g, ".*");
    const pattern = new RegExp(`^${patternString}$`);
    return { pattern, paramNames };
  }
  match(method, path) {
    if (this.method !== method) {
      return { matched: false, params: {} };
    }
    const match = path.match(this.pattern);
    if (!match) {
      return { matched: false, params: {} };
    }
    const params = {};
    for (let i = 0;i < this.paramNames.length; i++) {
      params[this.paramNames[i]] = match[i + 1] ?? "";
    }
    return { matched: true, params };
  }
  async execute(context) {
    if (!this.middlewarePipeline || !this.middlewarePipeline.hasMiddlewares()) {
      return await this.handler(context);
    }
    return await this.middlewarePipeline.run(context, async () => this.handler(context));
  }
  getStaticKey() {
    return this.staticKey;
  }
}

// src/router/router.ts
class Router {
  routes = [];
  staticRoutes = new Map;
  dynamicRoutes = [];
  normalizePath(path) {
    if (path.length > 1 && path.endsWith("/")) {
      return path.slice(0, -1);
    }
    return path;
  }
  register(method, path, handler, middlewares = [], controllerClass, methodName) {
    const normalizedPath = this.normalizePath(path);
    const route = new Route(method, normalizedPath, handler, middlewares, controllerClass, methodName);
    this.routes.push(route);
    const staticKey = route.getStaticKey();
    if (staticKey) {
      this.staticRoutes.set(staticKey, route);
    } else {
      this.dynamicRoutes.push(route);
    }
  }
  get(path, handler, middlewares = []) {
    this.register("GET", path, handler, middlewares);
  }
  post(path, handler, middlewares = []) {
    this.register("POST", path, handler, middlewares);
  }
  put(path, handler, middlewares = []) {
    this.register("PUT", path, handler, middlewares);
  }
  delete(path, handler, middlewares = []) {
    this.register("DELETE", path, handler, middlewares);
  }
  patch(path, handler, middlewares = []) {
    this.register("PATCH", path, handler, middlewares);
  }
  findRoute(method, path) {
    const staticRoute = this.staticRoutes.get(`${method}:${path}`);
    if (staticRoute) {
      return staticRoute;
    }
    for (const route of this.dynamicRoutes) {
      const match = route.match(method, path);
      if (match.matched) {
        return route;
      }
    }
    return;
  }
  async preHandle(context) {
    const method = context.method;
    const path = this.normalizePath(context.path);
    const route = this.findRoute(method, path);
    if (!route) {
      return;
    }
    const match = route.match(method, path);
    if (match.matched) {
      context.params = match.params;
    }
    if (route.controllerClass && route.methodName) {
      context.routeHandler = {
        controller: route.controllerClass,
        method: route.methodName
      };
    }
  }
  async handle(context) {
    await this.preHandle(context);
    const method = context.method;
    const path = this.normalizePath(context.path);
    const route = this.findRoute(method, path);
    if (!route) {
      return;
    }
    return await route.execute(context);
  }
  getRoutes() {
    return this.routes;
  }
  clear() {
    this.routes.length = 0;
    this.dynamicRoutes.length = 0;
    this.staticRoutes.clear();
  }
}

// src/router/registry.ts
class RouteRegistry {
  static instance;
  router;
  constructor() {
    this.router = new Router;
  }
  static getInstance() {
    if (!RouteRegistry.instance) {
      RouteRegistry.instance = new RouteRegistry;
    }
    return RouteRegistry.instance;
  }
  register(method, path, handler, middlewares = [], controllerClass, methodName) {
    this.router.register(method, path, handler, middlewares, controllerClass, methodName);
  }
  get(path, handler, middlewares = []) {
    this.router.get(path, handler, middlewares);
  }
  post(path, handler, middlewares = []) {
    this.router.post(path, handler, middlewares);
  }
  put(path, handler, middlewares = []) {
    this.router.put(path, handler, middlewares);
  }
  delete(path, handler, middlewares = []) {
    this.router.delete(path, handler, middlewares);
  }
  patch(path, handler, middlewares = []) {
    this.router.patch(path, handler, middlewares);
  }
  getRouter() {
    return this.router;
  }
  clear() {
    this.router.clear();
  }
}

// src/controller/controller.ts
import"reflect-metadata";

// src/di/container.ts
import"reflect-metadata";

// src/di/types.ts
var Lifecycle;
((Lifecycle2) => {
  Lifecycle2["Singleton"] = "singleton";
  Lifecycle2["Transient"] = "transient";
  Lifecycle2["Scoped"] = "scoped";
})(Lifecycle ||= {});

// src/di/decorators.ts
import"reflect-metadata";
import { LoggerManager as LoggerManager2 } from "@dangao/logsmith";
var DEPENDENCY_METADATA_KEY = Symbol("dependency:metadata");
var INJECTABLE_METADATA_KEY = Symbol("injectable");
var typeReferenceMap = new WeakMap;
function Injectable(config) {
  return function(target) {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
    if (config?.lifecycle) {
      Reflect.defineMetadata("lifecycle", config.lifecycle, target);
    }
  };
}
function Inject(token) {
  return function(target, _propertyKey, parameterIndex) {
    const logger = LoggerManager2.getLogger();
    const constructor = typeof target === "function" ? target : target?.constructor;
    if (!constructor) {
      return;
    }
    const paramTypes = Reflect.getMetadata("design:paramtypes", constructor);
    const paramType = paramTypes?.[parameterIndex];
    let metadata = Reflect.getMetadata(DEPENDENCY_METADATA_KEY, constructor) || [];
    const paramCount = paramTypes?.length || 0;
    while (metadata.length < paramCount) {
      metadata.push(undefined);
    }
    let dependencyType;
    let dependencyToken;
    if (token) {
      if (typeof token === "string" || typeof token === "symbol") {
        dependencyToken = token;
        dependencyType = paramType || Object;
      } else {
        dependencyType = token;
      }
    } else {
      if (!paramType) {
        throw new Error(`Cannot determine dependency type for parameter ${parameterIndex} of ${constructor.name}. ` + "Please provide explicit type using @Inject(Type) or ensure emitDecoratorMetadata is enabled.");
      }
      dependencyType = paramType;
    }
    if (!typeReferenceMap.has(constructor)) {
      typeReferenceMap.set(constructor, new Map);
    }
    const typeRefs = typeReferenceMap.get(constructor);
    typeRefs.set(String(parameterIndex), dependencyType);
    metadata[parameterIndex] = {
      index: parameterIndex,
      type: dependencyType,
      token: dependencyToken
    };
    if (constructor.name === "Service" || constructor.name === "Level2") {
      logger.debug(`[DI Debug] @Inject(${token ? typeof token === "function" ? token.name : String(token) : "auto"}) on ${constructor.name}[${parameterIndex}]: saving metadata.length=${metadata.length}`);
    }
    Reflect.defineMetadata(DEPENDENCY_METADATA_KEY, metadata, constructor);
    if (constructor.name === "Service" || constructor.name === "Level2") {
      const savedMetadata = Reflect.getMetadata(DEPENDENCY_METADATA_KEY, constructor);
      logger.debug(`[DI Debug] @Inject on ${constructor.name}: saved metadata.exists=${savedMetadata ? "yes" : "no"}, length=${savedMetadata?.length || 0}`);
    }
  };
}
function getDependencyMetadata(target) {
  const constructor = typeof target === "function" ? target : target?.constructor;
  if (!constructor) {
    return [];
  }
  const rawMetadata = Reflect.getMetadata(DEPENDENCY_METADATA_KEY, constructor);
  const metadata = rawMetadata || [];
  if (constructor.name === "Service" || constructor.name === "Level2") {
    LoggerManager2.getLogger().debug(`[DI Debug] getDependencyMetadata(${constructor.name}): rawMetadata=${rawMetadata ? "exists" : "undefined"}, length=${metadata.length}`);
  }
  const typeRefs = typeReferenceMap.get(constructor);
  if (typeRefs) {
    for (let i = 0;i < metadata.length; i++) {
      const meta = metadata[i];
      if (meta !== undefined && meta !== null) {
        const typeRef = typeRefs.get(String(meta.index));
        if (typeRef && typeof typeRef === "function") {
          meta.type = typeRef;
        }
      }
    }
  }
  return metadata;
}
function getLifecycle(target) {
  return Reflect.getMetadata("lifecycle", target);
}
function getTypeReference(constructor, parameterIndex) {
  const typeRefs = typeReferenceMap.get(constructor);
  if (typeRefs) {
    return typeRefs.get(String(parameterIndex));
  }
  return;
}

// src/di/container.ts
import { LoggerManager as LoggerManager3 } from "@dangao/logsmith";

class Container {
  parent;
  constructor(options = {}) {
    this.parent = options.parent;
  }
  providers = new Map;
  singletons = new Map;
  typeToToken = new Map;
  dependencyPlans = new Map;
  register(token, config) {
    const tokenKey = this.getTokenKey(token);
    let lifecycle = config?.lifecycle;
    if (!lifecycle && typeof token === "function") {
      lifecycle = getLifecycle(token);
    }
    const providerConfig = {
      lifecycle: lifecycle || "singleton" /* Singleton */,
      ...config
    };
    if (typeof token === "function" && !providerConfig.factory && !providerConfig.implementation) {
      providerConfig.implementation = token;
    }
    this.providers.set(tokenKey, providerConfig);
    if (typeof token === "function") {
      this.typeToToken.set(token, tokenKey);
    }
  }
  registerInstance(token, instance) {
    const tokenKey = this.getTokenKey(token);
    this.singletons.set(tokenKey, instance);
    this.providers.set(tokenKey, {
      lifecycle: "singleton" /* Singleton */
    });
  }
  resolve(token) {
    const tokenKey = this.getTokenKey(token);
    const provider = this.providers.get(tokenKey);
    if (!provider) {
      if (this.parent) {
        return this.parent.resolve(token);
      }
      if (typeof token === "function") {
        const paramTypes = Reflect.getMetadata("design:paramtypes", token);
        if (paramTypes && paramTypes.length > 0) {
          throw new Error(`Provider not found for token: ${String(tokenKey)}`);
        }
        return new token;
      }
      throw new Error(`Provider not found for token: ${String(tokenKey)}`);
    }
    if (provider.lifecycle === "singleton" /* Singleton */) {
      const singleton = this.singletons.get(tokenKey);
      if (singleton) {
        return singleton;
      }
    }
    let instance;
    if (provider.factory) {
      instance = provider.factory();
    } else if (typeof token === "function") {
      instance = this.instantiate(token);
    } else if (provider.implementation && typeof provider.implementation === "function") {
      instance = this.instantiate(provider.implementation);
    } else {
      throw new Error(`Cannot instantiate token: ${String(tokenKey)}. Factory function required.`);
    }
    if (provider.lifecycle === "singleton" /* Singleton */) {
      this.singletons.set(tokenKey, instance);
    }
    return instance;
  }
  resolveInternal(token) {
    const tokenType = typeof token;
    const tokenString = String(token);
    const logger = LoggerManager3.getLogger();
    if (tokenString.includes("Level2") || tokenString.includes("Dependency") || tokenString.includes("Service")) {
      logger.debug(`[DI Debug] resolveInternal: token=${tokenString}, tokenType=${tokenType}`);
    }
    if (typeof token === "string" || typeof token === "symbol") {
      const provider = this.providers.get(token);
      if (!provider) {
        if (this.parent) {
          return this.parent.resolveInternal(token);
        }
        throw new Error(`Provider not found for token: ${String(token)}`);
      }
      if (provider.lifecycle === "singleton" /* Singleton */) {
        const singleton = this.singletons.get(token);
        if (singleton) {
          return singleton;
        }
      }
      if (provider.factory) {
        const instance = provider.factory();
        if (provider.lifecycle === "singleton" /* Singleton */) {
          this.singletons.set(token, instance);
        }
        return instance;
      }
      if (provider.implementation && typeof provider.implementation === "function") {
        const instance = this.instantiate(provider.implementation);
        if (provider.lifecycle === "singleton" /* Singleton */) {
          this.singletons.set(token, instance);
        }
        return instance;
      }
      throw new Error(`Cannot instantiate token: ${String(token)}. Factory function required.`);
    }
    if (typeof token === "function") {
      return this.resolve(token);
    }
    throw new Error(`Invalid token type: ${tokenType}. Token: ${String(token)}`);
  }
  instantiate(constructor) {
    const plan = this.getDependencyPlan(constructor);
    if (plan.paramLength === 0) {
      return new constructor;
    }
    const dependencies = new Array(plan.paramLength);
    for (let index = 0;index < plan.paramLength; index++) {
      dependencies[index] = this.resolveFromPlan(constructor, plan, index);
    }
    return new constructor(...dependencies);
  }
  getTokenKey(token) {
    if (typeof token === "function") {
      return token.name || Symbol(token.toString());
    }
    return token;
  }
  clear() {
    this.providers.clear();
    this.singletons.clear();
    this.typeToToken.clear();
    this.dependencyPlans.clear();
  }
  isRegistered(token) {
    const tokenKey = this.getTokenKey(token);
    return this.providers.has(tokenKey);
  }
  getDependencyPlan(constructor) {
    let plan = this.dependencyPlans.get(constructor);
    if (plan) {
      return plan;
    }
    const paramTypes = Reflect.getMetadata("design:paramtypes", constructor) ?? [];
    const dependencyMetadata = getDependencyMetadata(constructor);
    const metadataMap = new Map;
    let paramLength = paramTypes.length;
    for (const meta of dependencyMetadata) {
      if (meta && typeof meta.index === "number") {
        metadataMap.set(meta.index, meta);
        if (meta.index + 1 > paramLength) {
          paramLength = meta.index + 1;
        }
      }
    }
    const resolvedTypes = new Map;
    for (let i = 0;i < paramLength; i++) {
      const typeRef = getTypeReference(constructor, i);
      if (typeRef && typeof typeRef === "function") {
        resolvedTypes.set(i, typeRef);
      }
    }
    for (const [index, meta] of metadataMap.entries()) {
      const depType = meta?.type;
      if (typeof depType === "function") {
        resolvedTypes.set(index, depType);
      } else if (typeof depType === "string") {
        const globalType = globalThis[depType];
        if (typeof globalType === "function") {
          resolvedTypes.set(index, globalType);
        }
      }
    }
    plan = {
      paramTypes,
      metadataMap,
      resolvedTypes,
      paramLength
    };
    this.dependencyPlans.set(constructor, plan);
    return plan;
  }
  resolveFromPlan(constructor, plan, index) {
    const meta = plan.metadataMap.get(index);
    if (meta?.token) {
      return this.resolveInternal(meta.token);
    }
    const resolvedType = plan.resolvedTypes.get(index);
    if (resolvedType) {
      return this.resolveInternal(resolvedType);
    }
    const paramType = plan.paramTypes[index];
    if (paramType) {
      const token = this.typeToToken.get(paramType);
      if (token) {
        return this.resolveInternal(token);
      }
      return this.resolveInternal(paramType);
    }
    throw new Error(`Cannot resolve dependency at index ${index} of ${constructor.name}. ` + "Parameter type is undefined. Use @Inject() decorator to specify the dependency type.");
  }
}

// src/controller/decorators.ts
import"reflect-metadata";
var PARAM_METADATA_KEY = Symbol("param");
function createParamDecorator(type, key) {
  return function(target, propertyKey, parameterIndex) {
    const existingParams = Reflect.getMetadata(PARAM_METADATA_KEY, target, propertyKey) || [];
    existingParams.push({ type, key, index: parameterIndex });
    Reflect.defineMetadata(PARAM_METADATA_KEY, existingParams, target, propertyKey);
  };
}
function Body(key) {
  return createParamDecorator("body" /* BODY */, key);
}
function Query(key) {
  return createParamDecorator("query" /* QUERY */, key);
}
function Param(key) {
  return createParamDecorator("param" /* PARAM */, key);
}
function Header(key) {
  return createParamDecorator("header" /* HEADER */, key);
}
function getParamMetadata(target, propertyKey) {
  return Reflect.getMetadata(PARAM_METADATA_KEY, target, propertyKey) || [];
}

// src/controller/param-binder.ts
class ParamBinder {
  static async bind(target, propertyKey, context) {
    const metadata = getParamMetadata(target, propertyKey);
    const params = [];
    metadata.sort((a, b) => a.index - b.index);
    for (const meta of metadata) {
      const value = await this.getValue(meta, context);
      params[meta.index] = value;
    }
    const maxIndex = metadata.length > 0 ? Math.max(...metadata.map((m) => m.index)) : -1;
    for (let i = 0;i <= maxIndex; i++) {
      if (!(i in params)) {
        params[i] = undefined;
      }
    }
    return params;
  }
  static async getValue(meta, context) {
    switch (meta.type) {
      case "body" /* BODY */:
        return await this.getBodyValue(meta.key, context);
      case "query" /* QUERY */:
        if (!meta.key) {
          throw new Error("@Query() decorator requires a key parameter");
        }
        return this.getQueryValue(meta.key, context);
      case "param" /* PARAM */:
        if (!meta.key) {
          throw new Error("@Param() decorator requires a key parameter");
        }
        return this.getParamValue(meta.key, context);
      case "header" /* HEADER */:
        if (!meta.key) {
          throw new Error("@Header() decorator requires a key parameter");
        }
        return this.getHeaderValue(meta.key, context);
      default:
        return;
    }
  }
  static async getBodyValue(key, context) {
    const body = await context.getBody();
    if (!key) {
      return body;
    }
    if (typeof body === "object" && body !== null) {
      return body[key];
    }
    return;
  }
  static getQueryValue(key, context) {
    return context.getQuery(key);
  }
  static getParamValue(key, context) {
    return context.getParam(key);
  }
  static getHeaderValue(key, context) {
    return context.getHeader(key);
  }
}

// src/controller/metadata.ts
import"reflect-metadata";

// src/router/decorators.ts
import"reflect-metadata";
var ROUTE_METADATA_KEY = Symbol("route");
function createRouteDecorator(method, path) {
  return function(target, propertyKey, descriptor) {
    const controllerMetadata = Reflect.getMetadata(CONTROLLER_METADATA_KEY, target.constructor);
    if (controllerMetadata) {
      const existingRoutes = Reflect.getMetadata(ROUTE_METADATA_KEY, target) || [];
      let propertyKeyStr;
      if (propertyKey && propertyKey !== "") {
        propertyKeyStr = typeof propertyKey === "string" ? propertyKey : String(propertyKey);
      } else {
        propertyKeyStr = descriptor.value.name || "";
      }
      if (!propertyKeyStr) {
        const propertyNames = Object.getOwnPropertyNames(target);
        for (const key of propertyNames) {
          const targetDescriptor = Object.getOwnPropertyDescriptor(target, key);
          if (targetDescriptor?.value === descriptor.value) {
            propertyKeyStr = key;
            break;
          }
        }
      }
      existingRoutes.push({
        method,
        path,
        handler: descriptor.value,
        propertyKey: propertyKeyStr || undefined
      });
      Reflect.defineMetadata(ROUTE_METADATA_KEY, existingRoutes, target);
    } else {
      const handler = descriptor.value;
      const registry = RouteRegistry.getInstance();
      registry.register(method, path, handler);
      const existingRoutes = Reflect.getMetadata(ROUTE_METADATA_KEY, target) || [];
      existingRoutes.push({ method, path, handler });
      Reflect.defineMetadata(ROUTE_METADATA_KEY, existingRoutes, target);
    }
  };
}
function GET(path) {
  return createRouteDecorator("GET", path);
}
function POST(path) {
  return createRouteDecorator("POST", path);
}
function PUT(path) {
  return createRouteDecorator("PUT", path);
}
function DELETE(path) {
  return createRouteDecorator("DELETE", path);
}
function PATCH(path) {
  return createRouteDecorator("PATCH", path);
}

// src/controller/metadata.ts
function getControllerMetadata(target) {
  return Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
}
function getRouteMetadata(target) {
  return Reflect.getMetadata(ROUTE_METADATA_KEY, target) || [];
}
// src/middleware/decorators.ts
import"reflect-metadata";

// src/middleware/builtin/rate-limit.ts
class MemoryRateLimitStore {
  store = new Map;
  async get(key) {
    const entry = this.store.get(key);
    if (!entry) {
      return 0;
    }
    if (Date.now() > entry.resetTime) {
      this.store.delete(key);
      return 0;
    }
    return entry.count;
  }
  async increment(key, windowMs) {
    const now = Date.now();
    const entry = this.store.get(key);
    if (!entry || now > entry.resetTime) {
      const resetTime = now + windowMs;
      this.store.set(key, { count: 1, resetTime });
      return 1;
    }
    entry.count++;
    return entry.count;
  }
  async reset(key) {
    this.store.delete(key);
  }
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
}
function defaultKeyGenerator(context) {
  return `rate-limit:${context.getClientIp()}`;
}
function createRateLimitMiddleware(options) {
  const {
    max,
    windowMs = 60000,
    store = new MemoryRateLimitStore,
    keyGenerator = defaultKeyGenerator,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    message = "Too Many Requests",
    statusCode = 429,
    standardHeaders = true,
    legacyHeaders = true
  } = options;
  return async (context, next) => {
    const key = await keyGenerator(context);
    const currentCount = await store.increment(key, windowMs);
    const remaining = Math.max(0, max - currentCount);
    const resetTime = Date.now() + windowMs;
    if (standardHeaders) {
      context.setHeader("RateLimit-Limit", max.toString());
      context.setHeader("RateLimit-Remaining", remaining.toString());
      context.setHeader("RateLimit-Reset", Math.ceil(resetTime / 1000).toString());
    }
    if (legacyHeaders) {
      context.setHeader("X-RateLimit-Limit", max.toString());
      context.setHeader("X-RateLimit-Remaining", remaining.toString());
      context.setHeader("X-RateLimit-Reset", Math.ceil(resetTime / 1000).toString());
    }
    if (currentCount > max) {
      context.setStatus(statusCode);
      return context.createResponse({
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    const response = await next();
    const shouldSkip = skipSuccessfulRequests && response.status >= 200 && response.status < 300 || skipFailedRequests && response.status >= 400;
    if (shouldSkip) {
      const current = await store.get(key);
      if (current > 0) {}
    }
    return response;
  };
}
function createTokenKeyGenerator(tokenHeader = "Authorization") {
  return (context) => {
    const token = context.getHeader(tokenHeader);
    if (token) {
      const tokenValue = token.startsWith("Bearer ") ? token.substring(7) : token;
      return `rate-limit:token:${tokenValue}`;
    }
    return defaultKeyGenerator(context);
  };
}
function createUserKeyGenerator(getUserId) {
  return (context) => {
    const userId = getUserId(context);
    if (userId) {
      return `rate-limit:user:${userId}`;
    }
    return defaultKeyGenerator(context);
  };
}

// src/middleware/decorators.ts
var CLASS_MIDDLEWARE_METADATA_KEY = Symbol("middleware:class");
var METHOD_MIDDLEWARE_METADATA_KEY = Symbol("middleware:method");
function appendMiddlewareMetadata(target, propertyKey, middlewares) {
  if (!middlewares.length) {
    return;
  }
  if (propertyKey === undefined) {
    const existing2 = Reflect.getMetadata(CLASS_MIDDLEWARE_METADATA_KEY, target) || [];
    Reflect.defineMetadata(CLASS_MIDDLEWARE_METADATA_KEY, existing2.concat(middlewares), target);
    return;
  }
  const existing = Reflect.getMetadata(METHOD_MIDDLEWARE_METADATA_KEY, target, propertyKey) || [];
  Reflect.defineMetadata(METHOD_MIDDLEWARE_METADATA_KEY, existing.concat(middlewares), target, propertyKey);
}
function UseMiddleware(...middlewares) {
  return function(target, propertyKey) {
    appendMiddlewareMetadata(propertyKey === undefined ? target : target, propertyKey, middlewares);
  };
}
function RateLimit(options) {
  return function(target, propertyKey) {
    const middleware = createRateLimitMiddleware(options);
    appendMiddlewareMetadata(target, propertyKey, [middleware]);
  };
}
function getClassMiddlewares(constructor) {
  return Reflect.getMetadata(CLASS_MIDDLEWARE_METADATA_KEY, constructor) || [];
}
function getMethodMiddlewares(target, propertyKey) {
  return Reflect.getMetadata(METHOD_MIDDLEWARE_METADATA_KEY, target, propertyKey) || [];
}
// src/middleware/builtin/logger.ts
import { LoggerManager as LoggerManager4 } from "@dangao/logsmith";
function createLoggerMiddleware(options = {}) {
  const log = options.logger ?? ((message, details) => {
    const logger = LoggerManager4.getLogger();
    if (details) {
      logger.info(message, details);
    } else {
      logger.info(message);
    }
  });
  const prefix = options.prefix ?? "[Logger]";
  return async (context, next) => {
    let response;
    try {
      response = await next();
      return response;
    } finally {
      const status = response?.status ?? context.statusCode ?? 200;
      log(`${prefix} ${context.method} ${context.path} ${status}`);
    }
  };
}
function createRequestLoggingMiddleware(options = {}) {
  const log = options.logger ?? ((message, details) => {
    const logger = LoggerManager4.getLogger();
    logger.info(message, details);
  });
  const prefix = options.prefix ?? "[Request]";
  const setHeader = options.setHeader ?? true;
  return async (context, next) => {
    const start = performance.now();
    try {
      const response = await next();
      const duration = performance.now() - start;
      log(`${prefix} ${context.method} ${context.path} ${response.status} ${duration.toFixed(2)}ms`);
      if (setHeader) {
        context.setHeader("x-request-duration", duration.toFixed(2));
      }
      return response;
    } catch (error) {
      const duration = performance.now() - start;
      log(`${prefix} ${context.method} ${context.path} error ${duration.toFixed(2)}ms`, error instanceof Error ? { error: error.message } : undefined);
      throw error;
    }
  };
}
// src/middleware/builtin/error-handler.ts
init_validation();
import { LoggerManager as LoggerManager5 } from "@dangao/logsmith";

// src/error/index.ts
init_http_exception();
init_handler();
init_error_codes();
init_i18n();

// src/middleware/builtin/error-handler.ts
init_handler();
function createErrorHandlingMiddleware(options = {}) {
  const log = options.logger ?? ((error, context) => {
    LoggerManager5.getLogger().error("[Error]", { ...context, error });
  });
  const expose = options.exposeError ?? false;
  const defaultStatus = options.statusCode ?? 500;
  return async (context, next) => {
    const logger = LoggerManager5.getLogger();
    try {
      return await next();
    } catch (error) {
      log(error, { method: context.method, path: context.path });
      logger.error("Unhandled error", {
        method: context.method,
        path: context.path,
        error
      });
      if (error instanceof Response) {
        return error;
      }
      if (error instanceof ValidationError) {
        return context.createResponse({
          error: error.message,
          issues: error.issues
        }, {
          status: 400
        });
      }
      if (error instanceof HttpException) {
        return await handleError(error, context);
      }
      if (error instanceof Error && !expose) {
        return await handleError(error, context);
      }
      if (error instanceof Error) {
        return context.createResponse({
          error: error.message
        }, {
          status: defaultStatus
        });
      }
      return await handleError(error, context);
    }
  };
}
// src/middleware/builtin/cors.ts
function getOriginHeader(option, requestOrigin) {
  if (!option || option === "*") {
    return "*";
  }
  if (Array.isArray(option)) {
    if (requestOrigin && option.includes(requestOrigin)) {
      return requestOrigin;
    }
    return option[0];
  }
  return option;
}
function createCorsMiddleware(options = {}) {
  const methods = options.methods ?? ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
  const allowedHeaders = options.allowedHeaders ?? ["Content-Type", "Authorization"];
  const exposedHeaders = options.exposedHeaders ?? [];
  const credentials = options.credentials ?? true;
  const maxAge = options.maxAge ?? 600;
  return async (context, next) => {
    const requestOrigin = context.getHeader("Origin");
    const originHeader = getOriginHeader(options.origin ?? "*", requestOrigin);
    context.setHeader("Access-Control-Allow-Origin", originHeader);
    if (credentials) {
      context.setHeader("Access-Control-Allow-Credentials", "true");
    }
    context.setHeader("Access-Control-Allow-Methods", methods.join(","));
    context.setHeader("Access-Control-Allow-Headers", allowedHeaders.join(","));
    if (exposedHeaders.length > 0) {
      context.setHeader("Access-Control-Expose-Headers", exposedHeaders.join(","));
    }
    context.setHeader("Access-Control-Max-Age", maxAge.toString());
    if (context.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: context.responseHeaders });
    }
    return await next();
  };
}
// src/request/file-handler.ts
class FileHandler {
  static MAX_SIZE = 10 * 1024 * 1024;
  static async parseFormData(context) {
    const contentType = context.getHeader("Content-Type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      throw new Error("Content-Type must be multipart/form-data");
    }
    const request = context.request;
    return await request.formData();
  }
  static async getFiles(formData) {
    const files = {};
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const buffer = await value.arrayBuffer();
        if (buffer.byteLength > this.MAX_SIZE) {
          throw new Error(`File ${value.name} exceeds maximum size`);
        }
        if (!files[key]) {
          files[key] = [];
        }
        files[key].push({
          name: value.name,
          type: value.type,
          size: value.size,
          data: buffer
        });
      }
    }
    return files;
  }
}

// src/middleware/builtin/file-upload.ts
function createFileUploadMiddleware(options = {}) {
  const maxSize = options.maxSize ?? 10 * 1024 * 1024;
  return async (context, next) => {
    const contentType = context.getHeader("Content-Type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return await next();
    }
    const formData = await FileHandler.parseFormData(context);
    const files = await FileHandler.getFiles(formData);
    for (const fileList of Object.values(files)) {
      for (const file of fileList) {
        if (file.size > maxSize) {
          context.setStatus(413);
          return context.createResponse({ error: `File ${file.name} exceeds max size` });
        }
      }
    }
    context.body = {
      fields: Object.fromEntries(formData.entries()),
      files
    };
    return await next();
  };
}
// src/middleware/builtin/static-file.ts
import { normalize, resolve, sep } from "path";
function isSubPath(root, target) {
  const normalizedRoot = normalize(root);
  const normalizedTarget = normalize(target);
  if (normalizedRoot === normalizedTarget) {
    return true;
  }
  const rootWithSep = normalizedRoot.endsWith(sep) ? normalizedRoot : normalizedRoot + sep;
  return normalizedTarget.startsWith(rootWithSep);
}
function createStaticFileMiddleware(options) {
  if (!options.root) {
    throw new Error("Static file middleware requires a root directory");
  }
  const root = resolve(options.root);
  const prefix = options.prefix ?? "/";
  const indexFile = options.indexFile ?? "index.html";
  const enableCache = options.enableCache ?? true;
  return async (context, next) => {
    if (!context.path.startsWith(prefix)) {
      return await next();
    }
    let relativePath = context.path.slice(prefix.length);
    if (!relativePath || relativePath === "") {
      relativePath = "/";
    }
    let cleanPath = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;
    if (cleanPath === "") {
      cleanPath = ".";
    }
    const segments = cleanPath.split("/").filter((segment) => segment.length > 0);
    if (segments.some((segment) => segment === "..")) {
      context.setStatus(403);
      return context.createResponse({ error: "Forbidden" });
    }
    let targetPath = resolve(root, cleanPath);
    if (context.path.endsWith("/") || relativePath === "/") {
      targetPath = resolve(root, cleanPath, indexFile);
    }
    if (!isSubPath(root, targetPath)) {
      context.setStatus(403);
      return context.createResponse({ error: "Forbidden" });
    }
    const file = Bun.file(targetPath);
    if (!await file.exists()) {
      return await next();
    }
    const headers = new Headers(options.headers);
    if (enableCache) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    }
    if (!headers.has("Content-Type") && file.type) {
      headers.set("Content-Type", file.type);
    }
    return new Response(file, {
      status: 200,
      headers
    });
  };
}
// src/controller/controller.ts
init_validation();
var CONTROLLER_METADATA_KEY = Symbol("controller");
function Controller(path = "") {
  return function(target) {
    Reflect.defineMetadata(CONTROLLER_METADATA_KEY, { path, target }, target);
  };
}

class ControllerRegistry {
  static instance;
  container;
  controllers = new Map;
  controllerContainers = new Map;
  constructor() {
    this.container = new Container;
  }
  static getInstance() {
    if (!ControllerRegistry.instance) {
      ControllerRegistry.instance = new ControllerRegistry;
    }
    return ControllerRegistry.instance;
  }
  register(controllerClass, container) {
    const targetContainer = container ?? this.container;
    this.controllerContainers.set(controllerClass, targetContainer);
    if (!targetContainer.isRegistered(controllerClass)) {
      targetContainer.register(controllerClass);
    }
    const metadata = getControllerMetadata(controllerClass);
    if (!metadata) {
      throw new Error(`Controller ${controllerClass.name} must be decorated with @Controller()`);
    }
    const prototype = controllerClass.prototype;
    const routes = getRouteMetadata(prototype);
    if (!routes || routes.length === 0) {
      return;
    }
    const classMiddlewares = getClassMiddlewares(controllerClass);
    const basePath = metadata.path;
    const registry = RouteRegistry.getInstance();
    for (const route of routes) {
      const fullPath = this.combinePaths(basePath, route.path);
      let propertyKey = route.propertyKey;
      if (!propertyKey) {
        const prototype2 = controllerClass.prototype;
        const propertyNames = Object.getOwnPropertyNames(prototype2);
        for (const key of propertyNames) {
          if (key === "constructor")
            continue;
          const descriptor = Object.getOwnPropertyDescriptor(prototype2, key);
          if (descriptor && descriptor.value === route.handler) {
            propertyKey = key;
            break;
          }
        }
      }
      if (!propertyKey) {
        continue;
      }
      const handler = async (context) => {
        try {
          const controllerContainer = this.controllerContainers.get(controllerClass) ?? this.container;
          const controllerInstance = controllerContainer.resolve(controllerClass);
          const prototype2 = controllerClass.prototype;
          const params = await ParamBinder.bind(prototype2, propertyKey, context);
          const validationMetadata = getValidationMetadata(prototype2, propertyKey);
          if (validationMetadata.length > 0) {
            validateParameters(params, validationMetadata);
          }
          let method = controllerInstance[propertyKey];
          if (!method || typeof method !== "function") {
            const prototype3 = controllerClass.prototype;
            method = prototype3[propertyKey];
          }
          if (!method || typeof method !== "function") {
            throw new Error(`Method ${propertyKey} not found on controller ${controllerClass.name}`);
          }
          const result = method.apply(controllerInstance, params);
          const responseData = await Promise.resolve(result);
          if (responseData instanceof Response) {
            return responseData;
          }
          return context.createResponse(responseData);
        } catch (error) {
          const { handleError: handleError2 } = await Promise.resolve().then(() => (init_handler(), exports_handler));
          return await handleError2(error, context);
        }
      };
      const middlewares = [...classMiddlewares];
      if (propertyKey) {
        middlewares.push(...getMethodMiddlewares(prototype, propertyKey));
      }
      registry.register(route.method, fullPath, handler, middlewares, controllerClass, propertyKey);
    }
  }
  combinePaths(basePath, methodPath) {
    const base = basePath.replace(/\/$/, "").replace(/^\/?/, "/");
    const method = methodPath.replace(/^\//, "");
    if (!method) {
      return base === "/" ? "/" : base;
    }
    return base + "/" + method;
  }
  getContainer() {
    return this.container;
  }
  getRegisteredControllers() {
    return Array.from(this.controllerContainers.keys());
  }
  clear() {
    this.controllers.clear();
    this.container.clear();
    this.controllerContainers.clear();
  }
}

// src/websocket/decorators.ts
import"reflect-metadata";
var GATEWAY_METADATA_KEY = Symbol("websocket:gateway");
var HANDLER_METADATA_KEY = Symbol("websocket:handlers");
function WebSocketGateway(path) {
  return (target) => {
    Reflect.defineMetadata(GATEWAY_METADATA_KEY, { path }, target);
  };
}
function createHandlerDecorator(type) {
  return function(target, propertyKey) {
    if (typeof propertyKey !== "string") {
      throw new Error("@OnOpen/@OnMessage/@OnClose only support string method names");
    }
    const existing = Reflect.getMetadata(HANDLER_METADATA_KEY, target) || {};
    existing[type] = propertyKey;
    Reflect.defineMetadata(HANDLER_METADATA_KEY, existing, target);
  };
}
var OnOpen = createHandlerDecorator("open");
var OnMessage = createHandlerDecorator("message");
var OnClose = createHandlerDecorator("close");
function getGatewayMetadata(constructor) {
  return Reflect.getMetadata(GATEWAY_METADATA_KEY, constructor);
}
function getHandlerMetadata(target) {
  return Reflect.getMetadata(HANDLER_METADATA_KEY, target) || {};
}

// src/websocket/registry.ts
class WebSocketGatewayRegistry {
  static instance;
  container;
  gateways = new Map;
  constructor() {
    this.container = ControllerRegistry.getInstance().getContainer();
  }
  static getInstance() {
    if (!WebSocketGatewayRegistry.instance) {
      WebSocketGatewayRegistry.instance = new WebSocketGatewayRegistry;
    }
    return WebSocketGatewayRegistry.instance;
  }
  register(gatewayClass) {
    const metadata = getGatewayMetadata(gatewayClass);
    if (!metadata) {
      throw new Error(`WebSocket gateway ${gatewayClass.name} must use @WebSocketGateway()`);
    }
    const handlers = getHandlerMetadata(gatewayClass.prototype);
    if (!handlers.open && !handlers.message && !handlers.close) {
      throw new Error(`WebSocket gateway ${gatewayClass.name} must define at least one handler`);
    }
    if (!this.container.isRegistered(gatewayClass)) {
      this.container.register(gatewayClass);
    }
    this.gateways.set(metadata.path, {
      path: metadata.path,
      gatewayClass,
      handlers
    });
  }
  hasGateway(path) {
    return this.gateways.has(path);
  }
  clear() {
    this.gateways.clear();
  }
  getGateway(path) {
    return this.gateways.get(path);
  }
  getGatewayInstance(definition) {
    if (!definition.instance) {
      definition.instance = this.container.resolve(definition.gatewayClass);
    }
    return definition.instance;
  }
  invokeHandler(ws, definition, handlerName, ...args) {
    if (!handlerName) {
      return;
    }
    const instance = this.getGatewayInstance(definition);
    const handler = instance[handlerName];
    if (typeof handler === "function") {
      handler.apply(instance, [ws, ...args]);
    }
  }
  handleOpen(ws) {
    const path = ws.data?.path;
    const definition = path ? this.getGateway(path) : undefined;
    if (!definition) {
      ws.close(1008, "Gateway not found");
      return;
    }
    this.invokeHandler(ws, definition, definition.handlers.open);
  }
  handleMessage(ws, message) {
    const path = ws.data?.path;
    const definition = path ? this.getGateway(path) : undefined;
    if (!definition) {
      ws.close(1008, "Gateway not found");
      return;
    }
    this.invokeHandler(ws, definition, definition.handlers.message, message);
  }
  handleClose(ws, code, reason) {
    const path = ws.data?.path;
    const definition = path ? this.getGateway(path) : undefined;
    if (!definition) {
      return;
    }
    this.invokeHandler(ws, definition, definition.handlers.close, code, reason);
  }
}

// src/extensions/logger-extension.ts
import {
  LoggerManager as LoggerManager6,
  LogLevel,
  SimpleLogger
} from "@dangao/logsmith";
var LOGGER_TOKEN = Symbol("@dangao/bun-server:logger");

class LoggerExtension {
  options;
  constructor(options = {}) {
    this.options = {
      level: LogLevel.INFO,
      ...options
    };
  }
  register(container) {
    const logger = new SimpleLogger(this.options);
    LoggerManager6.setLogger(logger);
    container.registerInstance(SimpleLogger, logger);
    container.registerInstance(LOGGER_TOKEN, logger);
  }
}

// src/di/module.ts
import"reflect-metadata";
var MODULE_METADATA_KEY = Symbol("@dangao/bun-server:module");
function Module(metadata) {
  return (target) => {
    Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, target);
  };
}
function getModuleMetadata(moduleClass) {
  const metadata = Reflect.getMetadata(MODULE_METADATA_KEY, moduleClass) ?? {};
  return {
    imports: metadata.imports ?? [],
    controllers: metadata.controllers ?? [],
    providers: metadata.providers ?? [],
    exports: metadata.exports ?? [],
    extensions: metadata.extensions ?? [],
    middlewares: metadata.middlewares ?? []
  };
}

// src/di/module-registry.ts
class ModuleRegistry {
  static instance;
  moduleRefs = new Map;
  processing = new Set;
  rootContainer;
  static getInstance() {
    if (!ModuleRegistry.instance) {
      ModuleRegistry.instance = new ModuleRegistry;
    }
    return ModuleRegistry.instance;
  }
  register(moduleClass, parentContainer) {
    if (!this.rootContainer) {
      this.rootContainer = parentContainer;
    }
    return this.processModule(moduleClass, parentContainer);
  }
  getModuleRef(moduleClass) {
    return this.moduleRefs.get(moduleClass);
  }
  clear() {
    this.moduleRefs.clear();
    this.processing.clear();
    this.rootContainer = undefined;
  }
  processModule(moduleClass, parentContainer) {
    if (this.processing.has(moduleClass)) {
      throw new Error(`Circular module dependency detected for ${moduleClass.name}`);
    }
    const moduleRef = this.getOrCreateModuleRef(moduleClass);
    this.processing.add(moduleClass);
    for (const imported of moduleRef.metadata.imports) {
      this.processModule(imported, moduleRef.container);
    }
    this.processing.delete(moduleClass);
    this.attachModuleToParent(moduleRef, parentContainer);
    return moduleRef;
  }
  getOrCreateModuleRef(moduleClass) {
    let ref = this.moduleRefs.get(moduleClass);
    if (ref) {
      return ref;
    }
    if (!this.rootContainer) {
      throw new Error("ModuleRegistry is not initialized with a root container");
    }
    const metadata = getModuleMetadata(moduleClass);
    const container = new Container({ parent: this.rootContainer });
    this.registerProviders(container, metadata.providers);
    ref = {
      moduleClass,
      metadata,
      container,
      controllersRegistered: false,
      attachedParents: new Set,
      extensions: metadata.extensions ?? [],
      middlewares: metadata.middlewares ?? []
    };
    this.registerControllers(ref);
    this.moduleRefs.set(moduleClass, ref);
    return ref;
  }
  registerProviders(container, providers) {
    for (const provider of providers) {
      if (typeof provider === "function") {
        if (!container.isRegistered(provider)) {
          container.register(provider);
        }
        continue;
      }
      if ("useValue" in provider) {
        container.registerInstance(provider.provide, provider.useValue);
        continue;
      }
      if ("useFactory" in provider) {
        container.register(provider.provide, {
          lifecycle: provider.lifecycle ?? "singleton" /* Singleton */,
          factory: () => provider.useFactory(container)
        });
        continue;
      }
      if ("useClass" in provider) {
        const token = provider.provide ?? provider.useClass;
        container.register(token, {
          lifecycle: provider.lifecycle ?? "singleton" /* Singleton */,
          implementation: provider.useClass
        });
      }
    }
  }
  registerControllers(moduleRef) {
    if (moduleRef.controllersRegistered) {
      return;
    }
    const controllerRegistry = ControllerRegistry.getInstance();
    for (const controller of moduleRef.metadata.controllers) {
      controllerRegistry.register(controller, moduleRef.container);
    }
    moduleRef.controllersRegistered = true;
  }
  attachModuleToParent(moduleRef, parentContainer) {
    if (moduleRef.attachedParents.has(parentContainer)) {
      return;
    }
    moduleRef.attachedParents.add(parentContainer);
    for (const exportedToken of moduleRef.metadata.exports) {
      this.registerExport(parentContainer, moduleRef, exportedToken);
    }
    for (const imported of moduleRef.metadata.imports) {
      const importedRef = this.moduleRefs.get(imported);
      if (importedRef) {
        moduleRef.extensions.push(...importedRef.extensions);
        moduleRef.middlewares.push(...importedRef.middlewares);
      }
    }
  }
  getModuleExtensions(moduleClass) {
    const moduleRef = this.moduleRefs.get(moduleClass);
    if (!moduleRef) {
      return [];
    }
    return moduleRef.extensions;
  }
  getModuleMiddlewares(moduleClass) {
    const moduleRef = this.moduleRefs.get(moduleClass);
    if (!moduleRef) {
      return [];
    }
    return moduleRef.middlewares;
  }
  registerExport(parentContainer, moduleRef, token) {
    if (!moduleRef.container.isRegistered(token)) {
      throw new Error(`Module ${moduleRef.moduleClass.name} cannot export ${typeof token === "function" ? token.name : String(token)} because it is not registered`);
    }
    if (parentContainer.isRegistered(token)) {
      return;
    }
    parentContainer.register(token, {
      lifecycle: "singleton" /* Singleton */,
      factory: () => moduleRef.container.resolve(token)
    });
  }
}

// src/core/application.ts
class Application {
  server;
  options;
  middlewarePipeline;
  websocketRegistry;
  extensions = [];
  constructor(options = {}) {
    this.options = options;
    this.middlewarePipeline = new MiddlewarePipeline([createErrorHandlingMiddleware()]);
    this.websocketRegistry = WebSocketGatewayRegistry.getInstance();
    RouteRegistry.getInstance().clear();
    ControllerRegistry.getInstance().clear();
    ModuleRegistry.getInstance().clear();
    this.registerExtension(new LoggerExtension);
  }
  use(middleware) {
    this.middlewarePipeline.use(middleware);
  }
  listen(port, hostname) {
    if (this.server?.isRunning()) {
      throw new Error("Application is already running");
    }
    const serverOptions = {
      port: port ?? this.options.port ?? 3000,
      hostname: hostname ?? this.options.hostname,
      fetch: this.handleRequest.bind(this),
      websocketRegistry: this.websocketRegistry
    };
    this.server = new BunServer(serverOptions);
    this.server.start();
  }
  stop() {
    this.server?.stop();
  }
  async handleRequest(context) {
    if (["POST", "PUT", "PATCH"].includes(context.method)) {
      await context.getBody();
    }
    const registry = RouteRegistry.getInstance();
    const router = registry.getRouter();
    await router.preHandle(context);
    return await this.middlewarePipeline.run(context, async () => {
      const response = await router.handle(context);
      if (response) {
        return response;
      }
      context.setStatus(404);
      return context.createResponse({ error: "Not Found" });
    });
  }
  registerController(controllerClass) {
    const registry = ControllerRegistry.getInstance();
    registry.register(controllerClass);
  }
  registerModule(moduleClass) {
    const registry = ModuleRegistry.getInstance();
    registry.register(moduleClass, this.getContainer());
    const extensions = registry.getModuleExtensions(moduleClass);
    for (const extension of extensions) {
      this.registerExtension(extension);
    }
    const middlewares = registry.getModuleMiddlewares(moduleClass);
    for (const middleware of middlewares) {
      this.use(middleware);
    }
  }
  registerWebSocketGateway(gatewayClass) {
    this.websocketRegistry.register(gatewayClass);
  }
  registerExtension(extension) {
    this.extensions.push(extension);
    extension.register(this.getContainer());
  }
  getServer() {
    return this.server;
  }
  getContainer() {
    return ControllerRegistry.getInstance().getContainer();
  }
}
// src/request/request.ts
class RequestWrapper {
  request;
  url;
  method;
  path;
  query;
  headers;
  _body;
  _bodyParsed = false;
  constructor(request) {
    this.request = request;
    this.url = new URL(request.url);
    this.method = request.method;
    this.path = this.url.pathname;
    this.query = this.url.searchParams;
    this.headers = request.headers;
  }
  async body() {
    if (!this._bodyParsed) {
      this._body = await BodyParser.parse(this.request);
      this._bodyParsed = true;
    }
    return this._body;
  }
  getBody() {
    return this._body;
  }
  getQuery(key) {
    return this.query.get(key);
  }
  getQueryAll() {
    const result = {};
    this.query.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  getHeader(key) {
    return this.headers.get(key);
  }
}
// src/request/response.ts
class ResponseBuilder {
  static json(data, status = 200, headers) {
    const responseHeaders = new Headers(headers);
    responseHeaders.set("Content-Type", "application/json");
    return new Response(JSON.stringify(data), {
      status,
      headers: responseHeaders
    });
  }
  static text(text, status = 200, headers) {
    const responseHeaders = new Headers(headers);
    responseHeaders.set("Content-Type", "text/plain");
    return new Response(text, {
      status,
      headers: responseHeaders
    });
  }
  static html(html, status = 200, headers) {
    const responseHeaders = new Headers(headers);
    responseHeaders.set("Content-Type", "text/html");
    return new Response(html, {
      status,
      headers: responseHeaders
    });
  }
  static empty(status = 204, headers) {
    const responseHeaders = headers ? new Headers(headers) : undefined;
    return new Response(null, {
      status,
      headers: responseHeaders
    });
  }
  static redirect(url, status = 302) {
    return new Response(null, {
      status,
      headers: {
        Location: url
      }
    });
  }
  static error(message, status = 500) {
    return this.json({ error: message }, status);
  }
  static file(source, options = {}) {
    const headers = new Headers(options.headers);
    if (options.fileName) {
      headers.set("Content-Disposition", `attachment; filename="${options.fileName}"`);
    }
    if (options.contentType) {
      headers.set("Content-Type", options.contentType);
    }
    if (typeof source === "string") {
      const file = Bun.file(source);
      if (!headers.has("Content-Type") && file.type) {
        headers.set("Content-Type", file.type);
      }
      return new Response(file, {
        status: options.status ?? 200,
        headers
      });
    }
    return new Response(source, {
      status: options.status ?? 200,
      headers
    });
  }
}
// src/index.ts
init_validation();
// src/extensions/logger-module.ts
class LoggerModule {
  static forRoot(options = {}) {
    const extensions = [];
    const middlewares = [];
    const loggerExtension = new LoggerExtension(options.logger);
    extensions.push(loggerExtension);
    if (options.enableRequestLogging !== false) {
      const requestLoggingMiddleware = createLoggerMiddleware({
        prefix: options.requestLoggingPrefix
      });
      middlewares.push(requestLoggingMiddleware);
    }
    const existingMetadata = Reflect.getMetadata(MODULE_METADATA_KEY, LoggerModule) || {};
    const metadata = {
      ...existingMetadata,
      extensions,
      middlewares
    };
    Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, LoggerModule);
    return LoggerModule;
  }
}
LoggerModule = __legacyDecorateClassTS([
  Module({
    extensions: [],
    middlewares: []
  })
], LoggerModule);

// src/extensions/index.ts
import { LoggerManager as LoggerManager7, LogLevel as LogLevel2, SimpleLogger as SimpleLogger2 } from "@dangao/logsmith";
// src/swagger/decorators.ts
import"reflect-metadata";
var API_TAG_METADATA_KEY = Symbol("swagger:api-tag");
var API_OPERATION_METADATA_KEY = Symbol("swagger:api-operation");
var API_PARAM_METADATA_KEY = Symbol("swagger:api-param");
var API_BODY_METADATA_KEY = Symbol("swagger:api-body");
var API_RESPONSE_METADATA_KEY = Symbol("swagger:api-response");
function ApiTags(...tags) {
  return function(target, propertyKey) {
    if (propertyKey === undefined) {
      Reflect.defineMetadata(API_TAG_METADATA_KEY, tags, target);
    } else {
      const existingTags = Reflect.getMetadata(API_TAG_METADATA_KEY, target, propertyKey) || [];
      Reflect.defineMetadata(API_TAG_METADATA_KEY, [...existingTags, ...tags], target, propertyKey);
    }
  };
}
function ApiOperation(metadata) {
  return function(target, propertyKey) {
    Reflect.defineMetadata(API_OPERATION_METADATA_KEY, metadata, target, propertyKey);
  };
}
function ApiParam(metadata) {
  return function(target, propertyKey, parameterIndex) {
    const existingParams = Reflect.getMetadata(API_PARAM_METADATA_KEY, target, propertyKey) || [];
    existingParams.push({ index: parameterIndex, metadata });
    Reflect.defineMetadata(API_PARAM_METADATA_KEY, existingParams, target, propertyKey);
  };
}
function ApiBody(metadata) {
  return function(target, propertyKey) {
    Reflect.defineMetadata(API_BODY_METADATA_KEY, metadata, target, propertyKey);
  };
}
function ApiResponse(metadata) {
  return function(target, propertyKey) {
    const existingResponses = Reflect.getMetadata(API_RESPONSE_METADATA_KEY, target, propertyKey) || [];
    existingResponses.push(metadata);
    Reflect.defineMetadata(API_RESPONSE_METADATA_KEY, existingResponses, target, propertyKey);
  };
}
function getApiTags(target, propertyKey) {
  if (propertyKey === undefined) {
    return Reflect.getMetadata(API_TAG_METADATA_KEY, target) || [];
  }
  return Reflect.getMetadata(API_TAG_METADATA_KEY, target, propertyKey) || [];
}
function getApiOperation(target, propertyKey) {
  return Reflect.getMetadata(API_OPERATION_METADATA_KEY, target, propertyKey);
}
function getApiParams(target, propertyKey) {
  return Reflect.getMetadata(API_PARAM_METADATA_KEY, target, propertyKey) || [];
}
function getApiBody(target, propertyKey) {
  return Reflect.getMetadata(API_BODY_METADATA_KEY, target, propertyKey);
}
function getApiResponses(target, propertyKey) {
  return Reflect.getMetadata(API_RESPONSE_METADATA_KEY, target, propertyKey) || [];
}
// src/swagger/generator.ts
class SwaggerGenerator {
  options;
  constructor(options) {
    this.options = options;
  }
  generate() {
    const document = {
      openapi: "3.0.0",
      info: {
        title: this.options.info.title,
        version: this.options.info.version,
        description: this.options.info.description,
        contact: this.options.info.contact,
        license: this.options.info.license
      },
      servers: this.options.servers,
      tags: this.options.tags,
      paths: {}
    };
    const controllerRegistry = ControllerRegistry.getInstance();
    const controllers = controllerRegistry.getRegisteredControllers();
    if (controllers.length === 0) {
      return document;
    }
    for (const controllerClass of controllers) {
      const controllerMetadata = getControllerMetadata(controllerClass);
      if (!controllerMetadata) {
        console.log(`[SwaggerGenerator] No metadata for controller: ${controllerClass.name}`);
        continue;
      }
      const basePath = controllerMetadata.path;
      const prototype = controllerClass.prototype;
      const routes = getRouteMetadata(prototype);
      if (!routes || routes.length === 0) {
        continue;
      }
      const controllerTags = getApiTags(controllerClass);
      for (const route of routes) {
        let propertyKey = route.propertyKey;
        if (!propertyKey && route.handler) {
          propertyKey = route.handler.name;
          if (!propertyKey || propertyKey === "") {
            const propertyNames = Object.getOwnPropertyNames(prototype);
            for (const key of propertyNames) {
              if (key === "constructor")
                continue;
              const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
              if (descriptor && descriptor.value === route.handler) {
                propertyKey = key;
                break;
              }
            }
          }
        }
        if (!propertyKey) {
          continue;
        }
        const method = route.method.toLowerCase();
        let methodPath = route.path;
        if (methodPath && !methodPath.startsWith("/")) {
          methodPath = "/" + methodPath;
        }
        const swaggerPath = (basePath + methodPath).replace(/:([^/]+)/g, "{$1}");
        const fullPath = this.normalizePath(swaggerPath);
        const operationMetadata = getApiOperation(prototype, propertyKey);
        const methodTags = getApiTags(prototype, propertyKey);
        const params = getApiParams(prototype, propertyKey);
        const body = getApiBody(prototype, propertyKey);
        const responses = getApiResponses(prototype, propertyKey);
        const tags = [...new Set([...controllerTags, ...methodTags])];
        const pathItem = {
          summary: operationMetadata?.summary,
          description: operationMetadata?.description,
          operationId: operationMetadata?.operationId || propertyKey,
          tags: tags.length > 0 ? tags : undefined,
          deprecated: operationMetadata?.deprecated
        };
        const pathParams = [];
        const pathParamMatches = fullPath.matchAll(/\{([^}]+)\}/g);
        for (const match of pathParamMatches) {
          const paramName = match[1];
          const existingParam = params.find((p) => p.metadata.name === paramName && p.metadata.in === "path");
          if (!existingParam) {
            pathParams.push({
              name: paramName,
              in: "path",
              required: true,
              schema: { type: "string" }
            });
          }
        }
        for (const param of params) {
          pathParams.push({
            name: param.metadata.name,
            in: param.metadata.in,
            description: param.metadata.description,
            required: param.metadata.required,
            schema: param.metadata.schema
          });
        }
        if (pathParams.length > 0) {
          pathItem.parameters = pathParams;
        }
        if (body) {
          pathItem.requestBody = {
            description: body.description,
            required: body.required,
            content: {
              "application/json": {
                schema: body.schema,
                examples: body.examples
              }
            }
          };
        }
        if (responses.length > 0) {
          pathItem.responses = {};
          for (const response of responses) {
            pathItem.responses[String(response.status)] = {
              description: response.description,
              content: {
                "application/json": {
                  schema: response.schema,
                  examples: response.examples
                }
              }
            };
          }
        } else {
          pathItem.responses = {
            "200": {
              description: "Success"
            }
          };
        }
        if (!document.paths[fullPath]) {
          document.paths[fullPath] = {};
        }
        document.paths[fullPath][method] = pathItem;
      }
    }
    return document;
  }
  normalizePath(path) {
    path = path.replace(/\/+/g, "/");
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    if (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    return path;
  }
}
// src/swagger/swagger-extension.ts
class SwaggerExtension {
  options;
  generator;
  constructor(options) {
    this.options = options;
  }
  register(_container) {
    this.generator = new SwaggerGenerator(this.options);
  }
  getGenerator() {
    if (!this.generator) {
      this.generator = new SwaggerGenerator(this.options);
    }
    return this.generator;
  }
  generateJSON() {
    return JSON.stringify(this.getGenerator().generate(), null, 2);
  }
}
// src/swagger/ui.ts
var SWAGGER_UI_HTML = (jsonUrl, title) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin:0;
      background: #fafafa;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: "${jsonUrl}",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`;
function createSwaggerUIMiddleware(extension, options = {}) {
  const uiPath = options.uiPath || "/swagger";
  const jsonPath = options.jsonPath || "/swagger.json";
  const title = options.title || "API Documentation";
  return async (ctx, next) => {
    const url = new URL(ctx.request.url);
    const pathname = url.pathname;
    if (pathname === uiPath || pathname === `${uiPath}/`) {
      const html = SWAGGER_UI_HTML(jsonPath, title);
      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8"
        }
      });
    }
    if (pathname === jsonPath) {
      const json = extension.generateJSON();
      return new Response(json, {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      });
    }
    return await next();
  };
}

// src/swagger/swagger-module.ts
class SwaggerModule {
  static forRoot(options) {
    const extensions = [];
    const middlewares = [];
    const swaggerExtension = new SwaggerExtension({
      info: options.info,
      servers: options.servers,
      basePath: options.basePath,
      tags: options.tags
    });
    extensions.push(swaggerExtension);
    if (options.enableUI !== false) {
      const uiMiddleware = createSwaggerUIMiddleware(swaggerExtension, {
        uiPath: options.uiPath || "/swagger",
        jsonPath: options.jsonPath || "/swagger.json",
        title: options.uiTitle || options.info.title || "API Documentation"
      });
      middlewares.push(uiMiddleware);
    }
    const existingMetadata = Reflect.getMetadata(MODULE_METADATA_KEY, SwaggerModule) || {};
    const metadata = {
      ...existingMetadata,
      extensions,
      middlewares
    };
    Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, SwaggerModule);
    return SwaggerModule;
  }
}
SwaggerModule = __legacyDecorateClassTS([
  Module({
    extensions: [],
    middlewares: []
  })
], SwaggerModule);
// src/security/context.ts
import { AsyncLocalStorage } from "async_hooks";

class SecurityContextImpl {
  _authentication = null;
  get authentication() {
    return this._authentication;
  }
  setAuthentication(authentication) {
    this._authentication = authentication;
  }
  isAuthenticated() {
    return this._authentication?.authenticated ?? false;
  }
  getPrincipal() {
    return this._authentication?.principal ?? null;
  }
  getAuthorities() {
    return this._authentication?.authorities ?? [];
  }
  clear() {
    this._authentication = null;
  }
}

class SecurityContextHolder {
  static storage = new AsyncLocalStorage;
  static getContext() {
    let context = this.storage.getStore();
    if (!context) {
      context = new SecurityContextImpl;
      this.storage.enterWith(context);
    }
    return context;
  }
  static runWithContext(callback) {
    const context = new SecurityContextImpl;
    return this.storage.run(context, callback);
  }
  static clearContext() {
    const context = this.storage.getStore();
    if (context) {
      context.clear();
    }
  }
}
// src/security/authentication-manager.ts
class AuthenticationManager {
  providers = [];
  registerProvider(provider) {
    this.providers.push(provider);
  }
  async authenticate(request) {
    const type = request.type || "default";
    const provider = this.providers.find((p) => p.supports(type));
    if (!provider) {
      throw new Error(`No authentication provider found for type: ${type}`);
    }
    return await provider.authenticate(request);
  }
  getProviders() {
    return [...this.providers];
  }
}
// src/security/access-decision-manager.ts
class RoleBasedAccessDecisionManager {
  decide(authentication, requiredAuthorities) {
    if (requiredAuthorities.length === 0) {
      return true;
    }
    if (!authentication.authenticated) {
      return false;
    }
    const userAuthorities = authentication.authorities || [];
    return requiredAuthorities.some((required) => userAuthorities.includes(required));
  }
}
// src/security/filter.ts
init_http_exception();
init_error_codes();

// src/auth/decorators.ts
import"reflect-metadata";
var AUTH_METADATA_KEY = Symbol("@dangao/bun-server:auth");
function Auth(config = {}) {
  return (target, propertyKey) => {
    const metadata = Reflect.getMetadata(AUTH_METADATA_KEY, target) || {};
    metadata[propertyKey] = {
      required: config.required !== false,
      roles: config.roles || [],
      allowAnonymous: config.allowAnonymous || false
    };
    Reflect.defineMetadata(AUTH_METADATA_KEY, metadata, target);
  };
}
function getAuthMetadata(target, propertyKey) {
  const metadata = Reflect.getMetadata(AUTH_METADATA_KEY, target);
  return metadata?.[propertyKey];
}
function requiresAuth(target, propertyKey) {
  const config = getAuthMetadata(target, propertyKey);
  if (!config) {
    return false;
  }
  return config.required !== false;
}
function checkRoles(target, propertyKey, userRoles = []) {
  const config = getAuthMetadata(target, propertyKey);
  if (!config?.roles || config.roles.length === 0) {
    return true;
  }
  return config.roles.some((role) => userRoles.includes(role));
}

// src/security/filter.ts
function createSecurityFilter(config) {
  const {
    authenticationManager,
    accessDecisionManager = new RoleBasedAccessDecisionManager,
    excludePaths = [],
    defaultAuthRequired = true,
    extractToken
  } = config;
  return async (ctx, next) => {
    return SecurityContextHolder.runWithContext(async () => {
      const path = ctx.path || ctx.request.url.split("?")[0].replace(/^https?:\/\/[^/]+/, "");
      if (excludePaths.some((exclude) => path.startsWith(exclude))) {
        return await next();
      }
      const securityContext = SecurityContextHolder.getContext();
      try {
        const token = extractToken ? extractToken(ctx) : extractTokenFromHeader(ctx);
        if (token) {
          const request = {
            principal: "",
            credentials: token,
            type: "jwt"
          };
          const authentication = await authenticationManager.authenticate(request);
          if (authentication) {
            securityContext.setAuthentication(authentication);
          }
        }
        const handler = ctx.routeHandler;
        if (handler) {
          const controllerClass = handler.controller;
          const controllerTarget = controllerClass && controllerClass.prototype || controllerClass;
          const method = handler.method;
          if (requiresAuth(controllerTarget, method)) {
            const authentication = securityContext.authentication;
            if (!authentication || !authentication.authenticated) {
              throw new UnauthorizedException("Authentication required", undefined, "AUTH_REQUIRED" /* AUTH_REQUIRED */);
            }
            const requiredRoles = getRequiredRoles(controllerTarget, method);
            if (requiredRoles.length > 0) {
              const hasAccess = accessDecisionManager.decide(authentication, requiredRoles);
              if (!hasAccess) {
                const userRoles = authentication.authorities || [];
                throw new ForbiddenException(`Insufficient permissions. Required roles: ${requiredRoles.join(", ")}, User roles: ${userRoles.join(", ")}`, { requiredRoles, userRoles }, "AUTH_INSUFFICIENT_PERMISSIONS" /* AUTH_INSUFFICIENT_PERMISSIONS */);
              }
            }
          }
        } else if (defaultAuthRequired && !securityContext.isAuthenticated()) {
          throw new UnauthorizedException("Authentication required", undefined, "AUTH_REQUIRED" /* AUTH_REQUIRED */);
        }
        ctx.security = securityContext;
        ctx.auth = {
          isAuthenticated: securityContext.isAuthenticated(),
          user: securityContext.getPrincipal(),
          payload: securityContext.authentication?.details
        };
        return await next();
      } finally {
        SecurityContextHolder.clearContext();
      }
    });
  };
}
function extractTokenFromHeader(ctx) {
  const authHeader = ctx.getHeader("authorization");
  if (!authHeader) {
    return null;
  }
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return null;
  }
  return parts[1];
}
function getRequiredRoles(target, propertyKey) {
  const metadata = getAuthMetadata(target, propertyKey);
  return metadata?.roles || [];
}
// src/security/providers/jwt-provider.ts
class JwtAuthenticationProvider {
  jwtUtil;
  supportedTypes = ["jwt", "bearer"];
  constructor(jwtUtil) {
    this.jwtUtil = jwtUtil;
  }
  supports(type) {
    return this.supportedTypes.includes(type.toLowerCase());
  }
  async authenticate(request) {
    const token = request.credentials;
    if (!token) {
      return null;
    }
    const payload = this.jwtUtil.verify(token);
    if (!payload) {
      return null;
    }
    const principal = {
      id: payload.sub,
      username: payload.username || payload.sub,
      roles: payload.roles || []
    };
    const authorities = principal.roles || [];
    return {
      authenticated: true,
      principal,
      credentials: { type: "jwt", data: token },
      authorities,
      details: payload
    };
  }
}
// src/security/providers/oauth2-provider.ts
class OAuth2AuthenticationProvider {
  oauth2Service;
  jwtUtil;
  supportedTypes = ["oauth2", "authorization_code"];
  constructor(oauth2Service, jwtUtil) {
    this.oauth2Service = oauth2Service;
    this.jwtUtil = jwtUtil;
  }
  supports(type) {
    return this.supportedTypes.includes(type.toLowerCase());
  }
  async authenticate(request) {
    const credentials = request.credentials;
    if (!credentials || credentials.grantType !== "authorization_code") {
      return null;
    }
    const tokenResponse = await this.oauth2Service.exchangeCodeForToken(credentials);
    if (!tokenResponse) {
      return null;
    }
    const payload = this.jwtUtil.verify(tokenResponse.accessToken);
    if (!payload || !payload.sub) {
      return null;
    }
    const principal = {
      id: payload.sub,
      username: payload.username || payload.sub,
      roles: payload.roles || []
    };
    return {
      authenticated: true,
      principal,
      credentials: {
        type: "oauth2",
        data: tokenResponse
      },
      authorities: principal.roles || [],
      details: tokenResponse
    };
  }
}
// src/auth/jwt.ts
class JWTUtil {
  config;
  constructor(config) {
    this.config = {
      secret: config.secret,
      accessTokenExpiresIn: config.accessTokenExpiresIn ?? 3600,
      refreshTokenExpiresIn: config.refreshTokenExpiresIn ?? 86400 * 7,
      algorithm: config.algorithm ?? "HS256"
    };
  }
  generateAccessToken(payload) {
    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
      ...payload,
      sub: payload.sub,
      iat: now,
      exp: now + this.config.accessTokenExpiresIn
    };
    return this.sign(tokenPayload);
  }
  generateRefreshToken(payload) {
    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
      ...payload,
      sub: payload.sub,
      iat: now,
      exp: now + this.config.refreshTokenExpiresIn
    };
    return this.sign(tokenPayload);
  }
  verify(token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        return null;
      }
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
      const signature = this.signature(parts[0] + "." + parts[1]);
      if (signature !== parts[2]) {
        return null;
      }
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }
  sign(payload) {
    const header = {
      alg: this.config.algorithm,
      typ: "JWT"
    };
    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    const signature = this.signature(encodedHeader + "." + encodedPayload);
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
  signature(data) {
    const encoder = new TextEncoder;
    const keyData = encoder.encode(this.config.secret);
    const messageData = encoder.encode(data);
    const hash = this.hmacSha256(keyData, messageData);
    return this.base64UrlEncode(Buffer.from(hash).toString("base64"));
  }
  hmacSha256(key, data) {
    const blockSize = 64;
    let keyBuffer;
    if (key.length > blockSize) {
      const hasher = new Bun.CryptoHasher("sha256");
      hasher.update(key);
      keyBuffer = new Uint8Array(hasher.digest());
    } else {
      keyBuffer = new Uint8Array(blockSize);
      keyBuffer.set(key);
    }
    const oKeyPad = new Uint8Array(blockSize);
    const iKeyPad = new Uint8Array(blockSize);
    for (let i = 0;i < blockSize; i++) {
      oKeyPad[i] = keyBuffer[i] ^ 92;
      iKeyPad[i] = keyBuffer[i] ^ 54;
    }
    const innerData = new Uint8Array(iKeyPad.length + data.length);
    innerData.set(iKeyPad);
    innerData.set(data, iKeyPad.length);
    const innerHasher = new Bun.CryptoHasher("sha256");
    innerHasher.update(innerData);
    const innerHash = new Uint8Array(innerHasher.digest());
    const outerData = new Uint8Array(oKeyPad.length + innerHash.length);
    outerData.set(oKeyPad);
    outerData.set(innerHash, oKeyPad.length);
    const outerHasher = new Bun.CryptoHasher("sha256");
    outerHasher.update(outerData);
    return new Uint8Array(outerHasher.digest());
  }
  base64UrlEncode(str) {
    return Buffer.from(str).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
}

// src/auth/oauth2.ts
class OAuth2Service {
  jwtUtil;
  clients;
  codes;
  codeConfig;
  userProvider;
  constructor(jwtUtil, clients = [], codeConfig = {}, userProvider) {
    this.jwtUtil = jwtUtil;
    this.clients = new Map;
    this.codes = new Map;
    this.codeConfig = {
      expiresIn: codeConfig.expiresIn ?? 600,
      length: codeConfig.length ?? 32
    };
    for (const client of clients) {
      this.clients.set(client.clientId, client);
    }
    this.userProvider = userProvider;
    setInterval(() => this.cleanupExpiredCodes(), 60000);
  }
  registerClient(client) {
    this.clients.set(client.clientId, client);
  }
  validateAuthorizationRequest(request) {
    const client = this.clients.get(request.clientId);
    if (!client) {
      return { valid: false, error: "invalid_client" };
    }
    if (request.responseType !== "code") {
      return { valid: false, error: "unsupported_response_type" };
    }
    if (!client.redirectUris.includes(request.redirectUri)) {
      return { valid: false, error: "invalid_redirect_uri" };
    }
    return { valid: true };
  }
  generateAuthorizationCode(clientId, redirectUri, userId, scope) {
    const code = this.generateRandomString(this.codeConfig.length);
    const expiresAt = Date.now() + this.codeConfig.expiresIn * 1000;
    this.codes.set(code, {
      code,
      clientId,
      redirectUri,
      userId,
      scope,
      expiresAt
    });
    return code;
  }
  async exchangeCodeForToken(request) {
    if (request.grantType !== "authorization_code") {
      return null;
    }
    const codeData = this.codes.get(request.code);
    if (!codeData) {
      return null;
    }
    if (codeData.expiresAt < Date.now()) {
      this.codes.delete(request.code);
      return null;
    }
    const client = this.clients.get(request.clientId);
    if (!client || client.clientSecret !== request.clientSecret) {
      return null;
    }
    if (codeData.redirectUri !== request.redirectUri) {
      return null;
    }
    this.codes.delete(request.code);
    let userInfo = null;
    if (this.userProvider) {
      userInfo = await this.userProvider(codeData.userId);
    }
    if (!userInfo) {
      userInfo = {
        id: codeData.userId,
        username: codeData.userId
      };
    }
    const payload = {
      sub: userInfo.id,
      username: userInfo.username,
      roles: userInfo.roles
    };
    const accessToken = this.jwtUtil.generateAccessToken(payload);
    const refreshToken = this.jwtUtil.generateRefreshToken(payload);
    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn: this.jwtUtil["config"].accessTokenExpiresIn,
      refreshToken,
      scope: codeData.scope
    };
  }
  async refreshToken(refreshToken) {
    const payload = this.jwtUtil.verify(refreshToken);
    if (!payload || !payload.sub) {
      return null;
    }
    let userInfo = null;
    if (this.userProvider) {
      userInfo = await this.userProvider(payload.sub);
    }
    if (!userInfo) {
      userInfo = {
        id: payload.sub,
        username: payload.username || payload.sub,
        roles: payload.roles
      };
    }
    const newPayload = {
      sub: userInfo.id,
      username: userInfo.username,
      roles: userInfo.roles
    };
    const accessToken = this.jwtUtil.generateAccessToken(newPayload);
    const newRefreshToken = this.jwtUtil.generateRefreshToken(newPayload);
    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn: this.jwtUtil["config"].accessTokenExpiresIn,
      refreshToken: newRefreshToken
    };
  }
  generateRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0;i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  cleanupExpiredCodes() {
    const now = Date.now();
    for (const [code, data] of this.codes.entries()) {
      if (data.expiresAt < now) {
        this.codes.delete(code);
      }
    }
  }
}
// src/auth/controller.ts
var OAUTH2_SERVICE_TOKEN = Symbol("OAUTH2_SERVICE");
var JWT_UTIL_TOKEN = Symbol("JWT_UTIL");

class OAuth2Controller {
  oauth2Service;
  constructor(oauth2Service) {
    this.oauth2Service = oauth2Service;
  }
  authorize(clientId, redirectUri, state, scope) {
    const query = {
      client_id: clientId,
      redirect_uri: redirectUri,
      ...state && { state },
      ...scope && { scope }
    };
    const request = {
      clientId: query.client_id || "",
      redirectUri: query.redirect_uri || "",
      responseType: "code",
      scope: query.scope,
      state: query.state
    };
    const validation = this.oauth2Service.validateAuthorizationRequest(request);
    if (!validation.valid) {
      throw new Error(`Invalid authorization request: ${validation.error}`);
    }
    const userId = "user-1";
    const code = this.oauth2Service.generateAuthorizationCode(request.clientId, request.redirectUri, userId, request.scope);
    const redirectUrl = new URL(request.redirectUri);
    redirectUrl.searchParams.set("code", code);
    if (request.state) {
      redirectUrl.searchParams.set("state", request.state);
    }
    return ResponseBuilder.redirect(redirectUrl.toString());
  }
  async token(body) {
    const request = {
      code: body.code || "",
      clientId: body.client_id || "",
      clientSecret: body.client_secret || "",
      redirectUri: body.redirect_uri || "",
      grantType: body.grant_type || "authorization_code",
      refreshToken: body.refresh_token
    };
    if (request.grantType === "authorization_code") {
      const tokenResponse = await this.oauth2Service.exchangeCodeForToken(request);
      if (!tokenResponse) {
        return {
          error: "invalid_grant",
          error_description: "Invalid authorization code"
        };
      }
      return tokenResponse;
    }
    if (request.grantType === "refresh_token" && request.refreshToken) {
      const tokenResponse = await this.oauth2Service.refreshToken(request.refreshToken);
      if (!tokenResponse) {
        return {
          error: "invalid_grant",
          error_description: "Invalid refresh token"
        };
      }
      return tokenResponse;
    }
    return {
      error: "unsupported_grant_type",
      error_description: "Unsupported grant type"
    };
  }
  userinfo() {
    return {
      sub: "user-1",
      username: "alice",
      roles: ["user"]
    };
  }
}
__legacyDecorateClassTS([
  GET("/authorize"),
  __legacyDecorateParamTS(0, Query("client_id")),
  __legacyDecorateParamTS(1, Query("redirect_uri")),
  __legacyDecorateParamTS(2, Query("state")),
  __legacyDecorateParamTS(3, Query("scope")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    String,
    String,
    String,
    String
  ]),
  __legacyMetadataTS("design:returntype", undefined)
], OAuth2Controller.prototype, "authorize", null);
__legacyDecorateClassTS([
  POST("/token"),
  __legacyDecorateParamTS(0, Body()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    typeof Record === "undefined" ? Object : Record
  ]),
  __legacyMetadataTS("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], OAuth2Controller.prototype, "token", null);
__legacyDecorateClassTS([
  GET("/userinfo"),
  Auth(),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", []),
  __legacyMetadataTS("design:returntype", undefined)
], OAuth2Controller.prototype, "userinfo", null);
OAuth2Controller = __legacyDecorateClassTS([
  Controller("/oauth2"),
  Injectable(),
  __legacyDecorateParamTS(0, Inject(OAUTH2_SERVICE_TOKEN)),
  __legacyMetadataTS("design:paramtypes", [
    typeof OAuth2Service === "undefined" ? Object : OAuth2Service
  ])
], OAuth2Controller);

// src/security/security-module.ts
class SecurityModule {
  static forRoot(config) {
    const jwtUtil = new JWTUtil(config.jwt);
    const userProvider = config.userProvider ? async (userId) => config.userProvider.findById(userId) : undefined;
    const oauth2Service = new OAuth2Service(jwtUtil, config.oauth2Clients || [], {}, userProvider);
    const authenticationManager = new AuthenticationManager;
    authenticationManager.registerProvider(new JwtAuthenticationProvider(jwtUtil));
    authenticationManager.registerProvider(new OAuth2AuthenticationProvider(oauth2Service, jwtUtil));
    const securityFilter = createSecurityFilter({
      authenticationManager,
      excludePaths: [
        ...config.excludePaths || [],
        ...config.enableOAuth2Endpoints !== false ? [config.oauth2Prefix || "/oauth2"] : []
      ],
      defaultAuthRequired: config.defaultAuthRequired ?? false
    });
    const controllers = [];
    const providers = [];
    const middlewares = [];
    if (config.enableOAuth2Endpoints !== false) {
      controllers.push(OAuth2Controller);
    }
    providers.push({
      provide: JWT_UTIL_TOKEN,
      useValue: jwtUtil
    }, {
      provide: OAUTH2_SERVICE_TOKEN,
      useValue: oauth2Service
    }, {
      provide: AuthenticationManager,
      useValue: authenticationManager
    });
    middlewares.push(securityFilter);
    const existingMetadata = Reflect.getMetadata(MODULE_METADATA_KEY, SecurityModule) || {};
    const metadata = {
      ...existingMetadata,
      controllers: [...existingMetadata.controllers || [], ...controllers],
      providers: [...existingMetadata.providers || [], ...providers],
      middlewares: [...existingMetadata.middlewares || [], ...middlewares],
      exports: [
        ...existingMetadata.exports || [],
        JWT_UTIL_TOKEN,
        OAUTH2_SERVICE_TOKEN,
        AuthenticationManager
      ]
    };
    Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, SecurityModule);
    return SecurityModule;
  }
}
SecurityModule = __legacyDecorateClassTS([
  Module({
    controllers: [],
    providers: [],
    middlewares: []
  })
], SecurityModule);
// src/config/service.ts
class ConfigService {
  config;
  namespace;
  constructor(config, namespace) {
    this.config = config;
    this.namespace = namespace;
  }
  getAll() {
    return this.config;
  }
  get(key, defaultValue) {
    const namespacedKey = this.applyNamespace(key);
    const value = this.getValueByPath(this.config, namespacedKey);
    if (value === undefined) {
      return defaultValue;
    }
    return value;
  }
  getRequired(key) {
    const value = this.get(key);
    if (value === undefined) {
      throw new Error(`Config value required for key: ${key}`);
    }
    return value;
  }
  withNamespace(namespace) {
    return new ConfigService(this.config, namespace);
  }
  applyNamespace(key) {
    if (!this.namespace) {
      return key;
    }
    if (!key) {
      return this.namespace;
    }
    if (key.startsWith(this.namespace + ".")) {
      return key;
    }
    return `${this.namespace}.${key}`;
  }
  getValueByPath(obj, path) {
    if (!path) {
      return obj;
    }
    const segments = path.split(".");
    let current = obj;
    for (const segment of segments) {
      if (current === undefined || current === null || typeof current !== "object") {
        return;
      }
      current = current[segment];
    }
    return current;
  }
}

// src/config/types.ts
var CONFIG_SERVICE_TOKEN = Symbol("@dangao/bun-server:config:service");

// src/config/config-module.ts
class ConfigModule {
  static forRoot(options = {}) {
    const providers2 = [];
    const env = ConfigModule.snapshotEnv();
    const defaultConfig = options.defaultConfig ?? {};
    const loadedConfig = options.load ? options.load(env) : {};
    const mergedConfig = {
      ...defaultConfig,
      ...loadedConfig
    };
    const service = new ConfigService(mergedConfig, options.namespace);
    if (options.validate) {
      options.validate(mergedConfig);
    }
    providers2.push({
      provide: CONFIG_SERVICE_TOKEN,
      useValue: service
    }, ConfigService);
    const existingMetadata = Reflect.getMetadata(MODULE_METADATA_KEY, ConfigModule) || {};
    const metadata = {
      ...existingMetadata,
      providers: [...existingMetadata.providers || [], ...providers2],
      exports: [
        ...existingMetadata.exports || [],
        CONFIG_SERVICE_TOKEN,
        ConfigService
      ]
    };
    Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, ConfigModule);
    return ConfigModule;
  }
  static snapshotEnv() {
    const env = {};
    for (const [key, value] of Object.entries(process.env)) {
      env[key] = value;
    }
    return env;
  }
}
ConfigModule = __legacyDecorateClassTS([
  Module({
    providers: []
  })
], ConfigModule);
// src/health/types.ts
var HEALTH_INDICATORS_TOKEN = Symbol("@dangao/bun-server:health:indicators");
var HEALTH_OPTIONS_TOKEN = Symbol("@dangao/bun-server:health:options");

// src/health/controller.ts
class HealthController {
  indicators;
  options;
  constructor(indicators = [], options) {
    this.indicators = indicators;
    this.options = options;
  }
  async health() {
    return await this.checkIndicators();
  }
  async ready() {
    return await this.checkIndicators();
  }
  async checkIndicators() {
    const details = {};
    for (const indicator of this.indicators || []) {
      try {
        const result = await indicator.check();
        details[indicator.name] = result;
      } catch (error) {
        details[indicator.name] = {
          status: "down",
          details: {
            error: error.message
          }
        };
      }
    }
    const allUp = Object.keys(details).length === 0 || Object.values(details).every((result) => result.status === "up");
    return {
      status: allUp ? "up" : "down",
      details
    };
  }
}
__legacyDecorateClassTS([
  GET("/health"),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", []),
  __legacyMetadataTS("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], HealthController.prototype, "health", null);
__legacyDecorateClassTS([
  GET("/ready"),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", []),
  __legacyMetadataTS("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], HealthController.prototype, "ready", null);
HealthController = __legacyDecorateClassTS([
  Controller("/"),
  __legacyDecorateParamTS(0, Inject(HEALTH_INDICATORS_TOKEN)),
  __legacyDecorateParamTS(1, Inject(HEALTH_OPTIONS_TOKEN)),
  __legacyMetadataTS("design:paramtypes", [
    Array,
    typeof HealthModuleOptions === "undefined" ? Object : HealthModuleOptions
  ])
], HealthController);

// src/health/health-module.ts
class HealthModule {
  static forRoot(options = {}) {
    const providers2 = [];
    const indicators = options.indicators ?? [];
    providers2.push({
      provide: HEALTH_INDICATORS_TOKEN,
      useValue: indicators
    }, {
      provide: HEALTH_OPTIONS_TOKEN,
      useValue: options
    });
    const existingMetadata = Reflect.getMetadata(MODULE_METADATA_KEY, HealthModule) || {};
    const metadata = {
      ...existingMetadata,
      controllers: [...existingMetadata.controllers || [], HealthController],
      providers: [...existingMetadata.providers || [], ...providers2],
      exports: [
        ...existingMetadata.exports || [],
        HEALTH_INDICATORS_TOKEN,
        HEALTH_OPTIONS_TOKEN
      ]
    };
    Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, HealthModule);
    return HealthModule;
  }
}
HealthModule = __legacyDecorateClassTS([
  Module({
    controllers: [HealthController],
    providers: []
  })
], HealthModule);
// src/metrics/collector.ts
class MetricsCollector {
  counters = new Map;
  gauges = new Map;
  histograms = new Map;
  customMetrics = [];
  registerCustomMetric(metric) {
    this.customMetrics.push(metric);
  }
  incrementCounter(name, labels, value = 1) {
    const key = this.getKey(name, labels);
    const counterMap = this.counters.get(name) || new Map;
    const current = counterMap.get(key) || 0;
    counterMap.set(key, current + value);
    this.counters.set(name, counterMap);
  }
  setGauge(name, labels, value) {
    const key = this.getKey(name, labels);
    const gaugeMap = this.gauges.get(name) || new Map;
    gaugeMap.set(key, value);
    this.gauges.set(name, gaugeMap);
  }
  observeHistogram(name, labels, value) {
    const key = this.getKey(name, labels);
    const histogramMap = this.histograms.get(name) || new Map;
    const values = histogramMap.get(key) || [];
    values.push(value);
    histogramMap.set(key, values);
    this.histograms.set(name, histogramMap);
  }
  async getAllDataPoints() {
    const dataPoints = [];
    for (const [name, counterMap] of this.counters.entries()) {
      for (const [key, value] of counterMap.entries()) {
        const labels = this.parseKey(key);
        dataPoints.push({
          name,
          type: "counter",
          value,
          labels: labels && Object.keys(labels).length > 0 ? labels : undefined
        });
      }
    }
    for (const [name, gaugeMap] of this.gauges.entries()) {
      for (const [key, value] of gaugeMap.entries()) {
        const labels = this.parseKey(key);
        dataPoints.push({
          name,
          type: "gauge",
          value,
          labels: labels && Object.keys(labels).length > 0 ? labels : undefined
        });
      }
    }
    for (const [name, histogramMap] of this.histograms.entries()) {
      for (const [key, values] of histogramMap.entries()) {
        const labels = this.parseKey(key);
        const sum = values.reduce((a, b) => a + b, 0);
        const count = values.length;
        const buckets = this.calculateBuckets(values);
        dataPoints.push({
          name: `${name}_sum`,
          type: "histogram",
          value: sum,
          labels: labels && Object.keys(labels).length > 0 ? labels : undefined
        });
        dataPoints.push({
          name: `${name}_count`,
          type: "histogram",
          value: count,
          labels: labels && Object.keys(labels).length > 0 ? labels : undefined
        });
        for (const [bucket, bucketCount] of Object.entries(buckets)) {
          dataPoints.push({
            name: `${name}_bucket`,
            type: "histogram",
            value: bucketCount,
            labels: {
              ...labels,
              le: bucket
            }
          });
        }
      }
    }
    for (const metric of this.customMetrics) {
      try {
        const value = await metric.getValue();
        dataPoints.push({
          name: metric.name,
          type: metric.type,
          value,
          help: metric.help
        });
      } catch (error) {
        console.error(`Failed to collect custom metric ${metric.name}:`, error);
      }
    }
    return dataPoints;
  }
  reset() {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
  }
  getKey(name, labels) {
    if (!labels || Object.keys(labels).length === 0) {
      return "";
    }
    const sortedLabels = Object.keys(labels).sort().map((key) => `${key}="${labels[key]}"`).join(",");
    return `{${sortedLabels}}`;
  }
  parseKey(key) {
    if (!key || key === "") {
      return;
    }
    const labels = {};
    const match = key.match(/\{([^}]+)\}/);
    if (match) {
      const labelPairs = match[1].split(",");
      for (const pair of labelPairs) {
        const [k, v] = pair.split("=");
        if (k && v) {
          labels[k.trim()] = v.trim().replace(/^"|"$/g, "");
        }
      }
    }
    return Object.keys(labels).length > 0 ? labels : undefined;
  }
  calculateBuckets(values) {
    const defaultBuckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];
    const buckets = {};
    for (const bucket of defaultBuckets) {
      buckets[bucket.toString()] = values.filter((v) => v <= bucket).length;
    }
    buckets["+Inf"] = values.length;
    return buckets;
  }
}

// src/metrics/prometheus.ts
class PrometheusFormatter {
  format(dataPoints) {
    const lines = [];
    const metricGroups = this.groupByMetricName(dataPoints);
    for (const [metricName, points] of metricGroups.entries()) {
      const help = points[0]?.help;
      if (help) {
        lines.push(`# HELP ${metricName} ${help}`);
      }
      const type = points[0]?.type;
      if (type) {
        lines.push(`# TYPE ${metricName} ${type}`);
      }
      for (const point of points) {
        const labelString = this.formatLabels(point.labels);
        const line = labelString ? `${point.name}${labelString} ${point.value}` : `${point.name} ${point.value}`;
        lines.push(line);
      }
      lines.push("");
    }
    return lines.join(`
`);
  }
  groupByMetricName(dataPoints) {
    const groups = new Map;
    for (const point of dataPoints) {
      const name = point.name;
      const existing = groups.get(name) || [];
      existing.push(point);
      groups.set(name, existing);
    }
    return groups;
  }
  formatLabels(labels) {
    if (!labels || Object.keys(labels).length === 0) {
      return "";
    }
    const labelPairs = Object.keys(labels).sort().map((key) => `${key}="${this.escapeLabelValue(labels[key])}"`).join(",");
    return `{${labelPairs}}`;
  }
  escapeLabelValue(value) {
    return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\n");
  }
}

// src/metrics/types.ts
var METRICS_SERVICE_TOKEN = Symbol("@dangao/bun-server:metrics:service");
var METRICS_OPTIONS_TOKEN = Symbol("@dangao/bun-server:metrics:options");

// src/metrics/controller.ts
class MetricsController {
  collector;
  options;
  formatter;
  constructor(collector, options) {
    this.collector = collector;
    this.options = options;
    this.formatter = new PrometheusFormatter;
  }
  async metrics() {
    const dataPoints = await this.collector.getAllDataPoints();
    const prometheusText = this.formatter.format(dataPoints);
    return new Response(prometheusText, {
      headers: {
        "Content-Type": "text/plain; version=0.0.4; charset=utf-8"
      }
    });
  }
}
__legacyDecorateClassTS([
  GET("/metrics"),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", []),
  __legacyMetadataTS("design:returntype", typeof Promise === "undefined" ? Object : Promise)
], MetricsController.prototype, "metrics", null);
MetricsController = __legacyDecorateClassTS([
  Controller("/"),
  __legacyDecorateParamTS(0, Inject(METRICS_SERVICE_TOKEN)),
  __legacyDecorateParamTS(1, Inject(METRICS_OPTIONS_TOKEN)),
  __legacyMetadataTS("design:paramtypes", [
    typeof MetricsCollector === "undefined" ? Object : MetricsCollector,
    typeof MetricsModuleOptions === "undefined" ? Object : MetricsModuleOptions
  ])
], MetricsController);

// src/metrics/metrics-module.ts
class MetricsModule {
  static forRoot(options = {}) {
    const providers2 = [];
    const collector = new MetricsCollector;
    if (options.customMetrics) {
      for (const metric of options.customMetrics) {
        collector.registerCustomMetric(metric);
      }
    }
    providers2.push({
      provide: METRICS_SERVICE_TOKEN,
      useValue: collector
    }, {
      provide: METRICS_OPTIONS_TOKEN,
      useValue: options
    }, MetricsCollector);
    const existingMetadata = Reflect.getMetadata(MODULE_METADATA_KEY, MetricsModule) || {};
    const metadata = {
      ...existingMetadata,
      controllers: [...existingMetadata.controllers || [], MetricsController],
      providers: [...existingMetadata.providers || [], ...providers2],
      exports: [
        ...existingMetadata.exports || [],
        METRICS_SERVICE_TOKEN,
        MetricsCollector
      ]
    };
    Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, MetricsModule);
    return MetricsModule;
  }
}
MetricsModule = __legacyDecorateClassTS([
  Module({
    controllers: [MetricsController],
    providers: []
  })
], MetricsModule);
// src/metrics/middleware.ts
function createHttpMetricsMiddleware(collector) {
  return async (context2, next) => {
    const startTime = Date.now();
    const response = await next();
    const duration = Date.now() - startTime;
    const durationSeconds = duration / 1000;
    const method = context2.method;
    const path = context2.path;
    const statusCode = response.status;
    collector.incrementCounter("http_requests_total", {
      method,
      path,
      status: statusCode.toString()
    });
    collector.observeHistogram("http_request_duration_seconds", {
      method,
      path,
      status: statusCode.toString()
    }, durationSeconds);
    collector.observeHistogram("http_request_duration_seconds_summary", {
      method,
      path
    }, durationSeconds);
    return response;
  };
}
// src/testing/harness.ts
import { performance as performance2 } from "perf_hooks";

class PerformanceHarness {
  static async benchmark(name, iterations, runner) {
    if (iterations <= 0) {
      throw new Error("iterations must be greater than 0");
    }
    const start = performance2.now();
    for (let i = 0;i < iterations; i++) {
      await runner(i);
    }
    const durationMs = performance2.now() - start;
    const opsPerSecond = iterations / Math.max(durationMs / 1000, 0.0001);
    return {
      name,
      iterations,
      durationMs,
      opsPerSecond
    };
  }
}

class StressTester {
  static async run(name, iterations, concurrency, task) {
    if (iterations <= 0) {
      throw new Error("iterations must be greater than 0");
    }
    if (concurrency <= 0) {
      throw new Error("concurrency must be greater than 0");
    }
    let next = 0;
    let errors = 0;
    const start = performance2.now();
    const worker = async () => {
      while (true) {
        const current = next;
        next += 1;
        if (current >= iterations) {
          break;
        }
        try {
          await task(current);
        } catch (error) {
          errors += 1;
        }
      }
    };
    const workers = Array.from({ length: Math.min(concurrency, iterations) }, () => worker());
    await Promise.all(workers);
    const durationMs = performance2.now() - start;
    return {
      name,
      iterations,
      concurrency: Math.min(concurrency, iterations),
      durationMs,
      errors
    };
  }
}
export {
  requiresAuth,
  getAuthMetadata,
  createUserKeyGenerator,
  createTokenKeyGenerator,
  createSwaggerUIMiddleware,
  createStaticFileMiddleware,
  createSecurityFilter,
  createRequestLoggingMiddleware,
  createRateLimitMiddleware,
  createLoggerMiddleware,
  createHttpMetricsMiddleware,
  createFileUploadMiddleware,
  createErrorHandlingMiddleware,
  createCorsMiddleware,
  checkRoles,
  WebSocketGatewayRegistry,
  WebSocketGateway,
  ValidationError,
  Validate,
  UseMiddleware,
  UnauthorizedException,
  SwaggerModule,
  SwaggerGenerator,
  SwaggerExtension,
  StressTester,
  SecurityModule,
  SecurityContextHolder,
  Router,
  RouteRegistry,
  Route,
  RoleBasedAccessDecisionManager,
  ResponseBuilder,
  RequestWrapper,
  RateLimit,
  Query,
  PrometheusFormatter,
  PerformanceHarness,
  ParamBinder,
  Param,
  PUT,
  POST,
  PATCH,
  OnOpen,
  OnMessage,
  OnClose,
  OAuth2Service,
  OAuth2Controller,
  OAuth2AuthenticationProvider,
  OAUTH2_SERVICE_TOKEN,
  NotFoundException,
  ModuleRegistry,
  Module,
  MinLength,
  MiddlewarePipeline,
  MetricsModule,
  MetricsCollector,
  METRICS_SERVICE_TOKEN,
  METRICS_OPTIONS_TOKEN,
  LoggerModule,
  LoggerExtension,
  LogLevel2 as LogLevel,
  Lifecycle,
  LOGGER_TOKEN,
  JwtAuthenticationProvider,
  JWT_UTIL_TOKEN,
  JWTUtil,
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  InternalServerErrorException,
  Injectable,
  Inject,
  HttpException,
  HealthModule,
  Header,
  HEALTH_OPTIONS_TOKEN,
  HEALTH_INDICATORS_TOKEN,
  GET,
  ForbiddenException,
  ExceptionFilterRegistry,
  DELETE,
  ControllerRegistry,
  Controller,
  Context,
  Container,
  ConfigService,
  ConfigModule,
  CONFIG_SERVICE_TOKEN,
  BunServer,
  BodyParser,
  Body,
  BadRequestException,
  AuthenticationManager,
  Auth,
  Application,
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiOperation,
  ApiBody
};
