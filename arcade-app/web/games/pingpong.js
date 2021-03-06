class PingPong {
  constructor() {
    this.gameState = {
      paddles: [
        {
          x: window.innerWidth / 2,
          v: 0,
          saveV: 0,
          shooting: 0,
          direction: 0
        },
        {
          x: window.innerWidth / 2,
          v: 0,
          saveV: 0,
          shooting: 0,
          direction: 0
        }
      ],
      ball: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        g: 100,
        a: 45,
        v: 100,
        goingUp: false,
        direction: 0,
        preparing: true
      },
      scores: [0,0]
    }
    this.directionalAPI = [
      {
        x: {
          positive: function() { currentlyLoaded.gameState.paddles[0].direction = Math.sign(currentlyLoaded.gameState.paddles[0].direction + 1) },
          negative: function() { currentlyLoaded.gameState.paddles[0].direction = Math.sign(currentlyLoaded.gameState.paddles[0].direction - 1) }
        },
        z: {
          positive: Function.prototype,
          negative: function() { currentlyLoaded.gameState.paddles[0].shooting = -1; currentlyLoaded.gameState.paddles[0].direction = 0 },
        },
        a: function() { currentlyLoaded.gameState.paddles[0].shooting = 1 }
      },
      {
        x: {
          positive: function() { currentlyLoaded.gameState.paddles[1].direction = Math.sign(currentlyLoaded.gameState.paddles[1].direction + 1) },
          negative: function() { currentlyLoaded.gameState.paddles[1].direction = Math.sign(currentlyLoaded.gameState.paddles[1].direction - 1) }
        },
        z: {
          positive: Function.prototype,
          negative: function() { currentlyLoaded.gameState.paddles[1].shooting = -1; currentlyLoaded.gameState.paddles[1].direction = 0 },
        },
        a: function() { currentlyLoaded.gameState.paddles[1].shooting = 1 }
      }
    ]
    this.metadata = {
      controllerType: 2,
      help: `Swing left to move paddle left
Swing right to move paddle right
Swing backward to pull paddle backward
Press Ⓐ in game to shoot paddle`
    }
  }
  static metadata() {
    return {
      controllerType: 2,
      help: `Swing left to move paddle left
Swing right to move paddle right
Swing backward to pull paddle backward
Press Ⓐ in game to shoot paddle`
    }
  }
  init() {
    currentlyLoaded.interval = setInterval(function() {
      currentlyLoaded.render();
    },10);
    var ball = currentlyLoaded.gameState.ball;
    setTimeout(function() {
      ball.v = 70;
      var r = Math.floor(Math.random() * 90);
      ball.a = [r + 225,r + 45][Math.floor(Math.random() * 2)];
      ball.preparing = false;
    },1500);
  }
  render() {
    var canvas = document.getElementById("pingpong-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "green";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width / 2 - 10,0,20,canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height * 0.05);
    ctx.fillRect(0,canvas.height * 0.95,canvas.width,canvas.height * 0.05);
    ctx.fillStyle = "gray";
    ctx.fillRect(0,canvas.height / 2 - 10,canvas.width,20);
    var paddles = currentlyLoaded.gameState.paddles;
    ctx.fillStyle = "red";
    ctx.fillRect(paddles[0].x - 100,canvas.height * 0.15 * ((100 - paddles[0].v) / 100),200,canvas.height * 0.05);
    ctx.fillStyle = "blue";
    ctx.fillRect(paddles[1].x - 100,canvas.height * (1 - 0.15 * ((100 - paddles[1].v) / 100) - 0.05),200,canvas.height * 0.05);
    var ball = currentlyLoaded.gameState.ball;
    ctx.fillStyle = "#e6e6e6";
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,5 + 20 * (ball.g / 100),0,2 * Math.PI);
    ctx.fill();
    ctx.textAlign = "center";
    var textColor = "white";
    if ( currentlyLoaded.gameState.scores[0] >= 5 || currentlyLoaded.gameState.scores[1] >= 5 ) {
      textColor = "black";
      ctx.fillStyle = "white";
      ctx.fillRect(0,canvas.height / 2 - 80,canvas.width,160);
      ctx.font = "45px Arial";
      var winner = ["red","blue"][currentlyLoaded.gameState.scores[0] >= 5 ? 0 : 1];
      ctx.fillStyle = winner;
      ctx.fillText(winner.toUpperCase() + " WINS",canvas.width / 2,canvas.height / 2);
    }
    ctx.font = "80px Arial";
    ctx.fillStyle = textColor;
    ctx.fillText(currentlyLoaded.gameState.scores[0],40,canvas.height / 2 - 40);
    ctx.fillText(currentlyLoaded.gameState.scores[1],canvas.width - 40,canvas.height / 2 + 95);
    if ( ! ball.preparing ) ball.x += (Math.max(ball.v,10) / 50) * Math.cos(Math.PI * ball.a / 180);
    if ( ! ball.preparing ) ball.y += (Math.max(ball.v,10) / 50) * Math.sin(Math.PI * ball.a / 180);
    ball.v *= 0.998;
    if ( paddles[0].direction == -1 ) paddles[0].x--;
    if ( paddles[0].direction == 1 ) paddles[0].x++;
    if ( paddles[1].direction == -1 ) paddles[1].x--;
    if ( paddles[1].direction == 1 ) paddles[1].x++;
    if ( ! ball.preparing ) ball.g += ball.goingUp ? 1 : -1;
    if ( ball.g <= 0 ) {
      if ( ! ball.stopped ) ball.goingUp = true;
      else ball.g = 1;
    }
    if ( ball.g >= ball.v * 1.5 ) ball.goingUp = false;
    if ( paddles[0].shooting <= -1 ) {
      paddles[0].v = Math.min(paddles[0].v + 1,100);
      if ( paddles[0].v >= 100 ) paddles[0].shooting = 0;
    }
    if ( paddles[1].shooting <= -1 ) {
      paddles[1].v = Math.min(paddles[1].v + 1,100);
      if ( paddles[1].v >= 100 ) paddles[1].shooting = 0;
    }
    if ( paddles[0].shooting > 0 ) {
      if ( paddles[0].shooting == 1 ) {
        paddles[0].saveV = paddles[0].v;
        paddles[0].shooting = 2;
      }
      paddles[0].v = Math.max(paddles[0].v - 5,0);
      if ( paddles[0].v == 0 ) {
        paddles[0].saveV = Math.max(paddles[0].saveV - 1,0);
        if ( paddles[0].saveV <= 0 ) paddles[0].shooting = 0;
      }
    }
    if ( paddles[1].shooting > 0 ) {
      if ( paddles[1].shooting == 1 ) {
        paddles[1].saveV = paddles[1].v;
        paddles[1].shooting = 2;
      }
      paddles[1].v = Math.max(paddles[1].v - 5,0);
      if ( paddles[1].v == 0 ) {
        paddles[1].saveV = Math.max(paddles[1].saveV - 1,0);
        if ( paddles[1].saveV <= 0 ) paddles[1].shooting = 0;
      }
    }
    if ( ball.x >= paddles[0].x - 100 && ball.x <= paddles[0].x + 100 && ball.y <= canvas.height * (0.15 * ((100 - paddles[0].v) / 100) + 0.05) && ball.y >= canvas.height * 0.15 * ((100 - paddles[0].v) / 100) && ! ball.preparing && ! ball.hasBounced ) {
      ball.a = -ball.a;
      ball.v = Math.min(ball.v + paddles[0].saveV,100);
      ball.hasBounced = true;
    }
    if ( ball.x >= paddles[1].x - 100 && ball.x <= paddles[1].x + 100 && ball.y >= canvas.height * (1 - 0.15 * ((100 - paddles[1].v) / 100) - 0.05) && ball.y <= canvas.height * (1 - 0.15 * ((100 - paddles[1].v) / 100)) && ! ball.preparing && ! ball.hasBounced ) {
      ball.a = -ball.a;
      ball.v = Math.min(ball.v + paddles[1].saveV,100);
      ball.hasBounced = true;
    }
    if ( ball.y >= canvas.height / 2 - 10 && ball.y <= canvas.height / 2 + 10 ) {
      ball.hasBounced = false;
      if ( ball.g <= 20 && ! ball.preparing ) {
        if ( ball.y < canvas.height / 2 ) var winner = 1;
        else var winner = 0;
        currentlyLoaded.gameState.scores[winner]++;
        ball.a += 180;
        ball.preparing = true;
        setTimeout(function() {
          ball.g = 100;
          ball.v = 0;
          ball.x = canvas.width / 2;
          ball.y = canvas.height / 2;
          setTimeout(function() {
            if ( currentlyLoaded.gameState.scores[0] >= 5 || currentlyLoaded.gameState.scores[1] >= 5 ) return;
            ball.v = 70;
            var r = Math.floor(Math.random() * 90);
            ball.a = [r + 225,r + 45][winner == 0 ? 1 : 0];
            ball.preparing = false;
          },1500);
        },2000);
      }
    }
    if ( (ball.y <= canvas.height * 0.05 || ball.y >= canvas.height * 0.95) && ! ball.preparing ) {
      if ( ball.y >= canvas.height * 0.95 ) var winner = 0;
      else var winner = 1;
      currentlyLoaded.gameState.scores[winner]++;
      ball.preparing = true;
      setTimeout(function() {
        ball.g = 100;
        ball.v = 0;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        if ( currentlyLoaded.gameState.scores[0] >= 5 || currentlyLoaded.gameState.scores[1] >= 5 ) return;
        setTimeout(function() {
          ball.v = 70;
          var r = Math.floor(Math.random() * 90);
          ball.a = [r + 225,r + 45][winner == 0 ? 1 : 0];
          ball.preparing = false;
        },1500);
      },1000);
    }
    if ( ball.x <= 0 || ball.x >= canvas.width ) {
      if ( ball.a > 180 ) ball.a += 90;
      else ball.a -= 90;
    }
  }
  unmount() {
    clearInterval(currentlyLoaded.interval);
  }
}
