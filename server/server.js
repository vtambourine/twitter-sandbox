var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

const STATIC_DIRECTORY = 'static';

var app = http.createServer(function (request, response) {
    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), STATIC_DIRECTORY, uri);

    fs.exists(filename, function (exists) {
        if (exists) {
            fs.stat(filename, function (error, stats) {
                if (stats.isDirectory()) {
                    filename = path.join(filename, 'index.html');
                }
                fs.readFile(filename, function (error, data) {
                    if (error) {
                        response.writeHead(500, { 'Content-Type': 'text/plain' });
                        response.end(error + '\n');
                    } else {
                        response.writeHead(200);
                        response.end(data);
                    }
                })
            })
        } else {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('404 Not Found\n');
        }
    });
});

app.listen(8080);
console.log('Server running at http://127.0.0.1:8080');
