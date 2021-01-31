const http = require('http');

let server = http.createServer(
    (request, response) => {
        response.end('Hello World!');
    }
);

server.listen(3000);
