class Pool {
  constructor() {
    this.gameState = {
      balls: "0".repeat(16).split("").map(function(item,index) {
        return {
          x: 70 * index + 70,
          y: 100,
          a: Math.floor(Math.random() * 360),
          v: 0
        }
      }),
      cue: {
        a: 0,
        v: 0,
      }
    }
  }
  init() {
    setInterval(function() {
      currentlyLoaded.render();
    },10);
  }
  render() {
    var canvas = document.getElementById("pool-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var balls = currentlyLoaded.gameState.balls;
    for ( var i = 0; i < balls.length; i++ ) {
      balls[i].x += balls[i].v * Math.cos(Math.PI * balls[i].a / 180);
      balls[i].y += balls[i].v * Math.sin(Math.PI * balls[i].a / 180);
      balls[i].v *= 0.975;
      if ( balls[i].v <= 1e-2 ) balls[i].v = 0;
      if ( balls[i].x <= 50 ||
          balls[i].x >= canvas.width - 80 ||
          balls[i].y <= 50 ||
          balls[i].y >= canvas.height - 80 ) balls[i].a += 90;
      for ( var j = i + 1; j < balls.length; j++ ) {
        var xDist = balls[i].x - balls[j].x;
        var yDist = balls[i].y - balls[j].y;
        var distance = Math.sqrt(xDist * xDist + yDist * yDist);
        if ( distance <= 60 ) {
          balls[i].a = balls[j].a;
          balls[i].v = 5;
          balls[j].a += 90;
        }
      }
    }
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "green";
    ctx.fillRect(20,20,canvas.width - 80,canvas.height - 80);
    if ( balls.filter(item => item.v > 0).length == 0 ) {
      var cueLength = 500;
      var cueDistance = 100;
      var cueAngle = currentlyLoaded.gameState.cue.a;
      ctx.lineWidth = "10";
      ctx.strokeStyle = "#824210";
      ctx.beginPath();
      ctx.moveTo(balls[15].x,balls[15].y);
      ctx.lineTo(balls[15].x + cueLength * Math.cos(Math.PI * cueAngle / 180),balls[15].y + cueLength * Math.sin(Math.PI * cueAngle / 180));
      ctx.stroke();
      ctx.lineWidth = "12";
      ctx.strokeStyle = "green";
      ctx.beginPath();
      ctx.moveTo(balls[15].x,balls[15].y);
      ctx.lineTo(balls[15].x + cueDistance * Math.cos(Math.PI * cueAngle / 180),balls[15].y + cueDistance * Math.sin(Math.PI * cueAngle / 180));
      ctx.stroke();
    }
    var colors = ["yellow","blue","red","purple","orange","#35ec63","brown","black"];
    for ( var i = 0; i < balls.length; i++ ) {
      ctx.fillStyle = colors[i > 7 ? i - 8 : i];
      if ( i == 15 ) ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(balls[i].x,balls[i].y,30,0,2 * Math.PI);
      ctx.fill();
      if ( i > 7 ) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(balls[i].x,balls[i].y,15,0,2 * Math.PI);
        ctx.fill();
      }
    }
    ctx.fillStyle = "brown";
    ctx.fillRect(0,0,20,canvas.height - 40);
    ctx.fillRect(canvas.width - 60,0,20,canvas.height - 40);
    ctx.fillRect(0,0,canvas.width - 40,20);
    ctx.fillRect(0,canvas.height - 60,canvas.width - 40,20);
  }
}
