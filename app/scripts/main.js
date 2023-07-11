// // /**
// //  * scripts/main.js
// //  *
// //  * This is the starting point for your application.
// //  * Take a look at http://browserify.org/ for more info
// //  */

'use strict';

global.zikes = {
	ui: require('./ui/map.js') //this is to allow html refer to some entry points
};

import { initializeMap } from './map.js';

initializeMap()

const connectToWebSocket = (url) => {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);

    socket.addEventListener('open', () => {
      resolve(socket);
    });

    socket.addEventListener('error', (error) => {
      reject(error);
    });
  });
};

const retryConnectWebSocket = async (url, maxAttempts = 10, intervalTime = 200) => {
  let currentAttempt = 0;

  while (currentAttempt < maxAttempts) {
    try {
      const socket = await connectToWebSocket(url);
      console.log('WebSocket connected successfully.');
      // Do whatever you need to do with the connected WebSocket

      // Uncomment the following line if you want to hold the connection
      // await new Promise((resolve) => { /* Hold the connection */ });
      socket.send("Hello Server!")
      return socket; // Return the WebSocket object if you need to access it later
    } catch (error) {
      console.error(`WebSocket connection attempt ${currentAttempt + 1} failed. Retrying in ${intervalTime}ms...`);
      await new Promise((resolve) => setTimeout(resolve, intervalTime));
      currentAttempt++;
    }
  }

  throw new Error('Maximum number of connection attempts exceeded');
};

// Usage example
const websocketURL = 'ws://127.0.0.1:8080';
retryConnectWebSocket(websocketURL)
  .then((socket) => {
    // WebSocket connection successful, you can use the socket object here
    socket.onmessage = function (event) {
      console.log("Received message from server:", event.data);
    };
  })
  .catch((error) => {
    console.error('WebSocket connection failed:', error);
  });





