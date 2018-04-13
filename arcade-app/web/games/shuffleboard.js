class Shuffleboard {
  constructor() {
    this.gameState = {
      puck: {
        x: 0,
        s: 0,
        shooting: 0,
        direction: 1
      },
      points: {
        red: 0,
        blue: 0
      }
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
    ctx.fillStyle = "#590000";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
}
