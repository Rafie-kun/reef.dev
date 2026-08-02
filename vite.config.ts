import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function apiServerPlugin(): Plugin {
  return {
    name: 'api-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        try {
          const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
          let pathname = urlObj.pathname;
          if (!pathname.endsWith('.js')) {
            pathname += '.js';
          }

          const filePath = path.join(__dirname, pathname);
          if (!fs.existsSync(filePath)) {
            return next();
          }

          const query: Record<string, string> = {};
          urlObj.searchParams.forEach((val, key) => {
            query[key] = val;
          });
          (req as any).query = query;

          if (!(res as any).status) {
            (res as any).status = function (code: number) {
              res.statusCode = code;
              return res;
            };
          }
          if (!(res as any).json) {
            (res as any).json = function (data: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };
          }
          if (!(res as any).send) {
            (res as any).send = function (data: any) {
              if (typeof data === 'object') {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              } else {
                res.end(String(data));
              }
              return res;
            };
          }

          if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
            const buffers: Buffer[] = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const bodyStr = Buffer.concat(buffers).toString('utf-8');
            try {
              (req as any).body = JSON.parse(bodyStr);
            } catch {
              (req as any).body = bodyStr;
            }
          }

          const module = await server.ssrLoadModule(filePath);
          const handler = module.default;
          if (typeof handler === 'function') {
            await handler(req, res);
          } else {
            next();
          }
        } catch (err: any) {
          console.error('API Middleware Error:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          admin: path.resolve(__dirname, 'admin.html'),
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
