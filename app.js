const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

// main
const server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start');

//createServer
function getFromClient(req, res) {
    request = req;
    response = res;
    fs.readFile(
          './index.html'
        , 'UTF-8'
        , (error, data) => {
            response.writeHead(200, {'Content-Type': 'text.html'});
            response.write(data);
            response.end();
        }
    );
}
