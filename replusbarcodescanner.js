const net = require("net");

// Define the server address and port
const HOST_scanner = "10.5.3.175"; // use scanner IP
const PORT_scanner = 55256;

const HOST_server = "10.5.0.20"; // use scanner IP
const PORT_server = 7080; // use port

// Create a new TCP client
const RETRY_INTERVAL = 5000; // Retry interval in milliseconds

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
