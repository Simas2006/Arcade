var socket = io();

class Home {
  constructor() {
    this.selected = 0;
    this.isHomePage = true;
    this.directionalAPI = {
      x: {
        positive: Function.prototype,
        negative: Function.prototype
      },
      z: {
        positive: function() { currentlyLoaded.move(-1) },
        negative: function() { currentlyLoaded.move(1) }
      },
      a: function() { currentlyLoaded.launch() }
    }
    this.metadata = {
      controllerType: 0
    }
  }
  init() {
    var box = document.getElementById("home-game");
    var list = Object.keys(games).filter(item => item != "home");
    box.appendChild(document.createElement("br"));
    for ( var i = 0; i < list.length; i++ ) {
      var button = document.createElement("button");
      button.id = "home-button-" + i;
      var span = document.createElement("span");
      var name = list[i];
      var first = name.charAt(0).toUpperCase();
      name = first + name.slice(1) + " ";
      span.innerText = name;
      button.appendChild(span);
      var img = document.createElement("img");
      var controllerCount = games[list[i]].metadata().controllerType > 0 ? 2 : 1;
      img.src = `/web/images/${controllerCount}controller.png`;
      img.height = 50;
      button.appendChild(img);
      box.appendChild(button);
    }
    var help = document.createElement("p");
    help.id = "home-help-text";
    box.appendChild(help);
    currentlyLoaded.interval = setInterval(function() {
      currentlyLoaded.update();
    },10);
  }
  update() {
    var list = Object.keys(games).filter(item => item != "home");
    for ( var i = 0; i < list.length; i++ ) {
      if ( activeControllers == (games[list[i]].metadata().controllerType > 0 ? 2 : 1) ) document.getElementById("home-button-" + i).className = "";
      else document.getElementById("home-button-" + i).className = "home-unavailable";
    }
    var active = list.filter(item => activeControllers == (games[item].metadata().controllerType > 0 ? 2 : 1));
    var index = list.indexOf(active[currentlyLoaded.selected]);
    if ( activeControllers > 0 ) {
      document.getElementById("home-button-" + index).className = "home-selected";
      document.getElementById("home-help-text").innerText = `Help:

${games[list[index]].metadata().help}

Press Ⓐ to start!`;
    } else {
      document.getElementById("home-help-text").innerText = "There are no controllers connected.";
    }
  }
  move(direction) {
    var active = Object.keys(games).filter(item => item != "home" && activeControllers == (games[item].metadata().controllerType > 0 ? 2 : 1));
    if ( direction > 0 && this.selected == active.length - 1 ) return;
    if ( direction < 0 && this.selected == 0 ) return;
    this.selected += direction;
  }
  launch() {
    var active = Object.keys(games).filter(item => item != "home" && activeControllers == (games[item].metadata().controllerType > 0 ? 2 : 1));
    openGame(active[currentlyLoaded.selected]);
  }
  unmount() {
    clearInterval(currentlyLoaded.interval);
    var box = document.getElementById("home-game");
    while ( box.firstChild ) {
      box.removeChild(box.firstChild);
    }
  }
}

var games = {
  home: Home,
  blackjack: Blackjack,
  pool: Pool,
  pacman: Pacman,
  pingpong: PingPong,
  shuffleboard: Shuffleboard
}
var currentlyLoaded = new games.home();
var activeControllers = 0;

function openGame(name) {
  currentlyLoaded.unmount();
  var list = Object.keys(games);
  for ( var i = 0; i < list.length; i++ ) {
    document.getElementById(list[i] + "-game").style.display = "none";
  }
  document.getElementById(name + "-game").style.display = "block";
  currentlyLoaded = new games[name]();
  setTimeout(function() {
    currentlyLoaded.init();
  },500);
}

socket.on("instruction",function(message) {
  message = JSON.parse(message);
  if ( message.type == "connection" ) {
    activeControllers++;
    if ( currentlyLoaded.isHomePage ) currentlyLoaded.selected = 0;
  }
  if ( message.type == "disconnection" ) {
    activeControllers--;
    if ( currentlyLoaded.isHomePage ) currentlyLoaded.selected = 0;
  }
  if ( message.type == "direction" ) {
    if ( message.data.a < 0 ) {
      if ( ! currentlyLoaded.isHomePage ) openGame("home");
    }
    if ( currentlyLoaded.metadata.controllerType == 0 && message.controller != 0 ) return;
    if ( currentlyLoaded.metadata.controllerType == 1 && message.controller != currentlyLoaded.metadata.turn ) return;
    var api = currentlyLoaded.directionalAPI;
    if ( currentlyLoaded.metadata.controllerType == 2 ) api = currentlyLoaded.directionalAPI[message.controller];
    if ( message.data.x > 0 ) api.x.positive();
    if ( message.data.x < 0 ) api.x.negative();
    if ( message.data.z > 0 ) api.z.negative();
    if ( message.data.z < 0 ) api.z.positive();
    if ( message.data.a > 0 ) api.a();
  }
});

window.onload = function() {
  openGame("home");
}
