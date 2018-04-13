var socket = io();
var games = {
  blackjack: new Blackjack(),
  pool: new Pool(),
  pacman: new Pacman(),
  pingpong: new PingPong()
}
var currentlyLoaded = null;
var activeControllers = 0;

socket.on("instruction",function(message) {
  message = JSON.parse(message);
  if ( message.type == "connection" ) activeControllers++;
  if ( message.type == "disconnection" ) activeControllers--;
  if ( message.type == "direction" ) {
    if ( currentlyLoaded.metadata.controllerType == 0 && message.controller != 0 ) return;
    if ( currentlyLoaded.metadata.controllerType == 1 && message.controller != currentlyLoaded.metadata.turn ) return;
    var api = currentlyLoaded.directionalAPI;
    if ( currentlyLoaded.metadata.controllerType == 2 ) api = currentlyLoaded.directionalAPI[message.controller];
    if ( message.data.x > 0 ) api.x.positive();
    if ( message.data.x < 0 ) api.x.negative();
    if ( message.data.z > 0 ) api.z.negative();
    if ( message.data.z < 0 ) api.z.positive();
    if ( message.data.a > 0 ) api.a();
    if ( message.data.a < 0 ) {
      // run home code
    }
  }
});

if ( currentlyLoaded ) window.onload = currentlyLoaded.init;
