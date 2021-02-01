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
