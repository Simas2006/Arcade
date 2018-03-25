var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var PORT = process.argv[2] || 8000;
var directions = {a:0,x:0,z:0};
var activeSocket;

app.use("/web",express.static(__dirname + "/web"));

app.get("/send",function(request,response) {
  var qs = decodeURIComponent(request.url.split("?").slice(1).join("?"));
  directions = JSON.parse(qs);
  activeSocket.emit("directions",qs);
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
