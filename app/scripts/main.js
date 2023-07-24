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
};//the actual action of trying to connect websocket

const retryConnectWebSocket = async (url, maxAttempts = 10, intervalTime = 200) => {
  let currentAttempt = 0;

  while (currentAttempt < maxAttempts) {
    try {
      const socket = await connectToWebSocket(url);
      console.log('WebSocket connected successfully.');
      // Do whatever you need to do with the connected WebSocket

      // Uncomment the following line if you want to hold the connection
      // await new Promise((resolve) => { /* Hold the connection */ });
      socket.send("Hello Server!");
      return socket; // Return the WebSocket object if you need to access it later
    } catch (error) {
      console.error(`WebSocket connection attempt ${currentAttempt + 1} failed. Retrying in ${intervalTime}ms...`);
      await new Promise((resolve) => setTimeout(resolve, intervalTime));
      currentAttempt++;
    }
  }
  alert("Maximum number of connection attempts exceeded: Check Server Status")
  throw new Error('Maximum number of connection attempts exceeded');
}; //keep trying to connect to websocket, server must be started first

// Usage example
const websocketURL = 'ws://127.0.0.1:8080'; //ip + port
let TeleCount = 0;
retryConnectWebSocket(websocketURL)
  .then((socket) => {
    // WebSocket connection successful, you can use the socket object here
    window.addEventListener('ConfirmPinSelected', (event) => {
      const eventData = event.detail;
      console.log('Received custom event:', eventData);
      socket.send(JSON.stringify(eventData));
      alert("Coordinates sent to server!");
      // Handle the custom event and the associated data as needed
    });
    socket.addEventListener('message', (event) => {
      const receivedMessage = event.data;
      console.log('Received message from socket:', receivedMessage);
      const lngLat = parseCoordinates(receivedMessage);
      const MarkerEvent = new CustomEvent('updateMarkerPosition', {
        detail: lngLat
      });
      window.dispatchEvent(MarkerEvent); 
      TeleCount++;
      if(TeleCount % 50 == 0) {
        console.log("PING");
        socket.send("Keeping Connection Alive");
      }
      //figure out how to then  draw a circle on map
    });
  })//sits in the "then" until an event happens: confirmpins button is selected -> forward coordinates over socket, teledata recieved -> display on map
  .catch((error) => {
    console.error('WebSocket connection failed:', error);
    retryConnectWebSocket(websocketURL);
  });


  function parseCoordinates(message) {
    const [lat, lng] = message.split(',');
    return [parseFloat(lng), parseFloat(lat)];
}
  

