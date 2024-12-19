const net = require("net");

const HOST_scanner = "10.5.3.175";
const PORT_scanner = 55256;

const HOST_server = "10.5.0.20";
const PORT_server = 7080;

const RETRY_INTERVAL = 5000;
let retryCount = 0;

function connectToServer() {
  const client_scanner = new net.Socket();

  client_scanner.setKeepAlive(true, 10000); // Enable keep-alive
  client_scanner.setTimeout(10000); // Timeout after 10 seconds

  client_scanner.connect(PORT_scanner, HOST_scanner, () => {
    console.log(`Connected to scanner: ${HOST_scanner}:${PORT_scanner}`);
    retryCount = 0; // Reset retry counter on successful connection
  });

  client_scanner.on("data", (data) => {
    console.log("Data received from scanner:", data);

    const client_server = new net.Socket();
    client_server.setKeepAlive(true, 10000);

    client_server.connect(PORT_server, HOST_server, () => {
      console.log(`Connected to server: ${HOST_server}:${PORT_server}`);
      client_server.write(data, () => {
        console.log("Data sent to server:", data);
        client_server.end(); // Graceful close
      });
    });

    client_server.on("error", (err) => {
      console.error("Error with server connection:", err.message);
      client_server.destroy();
    });

    client_server.on("close", () => {
      console.log("Server connection closed.");
    });
  });

  client_scanner.on("timeout", () => {
    console.error("Scanner connection timed out.");
    client_scanner.destroy();
    scheduleReconnect();
  });

  client_scanner.on("error", (err) => {
    console.error("Error with scanner connection:", err.message);
    client_scanner.destroy();
    scheduleReconnect();
  });

  client_scanner.on("close", () => {
    console.log("Scanner connection closed.");
    scheduleReconnect();
  });

  function scheduleReconnect() {
    retryCount++;
    const retryDelay = Math.min(RETRY_INTERVAL * retryCount, 60000); // Cap at 60 seconds
    console.log(`Reconnecting to scanner in ${retryDelay / 1000} seconds...`);
    setTimeout(connectToServer, retryDelay);
  }
}

// Health check
setInterval(() => {
  const memoryUsage = process.memoryUsage();
  console.log(`Health Check - Memory Usage: ${JSON.stringify(memoryUsage)}`);
}, 60000);

// Start the service
connectToServer();


// const net = require("net");

// // Define the server address and port
// const HOST_scanner = "10.5.3.175"; // use scanner IP
// const PORT_scanner = 55256;

// const HOST_server = "10.5.0.20"; // use scanner IP
// const PORT_server = 7080; // use port

// // Create a new TCP client
// const RETRY_INTERVAL = 5000; // Retry interval in milliseconds

// function connectToServer() {
//   const client_scanner = new net.Socket();

//   // Connect to the server
//   client_scanner.connect(PORT_scanner, HOST_scanner, () => {
//     console.log(`Connected to scanner: ${HOST_scanner}:${PORT_scanner}`);

//     // Send data to the server
//   });

//   // Add a 'data' event handler for the client socket
//   // Data is what the server sends back
//   client_scanner.on("data", (data) => {
//     console.log("Server says data::::: " + data);

//     const client_server = new net.Socket();
//     client_server.connect(PORT_server, HOST_server, () => {
//       console.log(`Connected to server: ${HOST_server}:${PORT_server}`);

//       // Forward the data directly without adding "mcode-"
//       client_server.write(data);
//       console.log("Data sent to server:::", data);
//       client_server.destroy();
//     });

//     client_server.on("close", () => {
//       console.log("Connection closed for server::::");
//     });

//     // Add an 'error' event handler for the client socket
//     client_server.on("error", (err) => {
//       console.error("Error: " + err.message);
//     });
//   });

//   // Add a 'close' event handler for the client socket
//   client_scanner.on("close", () => {
//     console.log("Connection closed scanner::::");
//     // Retry connection after 5 seconds
//     setTimeout(connectToServer, RETRY_INTERVAL);
//   });

//   // Add an 'error' event handler for the client socket
//   client_scanner.on("error", (err) => {
//     console.error("Error: " + err.message);
//     // Retry connection after 5 seconds
//     setTimeout(connectToServer, RETRY_INTERVAL);
//   });
// }

// // Start the initial connection attempt
// connectToServer();






