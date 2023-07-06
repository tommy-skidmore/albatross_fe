/**
 * scripts/main.js
 *
 * This is the starting point for your application.
 * Take a look at http://browserify.org/ for more info
 */

'use strict';

global.zikes = {
	ui: require('./ui/map.js') //this is to allow html refer to some entry points
};

// // Create WebSocket connection.
// let socket = new WebSocket('wss://localhost:8080');

// // Connection opened
// socket.addEventListener("open", (event) => {
//   socket.send("Hello Server!");
// });

// // Listen for messages
// socket.addEventListener("message", (event) => {
//   console.log("Message from server ", event.data);
// });
