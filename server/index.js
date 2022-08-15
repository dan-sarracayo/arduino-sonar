// Create express app.
const express = require('express');
const app = express();

// Create HTMl server using express.
const http = require('http');
const server = http.createServer(app);

// Create socket server.
const { Server } = require("socket.io");
const io = new Server(server);

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

// Libraries
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

// Create serial monitor and parser.
const port = new SerialPort('/dev/ttyACM1', { baudRate: 9600 });
port.on("open", () => {
    console.log('serial port open');
});

// Parser.
const parser = port.pipe(new Readline({ delimiter: '\n' }));

// When the web server is listening...
server.on('listening', function () {
    console.log('Server listening on 3000 port');

    let parsedData;

    // Read lines, and emit when we get some data.
    parser.on('data', data => {
        try {
            parsedData = JSON.parse(data);
            io.emit('sonar', parsedData);
        } catch (e) {
            console.log('Failed to parse: ', data)
        }
    });
});

// Handle serial port closing.
parser.on('close', () => {
    console.log('parser stream closed.');
    process.exit();
});

// Handle exits.
function exitHandler(options, exitCode) {
    console.log('process exiting.');
    port.destroy();
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