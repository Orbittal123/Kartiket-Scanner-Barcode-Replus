var express = require("express"),
    app = express(),
    http = require("http").Server(app),
    io = require("socket.io")(http),
    path = require("path"),
    net = require("net");

// Create a new TCP client instance
var client = new net.Socket();

http.listen(7000, "0.0.0.0", function () {
    console.log("Connected to :7000");
});

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/scanbarcode.html'));
});

io.sockets.on('connection', (socket) => {
    console.log("A user connected");

    var curdate = new Date();
    var yr = curdate.getFullYear();
    var month = ("0" + (curdate.getMonth() + 1)).slice(-2);
    var day = ("0" + curdate.getDate()).slice(-2);
    var today_date = yr + "-" + month + "-" + day;
    console.log("Today's date:", today_date);

    // Handle getscanBarcode event
    socket.on('getscanBarcode', function (barcode) {
        console.log("getscanBarcode::", barcode);

        // Connect to the TCP server and send the barcode
        client.connect(4000, 'localhost', () => {
            console.log('Connected to server');
            var str = "mcode-" + barcode;
            console.log("strrr::",str);
            client.write(str);
        });

        client.on('data', function(data) {
            console.log('Received: ' + data);
            client.destroy(); // Kill the client after the server's response
        });

        client.on('close', function() {
            console.log('Connection closed');
        });

        client.on('error', function(err) {
            console.error('Client error: ', err);
        });
    });
});

