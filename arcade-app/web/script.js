var socket = io();
var games = {
  blackjack: new Blackjack(),
  pool: new Pool(),
  pacman: new Pacman()
}
var currentlyLoaded = games.pacman;

socket.on("directions",function(data) {
  data = JSON.parse(data);
  if ( data.x > 0 ) currentlyLoaded.directionalAPI.x.positive();
  if ( data.x < 0 ) currentlyLoaded.directionalAPI.x.negative();
  if ( data.z > 0 ) currentlyLoaded.directionalAPI.z.positive();
  if ( data.z < 0 ) currentlyLoaded.directionalAPI.z.negative();
  if ( data.a > 0 ) {
    // run home code
  }
  if ( data.a < 0 ) currentlyLoaded.directionalAPI.a();
});

window.onload = currentlyLoaded.init;
