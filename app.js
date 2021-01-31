const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');

const indexPage = fs.readFileSync('./index.ejs', 'utf8');
const otherPage = fs.readFileSync('./other.ejs', 'utf8');
const styleCSS = fs.readFileSync('./style.css', 'utf8');
// main
const server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start');

//createServer
function getFromClient(request, response) {
    const urlParts = url.parse(request.url, true);

    switch (urlParts.pathname) {
        case '/':
            var content = 'これは、Indexページです。';
            var query = urlParts.query;
            console.log(query);
            if (query.msg != undefined) {
                content += `あなたは「${query.msg}」と送りました。`
            }
            console.log(content);

            var content = ejs.render(
                indexPage
              , {
                    title: 'Indexページ'
                  , content: content
              }
            );
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(content);
            response.end();
            break;
        case '/other':
            var content = ejs.render(
                otherPage
              , {
                    title: 'Otherページ'
                  , content: 'これは新しく用意したページです'
              }
            );
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(content);
            response.end();
            break;
        case '/style.css':
            response.writeHead(200, {'Content-Type': 'text/css'});
            response.write(styleCSS);
            response.end();
            break;
        default:
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end('no page...');
            break;
    }
}
