class PingPong {
  constructor() {
    this.gameState = {
      paddles: [
        {
          x: 400,
          v: 100,
          saveV: 0,
          shooting: 0
        },
        {
          x: 200,
          v: 100,
          saveV: 0,
          shooting: 0
        }
      ],
      ball: {
        x: 200,
        y: 0,
        g: 100,
        a: 90,
        v: 100,
        goingUp: false
      }
    }
  }
  init() {
    setInterval(function() {
      currentlyLoaded.render();
    },10);
  }
  render() {
    var canvas = document.getElementById("pingpong-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "green";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height * 0.05);
    ctx.fillRect(0,canvas.height * 0.95,canvas.width,canvas.height * 0.05);
    ctx.fillStyle = "gray";
    ctx.fillRect(0,canvas.height / 2 - 10,canvas.width,20);
    var paddles = currentlyLoaded.gameState.paddles;
    ctx.fillStyle = "red";
    ctx.fillRect(paddles[0].x - 100,canvas.height * 0.07 * ((100 - paddles[0].v) / 100),200,canvas.height * 0.05);
    ctx.fillStyle = "blue";
    ctx.fillRect(paddles[1].x - 100,canvas.height * (1 - 0.15 * ((100 - paddles[1].v) / 100) - 0.05),200,canvas.height * 0.05);
    var ball = currentlyLoaded.gameState.ball;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,5 + 20 * (ball.g / 100),0,2 * Math.PI);
    ctx.fill();
    ball.x += (ball.v / 50) * Math.cos(Math.PI * ball.a / 180);
    ball.y += (ball.v / 50) * Math.sin(Math.PI * ball.a / 180);
    ball.v *= 0.998;
    ball.g += ball.goingUp ? 1 : -1;
    if ( ball.g <= 0 ) {
      if ( ! ball.stopped ) ball.goingUp = true;
      else ball.g = 1;
    }
    if ( ball.g >= ball.v * 1.5 ) ball.goingUp = false;
    if ( paddles[0].shooting > 0 ) {
      if ( paddles[0].shooting == 1 ) {
        paddles[0].saveV = paddles[0].v;
        paddles[0].shooting = 2;
      }
      paddles[0].v = Math.max(paddles[0].v - 5,0);
      if ( paddles[0].v == 0 ) {
        paddles[0].saveV = 0;
        if ( paddles[1].saveV == 0 ) paddles[1].shooting = false;
      }
    }
    if ( paddles[1].shooting > 0 ) {
      if ( paddles[1].shooting == 1 ) {
        paddles[1].saveV = paddles[0].v;
        paddles[1].shooting = 2;
      }
      paddles[1].v = Math.max(paddles[1].v - 5,0);
      if ( paddles[1].v == 0 ) {
        paddles[1].saveV--;
        if ( paddles[1].saveV == 0 ) paddles[1].shooting = false;
      }
    }
    if ( ball.x >= paddles[0].x - 100 && ball.x <= paddles[0].x + 100 && ball.y <= canvas.height * (0.07 * ((100 - paddles[0].v) / 100) + 0.05) ) {
      var result = ball.a + 180;
      if ( result >= 360 ) result -= 360;
      if ( result <= 180 ) ball.a = result;
      ball.v = Math.min(ball.v + paddles[0].saveV,100);
    }
    if ( ball.x >= paddles[1].x - 100 && ball.x <= paddles[1].x + 100 && ball.y >= canvas.height * (1 - 0.15 * ((100 - paddles[1].v) / 100) - 0.05) ) {
      var result = ball.a + 180;
      if ( result >= 360 ) result -= 360;
      if ( result > 180 ) ball.a = result;
      ball.v = Math.min(ball.v + paddles[1].saveV,100);
    }
  }
}
