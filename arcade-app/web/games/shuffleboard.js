class Shuffleboard {
  constructor() {
    this.gameState = {
      puck: {
        x: window.innerWidth * 0.965,
        s: 51,
        moving: true,
        direction: 1
      },
      points: {
        red: 0,
        blue: 0
      },
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
    var puck = currentlyLoaded.gameState.puck;
    if ( puck.moving ) {
      puck.x -= 0.69 * puck.s;
      puck.s = Math.max(puck.s - 1,0);
    }
    ctx.fillStyle = ["red","blue"][currentlyLoaded.gameState.turn];
    ctx.beginPath();
    ctx.arc(puck.x,canvas.height / 2,canvas.width * 0.025,0,2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(puck.x,canvas.height / 2,canvas.width * 0.0165,0,2 * Math.PI);
    ctx.fill();
    ctx.font = "60px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    for ( var i = 0; i < 3; i++ ) {
      ctx.fillText(3 - i,canvas.width * (0.068 + 0.075 * i),canvas.height / 2 + 20);
    }
    var colors = ["darkred","red","orange","yellow","green","yellow","orange","red","darkred","darkred"];
    for ( var i = 0; i < colors.length; i++ ) {
      ctx.fillStyle = colors[i];
      ctx.fillRect(canvas.width * (0.6 + i * 0.033),canvas.height / 2 + 200,canvas.width * 0.033,50);
    }
    ctx.fillStyle = "#143770";
    ctx.fillRect(canvas.width * 0.6,canvas.height / 2 + 200,canvas.width * 0.33 * (1 - puck.s / 100),50);
  }
}
