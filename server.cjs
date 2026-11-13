'use strict';
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const root = __dirname;
const port = Number(process.env.PORT || 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT 必须是 1–65535 之间的整数。');
  process.exit(1);
}
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

function insideRoot(file) {
  const relative = path.relative(root, file);
  return relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative);
}

const server = http.createServer(async (request, response) => {
  function send(status, body) {
    response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : body);
  }
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.setHeader('Allow', 'GET, HEAD');
    return send(405, '仅支持 GET 与 HEAD 请求。');
  }
  let requested;
  try {
    requested = decodeURIComponent((request.url || '/').split('?')[0]).replaceAll('\\', '/');
  } catch {
    return send(400, '无效的地址编码。');
  }
  const segments = requested.split('/');
  if (requested.includes('\0') || segments.some(segment => segment.startsWith('.'))) {
    return send(403, '禁止访问此路径。');
  }
  if (requested.endsWith('/')) requested += 'index.html';
  const file = path.resolve(root, '.' + requested);
  const contentType = mime[path.extname(file).toLowerCase()];
  if (!insideRoot(file) || !contentType) return send(403, '禁止访问此文件。');
  try {
    const real = await fs.realpath(file);
    if (!insideRoot(real)) return send(403, '禁止访问目录之外的文件。');
    const stats = await fs.stat(real);
    if (!stats.isFile()) return send(404, '页面不存在。');
    const contents = request.method === 'HEAD' ? undefined : await fs.readFile(real);
    response.writeHead(200, {
      'Content-Type': contentType, 'Content-Length': stats.size,
      'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'
    });
    response.end(contents);
  } catch (error) {
    send(error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 500, '页面无法读取。');
  }
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `端口 ${port} 已被占用。请关闭原服务，或在 PowerShell 中运行 $env:PORT=4174 后重试。`
    : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`光影手记已启动：http://127.0.0.1:${port}`);
  console.log('仅本机访问；按 Ctrl+C 停止。');
});
