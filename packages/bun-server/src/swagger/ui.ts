import type { Context } from '../core/context';
import type { Middleware, NextFunction } from '../middleware';
import { SwaggerExtension } from './swagger-extension';

/**
 * Swagger UI HTML 模板
 */
const SWAGGER_UI_HTML = (jsonUrl: string, title: string) => `<!DOCTYPE html>
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

/**
 * 创建 Swagger UI 中间件
 * @param extension - Swagger 扩展实例
 * @param options - 配置选项
 */
export function createSwaggerUIMiddleware(
  extension: SwaggerExtension,
  options: {
    uiPath?: string;
    jsonPath?: string;
    title?: string;
  } = {},
): Middleware {
  const uiPath = options.uiPath || '/swagger';
  const jsonPath = options.jsonPath || '/swagger.json';
  const title = options.title || 'API Documentation';

  return async (ctx: Context, next: NextFunction): Promise<Response> => {
    const url = new URL(ctx.request.url);
    const pathname = url.pathname;

    // Swagger UI 页面
    if (pathname === uiPath || pathname === `${uiPath}/`) {
      const html = SWAGGER_UI_HTML(jsonPath, title);
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // Swagger JSON
    if (pathname === jsonPath) {
      const json = extension.generateJSON();
      return new Response(json, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
    }

    return await next();
  };
}

