const http = require('http');

const server = http.createServer(
    (request, response) => {
        response.setHeader('Content-Type', 'text/html');
        response.write('<!DOCTYPE html><html lang="ja">');
        response.write('<head><meta charset="utf-8">');
        response.write('<title>Hello</title></head>');
        response.write('<body><h1>Hello Node.js!!!</h1>');
        response.write('<p>これは、Node.js のサンプルページです。</p>', 'utf8');
        response.write('<p>This is Node.js sample page.</p>');
        response.write('</body></html>');
        response.end();
    }
);

server.listen(3000);
console.log('Server start');
