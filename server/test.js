// Create express app.
const express = require('express');
const app = express();

// Create HTMl server using express.
const http = require('http');
const server = http.createServer(app);

// Create socket server.
const { Server } = require("socket.io");
const io = new Server(server);

// Test data.
const testJson = require('./extract.json');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/static/'));

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

// When the web server is listening...
server.on('listening', function () {
    console.log('Server listening on 3000 port');

    let interval, line = 0;
    interval = setInterval(() => {
        // Emit line
        console.log(line, testJson.data[line]);
        io.emit('sonar', testJson.data[line]);

        // Increment line.
        if (line === testJson.data.length) {
            line = 0;
        } else {
            line += 1;
        }
    }, 100)
});

// Handle exits.
function exitHandler(options, exitCode) {
    console.log('process exiting.');
    io.close();
    server.close();
    if (options.exit) process.exit(exitCode || 0);
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));