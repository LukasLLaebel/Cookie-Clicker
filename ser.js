import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
};

const server = createServer(async (req, res) => {
  try {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    const fullPath = join(__dirname, 'Clicker', filePath);
    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';

    const content = await readFile(fullPath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('listening on 127.0.0.1:3000');
});
