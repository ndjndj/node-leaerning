const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

const indexPage = fs.readFileSync('./index.ejs', 'utf8');
const loginPage = fs.readFileSync('./login.ejs', 'utf8');

const maxNum = 10;
const fileName = 'mydata.txt';
var messageData;
readFromFile(fileName);

const server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start');

function getFromClient(request, response) {
    const urlParts = url.parse(request.url, true);

    switch (urlParts.pathname) {
        case '/':
            responseIndex(request, response);
            break;
        case '/login':
            responseLogin(request, response);
            break;
        default:
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end('no page...');
            break;
    }
}

function responseLogin(request, response) {
    const content = ejs.render(loginPage, {});
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(content);
    response.end();
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
        request.on(
              'end'
            , () => {
                data = qs.parse(body);
                addToData(data.id, data.msg, fileName, request);
                writeIndex(request, response);
            }
        );
    } else {
        writeIndex(request, response);
    }
}

function writeIndex(request, response) {
    var msg = '※何かメッセージを書いてください。';
    const content = ejs.render(
          indexPage
        , {
              title: 'Index'
            , content: msg
            , data: messageData
            , fileName: 'data-item'
        }
    );
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(content);
    response.end();
}

function addToData(id, msg, fname, request) {
    const obj = {'id': id, 'msg': msg};
    const objStr = JSON.stringify(obj);
    console.log(`add data: ${objStr}`);
    messageData.unshift(objStr);
    if (messageData.length > maxNum) {
        messageData.pop();
    }
    saveToFile(fname);
}

function saveToFile(fname) {
    const dataStr = messageData.join('\n');
    fs.writeFile(
          fname
        , dataStr
        , (err) => {
            if (err) {
                throw err;
            }
        }
    );
}
