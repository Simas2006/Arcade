class Pacman {
  constructor() {
    this.gameState = {
      objects: "0".repeat(5).split("").map(function(item,index) {
        return {
          x: index + 1,
          y: 1,
          frame: 0
        }
      }),
      level: 1,
      lives: 0
    }
  }
  init() {
    setInterval(function() {
      currentlyLoaded.render();
    },10);
  }
  render() {
    var map = `0000000000000000000
0111111110111111110
0200100010100010020
0111111110111111110
0100101000001010010
0111101110111011110
0000100030300010000
3330103333333010333
0000103004003010000
3333133033303313333
0000103000003010000
3330103333333010333
0000100030300010000
0111111110111111110
0100100010100010010
0210111111111110120
0010101000001010100
0111101110111011110
0100000010100000010
0111111111111111110
0000000000000000000`.split("\n").map(item => item.split(""));
    var canvas = document.getElementById("pacman-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    var unit = Math.min(canvas.width,canvas.height) / 19;
    for ( var i = 0; i < map.length; i++ ) {
      for ( var j = 0; j < map[0].length; j++ ) {
        if ( map[i][j] == 0 || map[i][j] == 4 ) {
          ctx.fillStyle = ["#365fa7",null,null,null,"brown"][map[i][j]];
          ctx.fillRect(unit * j,unit * i,unit,unit);
        } else if ( map[i][j] == 1 || map[i][j] == 2 ) {
          ctx.fillStyle = "yellow";
          ctx.beginPath();
          ctx.arc(unit * (j + 0.5),unit * (i + 0.5),10 * map[i][j],0,2 * Math.PI);
          ctx.fill();
        }
      }
    }
  }
}
