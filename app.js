const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');

const indexPage = fs.readFileSync('./index.ejs', 'utf8');
const styleCSS = fs.readFileSync('./style.css', 'utf8');
// main
const server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start');

//createServer
function getFromClient(request, response) {
    const urlParts = url.parse(request.url);

    switch (urlParts.pathname) {
        case '/':
            const content = ejs.render(
                indexPage
              , {
                    title: 'Indexページ'
                  , content: 'これはテンプレートを使ったサンプルページです。'
              }
            );
            response.writeHead(200, {'Content-Type': 'text.html'});
            response.write(content);
            response.end();
            break;
        case '/style.css':
            response.writeHead(200, {'Content-Type': 'text.html'});
            response.write(styleCSS);
            response.end();
            break;
        default:
            response.writeHead(200, {'Content-Type': 'text.html'});
            response.end('no page...');
            break;
    }
}
