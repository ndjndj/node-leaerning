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
            responseIndex(request, response);
            break;
        case '/other':
            responseOther(request, response);
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

var data = {
    msg: 'no message...'
}

function responseIndex(request, response) {

    if (request.method == 'POST') {
        var body = '';

        // データ受信時のイベント処理
        request.on(
              'data'
            , (data) => {body += data;}
        );

        // データ受信時のイベント処理
        request.end(
              'end'
            , () => {
                data = qs.parse(body);
                writeIndex(request, response);
            }
        );
    } else {
        writeIndex(request, response);
    }
}

function writeIndex(request, response) {
    var msg = '※伝言を表示します。';
    var content = ejs.render(
          indexPage
        , {
              title: 'Index'
            , content: msg
            , data: data
        }
    );
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(content);
    response.end();
}

var data2 = {
    'Taro': ['taro@yamada', '09-999-999', 'Tokyo']
  , 'Hanako': ['hanako@flower', '080-888-888', 'Yokohama']
  , 'Sachiko': ['sachi@happy', '070-777-777', 'Nagoya']
  , 'Ichiro': ['ichi@baseball', '060-666-666', 'USA']
}

function responseOther(request, response) {
    var msg = 'これは、Otherページです。';

    var content = ejs.render(
          otherPage
        , {
              title: 'Other'
            , content: msg
            , data: data2
            , filename: 'data-item'
        }
    )

    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(content);
    response.end();

}
