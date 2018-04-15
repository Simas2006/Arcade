class Pool {
  constructor() {
    this.gameState = {
      balls: "0".repeat(16).split("").map(function(item,index) {
        return {
          x: Math.floor(Math.random() * (window.innerWidth - 50)),
          y: Math.floor(Math.random() * (window.innerHeight - 50)),
          a: Math.floor(Math.random() * 360),
          v: 0,
          shown: true,
          pocketActive: false
        }
      }),
      cue: {
        a: 0,
        v: 0,
        direction: 0,
        shootCount: 0,
        shootReverse: false,
        shooting: false,
        setVelocity: 0,
      },
      players: {
        solid: 0,
        stripe: 0,
        winner: 0,
        active: 0
      }
    }
    this.directionalAPI = {
      x: {
        positive: function() { currentlyLoaded.gameState.cue.direction = Math.sign(currentlyLoaded.gameState.cue.direction + 1) },
        negative: function() { currentlyLoaded.gameState.cue.direction = Math.sign(currentlyLoaded.gameState.cue.direction - 1) },
      },
      z: {
        positive: function() {
          if ( currentlyLoaded.gameState.cue.shootCount > 1 ) currentlyLoaded.gameState.cue.shooting = true;
          else currentlyLoaded.gameState.cue.shootCount = 1;
        },
        negative: Function.prototype
      },
      a: Function.prototype
    }
    this.metadata = {
      controllerType: 1,
      turn: 0,
      help: ``
    }
  }
  static metadata() {
    return {
      controllerType: 1,
      turn: 0,
      help: ``
    }
  }
  init() {
    currentlyLoaded.interval = setInterval(function() {
      currentlyLoaded.metadata.turn = currentlyLoaded.gameState.players.active;
      currentlyLoaded.render();
      var direction = currentlyLoaded.gameState.cue.direction;
      if ( direction != 0 && currentlyLoaded.gameState.cue.shootCount <=  0 ) {
        currentlyLoaded.gameState.cue.a -= direction * -0.2;
      }
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
      var pocketRadius = 65;
      if ( balls[i].v <= 1e-2 ) balls[i].v = 0;
      if (
        balls[i].x <= 50 ||
        balls[i].x >= canvas.width - 50 ||
        balls[i].y <= 50 ||
        balls[i].y >= canvas.height - 50
      ) balls[i].a += 90;
      if (
        balls[i].x <= pocketRadius && balls[i].y <= pocketRadius ||
        balls[i].x <= pocketRadius && balls[i].y >= canvas.height - pocketRadius ||
        balls[i].x >= canvas.width - pocketRadius && balls[i].y <= pocketRadius ||
        balls[i].x >= canvas.width - pocketRadius && balls[i].y >= canvas.height - pocketRadius ||
        balls[i].y <= pocketRadius && balls[i].x >= canvas.width / 2 - pocketRadius && balls[i].x <= canvas.width / 2 + pocketRadius ||
        balls[i].y >= canvas.height - pocketRadius && balls[i].x >= canvas.width / 2 - pocketRadius && balls[i].x <= canvas.width / 2 + pocketRadius
      ) {
        if ( ! balls[i].pocketActive ) {
          balls[i].shown = false;
          balls[i].pocketActive = true;
          if ( i == 15 ) {
            setTimeout(function() {
              balls[15].x = Math.floor(Math.random() * (canvas.width - 50));
              balls[15].y = Math.floor(Math.random() * (canvas.height - 50));
              balls[15].v = 0;
              balls[15].shown = true;
            },1000);
          } else if ( i == 7 ) {
            if (
              currentlyLoaded.gameState.players.active == 2 && currentlyLoaded.gameState.players.solid >= 7 ||
              currentlyLoaded.gameState.players.active == 1 && currentlyLoaded.gameState.players.stripe >= 7
            ) currentlyLoaded.gameState.players.winner = currentlyLoaded.gameState.players.active == 1 ? 2 : 1;
            else currentlyLoaded.gameState.players.winner = currentlyLoaded.gameState.players.active;
          } else {
            currentlyLoaded.gameState.players.active = currentlyLoaded.gameState.players.active == 1 ? 2 : 1;
            if ( i <= 7 ) currentlyLoaded.gameState.players.solid++;
            else currentlyLoaded.gameState.players.stripe++;
          }
          var x = i + 1 - 1; // remove pointer
          setTimeout(function() {
            balls[x].pocketActive = false;
          },2000)
        }
      }
      if ( balls[i].shown ) {
        for ( var j = i + 1; j < balls.length; j++ ) {
          if ( ! balls[j].shown ) continue;
          var xDist = balls[i].x - balls[j].x;
          var yDist = balls[i].y - balls[j].y;
          var distance = Math.sqrt(xDist * xDist + yDist * yDist);
          if ( distance <= 60 ) {
            balls[i].a = balls[j].a;
            balls[i].v = balls[j].v * 0.8;
            balls[j].a += 90;
          }
        }
      }
    }
    var ctx = canvas.getContext("2d");
    var cueBounceLimit = 150;
    ctx.fillStyle = "green";
    ctx.fillRect(20,20,canvas.width - 40,canvas.height - 40);
    if ( balls.filter(item => item.v > 0).length == 0 ) {
      var shootCount = currentlyLoaded.gameState.cue.shootCount;
      if ( shootCount > 0 || currentlyLoaded.gameState.cue.shooting ) {
        currentlyLoaded.gameState.cue.rotationDirection = 0;
        if ( currentlyLoaded.gameState.cue.shootReverse ) {
          currentlyLoaded.gameState.cue.shootCount--;
          if ( shootCount <= cueBounceLimit - 5 ) currentlyLoaded.gameState.cue.shootReverse = false;
        } else {
          currentlyLoaded.gameState.cue.shootCount++;
          if ( shootCount >= cueBounceLimit + 5 ) currentlyLoaded.gameState.cue.shootReverse = true;
        }
        if ( currentlyLoaded.gameState.cue.shooting ) {
          if ( shootCount > currentlyLoaded.gameState.cue.setVelocity ) currentlyLoaded.gameState.cue.setVelocity = shootCount;
          currentlyLoaded.gameState.cue.shootCount -= 12;
          if ( shootCount <= -80 ) {
            currentlyLoaded.gameState.cue.shooting = false;
            currentlyLoaded.gameState.cue.shootCount = 0;
            currentlyLoaded.gameState.balls[15].a = 180 + currentlyLoaded.gameState.cue.a;
            currentlyLoaded.gameState.balls[15].v = currentlyLoaded.gameState.cue.setVelocity * 0.125;
            currentlyLoaded.gameState.cue.setVelocity = 0;
            currentlyLoaded.gameState.cue.direction = 0;
            currentlyLoaded.gameState.players.active = currentlyLoaded.gameState.players.active == 1 ? 2 : 1;
          }
        }
      }
      var cueLength = 500 + shootCount;
      var cueDistance = 100 + shootCount;
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
      if ( ! balls[i].shown ) continue;
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
    ctx.fillRect(0,0,20,canvas.height - 20);
    ctx.fillRect(canvas.width - 20,0,20,canvas.height);
    ctx.fillRect(0,0,canvas.width - 20,20);
    ctx.fillRect(0,canvas.height - 20,canvas.width - 20,20);
    var pocketRadius = 45;
    ctx.fillStyle = "black";
	  ctx.beginPath();
  	ctx.arc(20,20,pocketRadius,0.5 * Math.PI,2 * Math.PI,false);
  	ctx.lineTo(20,20);
  	ctx.fill();
    ctx.beginPath();
  	ctx.arc(canvas.width - 20,20,pocketRadius,1 * Math.PI,0.5 * Math.PI,false);
  	ctx.lineTo(canvas.width - 20,20);
  	ctx.fill();
    ctx.beginPath();
  	ctx.arc(20,canvas.height - 20,pocketRadius,0 * Math.PI,1.5 * Math.PI,false);
  	ctx.lineTo(20,canvas.height - 20);
  	ctx.fill();
    ctx.beginPath();
  	ctx.arc(canvas.width - 20,canvas.height - 20,pocketRadius,1.5 * Math.PI,1 * Math.PI,false);
  	ctx.lineTo(canvas.width - 20,canvas.height - 20);
  	ctx.fill();
    ctx.beginPath();
  	ctx.arc(canvas.width / 2,20,pocketRadius,1 * Math.PI,2 * Math.PI,false);
  	ctx.lineTo(canvas.width / 2,20);
  	ctx.fill();
    ctx.beginPath();
    ctx.arc(canvas.width / 2,canvas.height - 20,pocketRadius,0 * Math.PI,1 * Math.PI,false);
    ctx.lineTo(canvas.width / 2,canvas.height - 20);
    ctx.fill();
    var winner = currentlyLoaded.gameState.players.winner;
    if ( winner > 0 ) {
      ctx.fillStyle = "white";
      ctx.fillRect(0,canvas.height / 2 - 40,canvas.width,50);
      ctx.fillStyle = [null,"red","blue"][winner];
      ctx.textAlign = "center";
      ctx.font = "40px Arial";
      ctx.fillText([null,"SOLID","STRIPE"][winner] + " WINS",canvas.width / 2,canvas.height / 2);
    }
  }
  unmount() {
    clearInterval(currentlyLoaded.interval);
  }
}
