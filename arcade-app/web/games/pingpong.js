class PingPong {
  constructor() {
    this.gameState = {
      paddles: [
        {
          x: 200,
          v: 100
        },
        {
          x: 200,
          v: 100
        }
      ],
      ball: {
        x: 100,
        y: 100,
        g: 100,
        a: 0
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
    ctx.fillStyle = "#824210";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height * 0.05);
    ctx.fillRect(0,canvas.height * 0.95,canvas.width,canvas.height * 0.05);
    var paddles = currentlyLoaded.gameState.paddles;
    ctx.fillStyle = "red";
    ctx.fillRect(paddles[0].x - 100,canvas.height * 0.07 * ((100 - paddles[0].v) / 100),200,canvas.height * 0.05);
    ctx.fillStyle = "blue";
    ctx.fillRect(paddles[1].x - 100,canvas.height * (1 - 0.07 * ((100 - paddles[1].v) / 100) - 0.05),200,canvas.height * 0.05);
    var ball = currentlyLoaded.gameState.ball;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,5 + 20 * (ball.g / 100),0,2 * Math.PI);
    ctx.fill();
  }
}
