const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

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
            if (query.msg != undefined) {
                content += `あなたは「${query.msg}」と送りました。`
            }

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

function responseIndex(request, response) {
    const msg = 'これは、Indexページです。';
    const content = ejs.render(
        indexPage
      , {
            title: 'Index'
          , content: msg
      }
    );
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(content);
    response.end();
}

function responseOther(request, response) {
    var msg = 'これは、Otherページです。';

    //POST アクセス時の処理
    if (request.method == 'POST') {
        let body = '';

        // データ受信時のイベント処理
        request.on(
              'data'
            , (data) => {body += data;}
        )
    }

    //データ受信終了のイベント処理
    request.on(
          'end'
        , () => {
            let postData = qs.parse(body);
            msg += `あなたは、「${postData.msg}」と書きました。`;
            const content = ejs.render(
                  otherPage
                , {
                      title: 'Other'
                    , content: msg
                }
            );
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(content);
            response.end();
        }
    );
}
