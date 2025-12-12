# Error Handling Guide

This document introduces the error handling system of Bun Server Framework,
including error code specifications, internationalization support, and best
practices.

## Table of Contents

- [Error Code System](#error-code-system)
- [Error Message Internationalization](#error-message-internationalization)
- [Exception Filters](#exception-filters)
- [Best Practices](#best-practices)
- [Example Code](#example-code)

---

## Error Code System

### Error Code Specification

Error codes follow a unified naming convention:

- **Format**: `MODULE_ERROR_TYPE_SPECIFIC_ERROR`
- **Use uppercase letters and underscores**
- **Module prefixes**:
  - `AUTH` - Authentication and authorization
  - `VALIDATION` - Validation
  - `DATABASE` - Database
  - `FILE` - File operations
  - `MIDDLEWARE` - Middleware
  - `OAUTH2` - OAuth2
  - `CONFIG` - Configuration

**Examples**:

- `AUTH_INVALID_TOKEN` - Invalid authentication token
- `VALIDATION_REQUIRED_FIELD` - Required field missing
- `DATABASE_CONNECTION_FAILED` - Database connection failed

### Error Code Categories

Error codes are categorized by functional modules, each category corresponds to
a numeric range:

- **1000-1999**: General errors
- **2000-2999**: Authentication and authorization errors
- **3000-3999**: Validation errors
- **4000-4999**: OAuth2 errors
- **5000-5999**: Database errors
- **6000-6999**: File operation errors
- **7000-7999**: Middleware errors
- **8000-8999**: Configuration errors

### Using Error Codes

```typescript
import { ErrorCode, HttpException } from "@dangao/bun-server";

// Method 1: Use HttpException.withCode()
throw HttpException.withCode(ErrorCode.RESOURCE_NOT_FOUND);

// Method 2: Use exception class with error code
throw new NotFoundException(
  "User not found",
  undefined,
  ErrorCode.RESOURCE_NOT_FOUND,
);

// Method 3: With custom message and details
throw HttpException.withCode(
  ErrorCode.VALIDATION_FAILED,
  "Custom validation message",
  { field: "email", reason: "Invalid format" },
);
```

---

## Error Message Internationalization

### Supported Languages

The framework supports the following languages:

- `en` - English (default)
- `zh-CN` - Simplified Chinese
- `ja` - Japanese (partial)
- `ko` - Korean (partial)

### Automatic Language Detection

The framework automatically detects user language based on the HTTP
`Accept-Language` header:

```typescript
// Request header example
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
```

### Message Template System

Error messages support template parameters using `{key}` as placeholders:

```typescript
import { ErrorCode, HttpException } from "@dangao/bun-server";

// If error message template is 'Resource {resource} not found'
throw HttpException.withCode(
  ErrorCode.RESOURCE_NOT_FOUND,
  undefined,
  undefined,
  { resource: "User" }, // Message template parameters
);
// Returns: 'Resource User not found' (English) or '资源 User 未找到' (Chinese)
```

### Manual Language Setting

```typescript
import { ErrorMessageI18n } from "@dangao/bun-server";

// Set global language
ErrorMessageI18n.setLanguage("zh-CN");

// Get error message for specific language
const message = ErrorMessageI18n.getMessage(
  ErrorCode.RESOURCE_NOT_FOUND,
  "zh-CN",
  { resource: "User" },
);
```

---

## Exception Filters

Exception filters allow you to customize error handling logic, handling specific
exception types or error codes.

### Creating Exception Filters

```typescript
import type { ExceptionFilter } from "@dangao/bun-server";
import type { Context } from "@dangao/bun-server";
import { ErrorCode, HttpException } from "@dangao/bun-server";

class CustomExceptionFilter implements ExceptionFilter {
  public catch(error: unknown, context: Context): Response | undefined {
    if (
      error instanceof HttpException &&
      error.code === ErrorCode.DATABASE_CONNECTION_FAILED
    ) {
      // Custom handling for database connection errors
      context.setStatus(503);
      return context.createResponse({
        error: "Database service temporarily unavailable",
        code: error.code,
        retryAfter: 60, // Suggest retry after 60 seconds
      });
    }

    // Return undefined to pass to next filter
    return undefined;
  }
}
```

### Registering Exception Filters

```typescript
import { ExceptionFilterRegistry } from "@dangao/bun-server";

const registry = ExceptionFilterRegistry.getInstance();
registry.register(new CustomExceptionFilter());
```

### Filter Execution Order

Exception filters execute in registration order, the first filter returning a
non-`undefined` result will be used.

---

## Best Practices

### 1. Use Error Codes

**Recommended** ✅:

```typescript
throw HttpException.withCode(ErrorCode.RESOURCE_NOT_FOUND);
```

**Not Recommended** ❌:

```typescript
throw new Error("Resource not found");
```

### 2. Provide Error Details

For validation errors, provide detailed error information:

```typescript
throw HttpException.withCode(
  ErrorCode.VALIDATION_FAILED,
  "Validation failed",
  {
    field: "email",
    reason: "Invalid email format",
    value: userInput.email,
  },
);
```

### 3. Use Message Template Parameters

For error messages requiring dynamic information, use message template
parameters:

```typescript
throw HttpException.withCode(
  ErrorCode.RESOURCE_NOT_FOUND,
  undefined,
  undefined,
  { resource: "User", id: userId },
);
```

### 4. Custom Exception Filters

For errors requiring special handling, use exception filters:

```typescript
class DatabaseExceptionFilter implements ExceptionFilter {
  public catch(error: unknown, context: Context): Response | undefined {
    if (
      error instanceof HttpException &&
      error.code?.startsWith("DATABASE_")
    ) {
      // Unified handling for all database errors
      return context.createResponse({
        error: "Database error occurred",
        code: error.code,
        timestamp: new Date().toISOString(),
      });
    }
    return undefined;
  }
}
```

### 5. Production Error Handling

In production environments, avoid exposing sensitive information:

```typescript
// Error handler automatically handles this
// In production, non-HttpException errors won't expose detailed information
if (process.env.NODE_ENV === "production") {
  // Only return generic error message
  return context.createResponse({
    error: "Internal Server Error",
  });
}
```

### 6. Error Logging

Log errors in exception filters:

```typescript
class LoggingExceptionFilter implements ExceptionFilter {
  public catch(error: unknown, context: Context): Response | undefined {
    // Log error
    console.error("Error occurred:", {
      error,
      path: context.getPath(),
      method: context.getMethod(),
      timestamp: new Date().toISOString(),
    });

    return undefined; // Continue to next filter
  }
}
```

---

## Example Code

### Complete Error Handling Example

```typescript
import {
  Application,
  type Context,
  Controller,
  ErrorCode,
  ExceptionFilter,
  ExceptionFilterRegistry,
  GET,
  HttpException,
  Param,
} from "@dangao/bun-server";

// 1. Create custom exception filter
class ApiExceptionFilter implements ExceptionFilter {
  public catch(error: unknown, context: Context): Response | undefined {
    if (error instanceof HttpException) {
      // Add request ID and timestamp
      return context.createResponse({
        error: error.message,
        code: error.code,
        details: error.details,
        requestId: context.getHeader("x-request-id"),
        timestamp: new Date().toISOString(),
      });
    }
    return undefined;
  }
}

// 2. Register exception filter
const registry = ExceptionFilterRegistry.getInstance();
registry.register(new ApiExceptionFilter());

// 3. Use error codes in controller
@Controller("/api/users")
class UserController {
  @GET("/:id")
  public async getUser(@Param("id") id: string) {
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      throw HttpException.withCode(
        ErrorCode.VALIDATION_INVALID_FORMAT,
        "Invalid user ID format",
        { field: "id", value: id },
      );
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      throw HttpException.withCode(
        ErrorCode.RESOURCE_NOT_FOUND,
        undefined,
        undefined,
        { resource: "User", id: userId },
      );
    }

    return user;
  }
}

// 4. Start application
const app = new Application();
app.registerController(UserController);
app.listen();
```

### Database Error Handling Example

```typescript
import { ErrorCode, HttpException } from "@dangao/bun-server";

try {
  await database.query("SELECT * FROM users WHERE id = ?", [userId]);
} catch (error) {
  if (error.code === "SQLITE_ERROR") {
    throw HttpException.withCode(
      ErrorCode.DATABASE_QUERY_FAILED,
      "Failed to query user",
      { sql: error.sql, params: [userId] },
    );
  }
  throw error;
}
```

### Validation Error Handling Example

```typescript
import { ErrorCode, HttpException } from "@dangao/bun-server";

if (!email || !isValidEmail(email)) {
  throw HttpException.withCode(
    ErrorCode.VALIDATION_INVALID_FORMAT,
    "Invalid email format",
    {
      field: "email",
      value: email,
      expected: "valid email address",
    },
  );
}
```

---

## Error Code Reference

### General Errors (1000-1999)

- `INTERNAL_ERROR` - Internal server error
- `INVALID_REQUEST` - Invalid request
- `RESOURCE_NOT_FOUND` - Resource not found
- `METHOD_NOT_ALLOWED` - Method not allowed
- `RATE_LIMIT_EXCEEDED` - Rate limit exceeded
- `SERVICE_UNAVAILABLE` - Service unavailable
- `TIMEOUT` - Request timeout

### Authentication and Authorization Errors (2000-2999)

- `AUTH_REQUIRED` - Authentication required
- `AUTH_INVALID_TOKEN` - Invalid authentication token
- `AUTH_TOKEN_EXPIRED` - Authentication token expired
- `AUTH_INSUFFICIENT_PERMISSIONS` - Insufficient permissions
- `AUTH_INVALID_CREDENTIALS` - Invalid credentials
- `AUTH_ACCOUNT_LOCKED` - Account locked
- `AUTH_ACCOUNT_DISABLED` - Account disabled

### Validation Errors (3000-3999)

- `VALIDATION_FAILED` - Validation failed
- `VALIDATION_REQUIRED_FIELD` - Required field missing
- `VALIDATION_INVALID_FORMAT` - Invalid format
- `VALIDATION_OUT_OF_RANGE` - Value out of range
- `VALIDATION_TYPE_MISMATCH` - Type mismatch
- `VALIDATION_CONSTRAINT_VIOLATION` - Constraint violation

### Database Errors (5000-5999)

- `DATABASE_CONNECTION_FAILED` - Database connection failed
- `DATABASE_QUERY_FAILED` - Database query failed
- `DATABASE_TRANSACTION_FAILED` - Database transaction failed
- `DATABASE_CONSTRAINT_VIOLATION` - Database constraint violation
- `DATABASE_TIMEOUT` - Database timeout
- `DATABASE_POOL_EXHAUSTED` - Database connection pool exhausted
- `DATABASE_MIGRATION_FAILED` - Database migration failed

### File Operation Errors (6000-6999)

- `FILE_NOT_FOUND` - File not found
- `FILE_UPLOAD_FAILED` - File upload failed
- `FILE_DOWNLOAD_FAILED` - File download failed
- `FILE_SIZE_EXCEEDED` - File size exceeded
- `FILE_TYPE_NOT_ALLOWED` - File type not allowed
- `FILE_ACCESS_DENIED` - File access denied
- `FILE_PATH_TRAVERSAL` - Path traversal attack detected

For a complete list of error codes, refer to `src/error/error-codes.ts`.

---

## Related Resources

- [API Documentation](./api.md)
- [User Guide](./guide.md)
- [Best Practices](./best-practices.md)
