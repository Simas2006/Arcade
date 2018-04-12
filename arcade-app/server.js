var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var PORT = process.argv[2] || 8000;
var codes = [];
var activeSocket;

app.use("/web",express.static(__dirname + "/web"));

app.get("/internal/connect",function(request,response) {
  if ( codes.length < 2 ) {
    var random = Math.floor(Math.random() * 1e8);
    codes.push(random);
    activeSocket.emit("instruction",`{"type":"connection"}`);
    response.writeHead(200);
    response.write(random.toString());
    response.end();
  } else {
    response.writeHead(200);
    response.write("err_not_available");
    response.end();
  }
});

app.get("/internal/disconnect",function(request,response) {
  var qs = decodeURIComponent(request.url.split("?").slice(1).join("?"));
  var oldCodeLength = codes.length + 1;
  codes = codes.filter(item => item != qs);
  if ( codes.length < oldCodeLength - 1 ) activeSocket.emit("instruction",`{"type":"disconnection"}`);
  response.writeHead(200);
  response.write("ok");
  response.end();
});

app.get("/internal/move",function(request,response) {
  var qs = decodeURIComponent(request.url.split("?").slice(1).join("?"));
  var data = JSON.parse(qs);
  data.code = parseInt(data.code)
  if ( codes.indexOf(data.code) <= -1 ) {
    response.writeHead(200);
    response.write("err_invalid_code");
    response.end();
    return;
  }
  var obj = {
    type: "direction",
    controller: codes.indexOf(data.code),
    data: data
  }
  activeSocket.emit("instruction",JSON.stringify(obj));
  response.writeHead(200);
  response.write("ok");
  response.end();
});

io.on("connection",function(socket){
  activeSocket = socket;
});

http.listen(PORT, function(){
  console.log("Listening on port " + PORT);
});
