# Sonar

## Description

This project is a simple POC, consisiting of an arduino with a sonic sensor and a node server that serves and streams data to a radar-style GUI. The arduino sweeps an area using a sonic sensor mounted to a servo, records data at a defined number of degrees, and sends that data to the attached computer via serial. The computer then has a node process that reads that data from the serial port and streams that data to a GUI hosted via the same process. Loading the webpage gives you a GUI that represents that data in a user friendly way.

## Getting started.

Do an `npm i` in `./server/`.

You can run `node ./server/test.js` to start a demo node process with some previously captured data, skipping the entire arduino part, and getting the GUI to be served on http://localhost:3000/.

The main process is `./server/index.js`, which expects an arduino loaded with the sketch to be attached to serial port `/dev/ttyACM1` and a baud rate of 9600 (usually default).

# Arduino Pinout

| --- | ---  |
| pin | desc |
| 3   | Ping on the sonic sensor. |
| 2   | Echo on the sonic sensor. |
| 9   | Servo control |