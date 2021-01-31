const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

const indexPage = fs.readFileSync('./index.ejs', 'utf8');
// main
const server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start');

//createServer
function getFromClient(request, response) {
    const content = ejs.render(indexPage);
    response.writeHead(200, {'Content-Type': 'text.html'});
    response.write(content);
    response.end();
}
