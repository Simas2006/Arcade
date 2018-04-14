class Shuffleboard {
  constructor() {
    this.gameState = {
      puck: {
        x: window.innerWidth * 0.965,
        s: 0,
        moving: 0,
        direction: -1
      },
      points: [0,0],
      turn: 0
    }
  }
  init() {
    setInterval(function() {
      currentlyLoaded.render();
    },10);
  }
  render() {
    var canvas = document.getElementById("shuffleboard-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#143770";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "brown";
    ctx.fillRect(canvas.width * 0.03,canvas.height / 2 - 150,canvas.width * 0.9,300);
    ctx.strokeStyle = "black";
    for ( var i = 0; i < 3; i++ ) {
      ctx.beginPath();
      ctx.moveTo(canvas.width * (0.105 + 0.075 * i),canvas.height / 2 - 150);
      ctx.lineTo(canvas.width * (0.105 + 0.075 * i),canvas.height / 2 + 150);
      ctx.stroke();
    }
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "red";
    ctx.fillText(currentlyLoaded.gameState.points[0],canvas.width * 0.068,canvas.height / 2 - 190);
    ctx.fillStyle = "lightblue";
    ctx.fillText(currentlyLoaded.gameState.points[1],canvas.width * 0.892,canvas.height / 2 - 190);
    var puck = currentlyLoaded.gameState.puck;
    if ( puck.moving == 0 ) {
      if ( puck.direction == -1 ) puck.s = Math.min(puck.s + 0.5,100);
      else puck.s = Math.max(puck.s - 0.5,0);
    }
    if ( puck.moving == 1 ) {
      puck.x -= 0.00056 * canvas.width * puck.s;
      puck.s = Math.max(puck.s - 1,0);
    }
    if ( puck.s == 0 && puck.moving == 1 ) {
      puck.moving = -1;
      if ( puck.x < canvas.width * 0.255 && puck.x > canvas.width * 0.03 ) {
        currentlyLoaded.gameState.points[currentlyLoaded.gameState.turn]++;
        if ( puck.x < canvas.width * 0.18 ) currentlyLoaded.gameState.points[currentlyLoaded.gameState.turn]++;
        if ( puck.x < canvas.width * 0.105 ) currentlyLoaded.gameState.points[currentlyLoaded.gameState.turn]++;
      }
      setTimeout(function() {
        puck.x = canvas.width * 0.965;
        puck.moving = 0;
        currentlyLoaded.gameState.turn = currentlyLoaded.gameState.turn == 0 ? 1 : 0;
      },1500);
    }
    ctx.fillStyle = ["red","blue"][currentlyLoaded.gameState.turn];
    ctx.beginPath();
    ctx.arc(puck.x,canvas.height / 2,canvas.width * 0.025,0,2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(puck.x,canvas.height / 2,canvas.width * 0.0165,0,2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "black";
    for ( var i = 0; i < 3; i++ ) {
      ctx.fillText(3 - i,canvas.width * (0.068 + 0.075 * i),canvas.height / 2 + 20);
    }
    var colors = ["darkred","red","orange","yellow","green","yellow","orange","red","darkred","darkred"];
    for ( var i = 0; i < colors.length; i++ ) {
      ctx.fillStyle = colors[i];
      ctx.fillRect(canvas.width * (0.6 + i * 0.033),canvas.height / 2 + 200,canvas.width * 0.033,50);
    }
    ctx.fillStyle = "#143770";
    ctx.fillRect(canvas.width * 0.6,canvas.height / 2 + 195,canvas.width * 0.33 * (1 - puck.s / 100),60);
    if ( currentlyLoaded.gameState.points[0] >= 10 || currentlyLoaded.gameState.points[1] >= 10 ) {
      ctx.fillStyle = "white";
      ctx.fillRect(0,canvas.height / 2 - 80,canvas.width,160);
      ctx.font = "80px Arial";
      var winner = ["red","blue"][currentlyLoaded.gameState.points[0] >= 5 ? 0 : 1];
      ctx.fillStyle = winner;
      ctx.fillText(winner.toUpperCase() + " WINS",canvas.width / 2,canvas.height / 2 + 30);
    }
  }
}
