const net = require("net");

// Define the server address and port
const HOST_scanner = "10.5.3.175"; // use scanner IP
const PORT_scanner = 55256;

const HOST_server = "10.5.0.20"; // use scanner IP
const PORT_server = 7080; // use port

// Create a new TCP client
const RETRY_INTERVAL = 10000; // Retry interval in milliseconds

function connectToServer() {
  const client_scanner = new net.Socket();

  // Connect to the server
  client_scanner.connect(PORT_scanner, HOST_scanner, () => {
    console.log(`Connected to scanner: ${HOST_scanner}:${PORT_scanner}`);

    // Send data to the server
  });

  // Add a 'data' event handler for the client socket
  // Data is what the server sends back
  client_scanner.on("data", (data) => {
    console.log("Server says data::::: " + data);

    const client_server = new net.Socket();
    client_server.connect(PORT_server, HOST_server, () => {
      console.log(`Connected to server: ${HOST_server}:${PORT_server}`);

      // Forward the data directly without adding "mcode-"
      client_server.write(data);
      console.log("Data sent to server:::", data);
      client_server.destroy();
    });

    client_server.on("close", () => {
      console.log("Connection closed for server::::");
    });

    // Add an 'error' event handler for the client socket
    client_server.on("error", (err) => {
      console.error("Error: " + err.message);
    });
  });

  // Add a 'close' event handler for the client socket
  client_scanner.on("close", () => {
    console.log("Connection closed scanner::::");
    // Retry connection after 5 seconds
    setTimeout(connectToServer, RETRY_INTERVAL);
  });

  // Add an 'error' event handler for the client socket
  client_scanner.on("error", (err) => {
    console.error("Error: " + err.message);
    // Retry connection after 5 seconds
    setTimeout(connectToServer, RETRY_INTERVAL);
  });
}

// Start the initial connection attempt
connectToServer();



// const net = require("net");

// // Define the server address and port
// const HOST_scanner = "10.5.3.175"; // Scanner IP
// const PORT_scanner = 55256;

// const HOST_server = "10.5.0.20"; // Server IP
// const PORT_server = 7080; // Server Port

// // Retry interval for reconnection attempts
// const RETRY_INTERVAL = 10000; // 10 seconds

// function connectToServer() {
//   const client_scanner = new net.Socket();

//   // Attempt to connect to the scanner
//   client_scanner.connect(PORT_scanner, HOST_scanner, () => {
//     console.log(`Connected to scanner: ${HOST_scanner}:${PORT_scanner}`);
//   });

//   // Handle data received from the scanner
//   client_scanner.on("data", (data) => {
//     console.log("Data received from scanner:::::", data.toString());

//     // Create a new client to connect to the server
//     const client_server = new net.Socket();
//     client_server.connect(PORT_server, HOST_server, () => {
//       console.log(`Connected to server: ${HOST_server}:${PORT_server}`);

//       // Forward the data to the server
//       client_server.write(data);
//       console.log("Data forwarded to server:::", data.toString());

//       // Close the server connection after sending the data
//       client_server.destroy();
//     });

//     // Handle server connection closure
//     client_server.on("close", () => {
//       console.log("Connection closed for server::::");
//     });

//     // Handle errors during server connection
//     client_server.on("error", (err) => {
//       console.error("Server connection error: " + err.message);
//     });
//   });

//   // Handle scanner connection closure
//   client_scanner.on("close", (hadError) => {
//     console.log(`Connection closed scanner:::: hadError: ${hadError}`);
//     if (hadError) {
//       console.error("Connection to scanner closed due to error.");
//     }

//     // Retry connection after a delay
//     setTimeout(connectToServer, RETRY_INTERVAL);
//   });

//   // Handle scanner connection errors
//   client_scanner.on("error", (err) => {
//     console.error("Scanner connection error: " + err.message);
    
//     // Retry connection after a delay
//     setTimeout(connectToServer, RETRY_INTERVAL);
//   });
// }

// // Start the initial connection attempt
// connectToServer();

