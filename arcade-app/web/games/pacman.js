class Pacman {
  constructor() {
    this.gameState = {
      objects: "0".repeat(5).split("").map(function(item,index) {
        return {
          x: index + 1,
          y: 1,
          frame: 0,
          direction: 0,
          state: 0,
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
    function renderGhost(index) {
      var ghost = currentlyLoaded.gameState.objects[index];
      ctx.fillStyle = [null,"orange","red","pink","lightblue"][index];
      ctx.beginPath();
      ctx.arc(unit * (ghost.x + 0.5),unit * (ghost.y + 0.5),unit * 0.45,1 * Math.PI,2 * Math.PI);
      ctx.lineTo(unit * (ghost.x + 0.5),unit * (ghost.y + 0.5));
      ctx.fill();
      ctx.fillRect(unit * ghost.x + 1,unit * (ghost.y + 0.5) - 1,unit - 2,unit * 0.25);
      ctx.moveTo(unit * ghost.x,unit * (ghost.y + 0.7));
      ctx.lineTo(unit * (ghost.x + 0.16),unit * (ghost.y + 1));
      ctx.lineTo(unit * (ghost.x + 0.33),unit * (ghost.y + 0.7));
      ctx.lineTo(unit * (ghost.x + 0.50),unit * (ghost.y + 1));
      ctx.lineTo(unit * (ghost.x + 0.66),unit * (ghost.y + 0.7));
      ctx.lineTo(unit * (ghost.x + 0.82),unit * (ghost.y + 1));
      ctx.lineTo(unit * (ghost.x + 1),unit * (ghost.y + 0.7));
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(unit * (ghost.x + 0.35),unit * (ghost.y + 0.4),7,0,2 * Math.PI);
      ctx.lineTo(unit * (ghost.x + 0.35),unit * (ghost.y + 0.4));
      ctx.fill();
      ctx.beginPath();
      ctx.arc(unit * (ghost.x + 0.65),unit * (ghost.y + 0.4),7,0,2 * Math.PI);
      ctx.lineTo(unit * (ghost.x + 0.65),unit * (ghost.y + 0.4));
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(unit * (ghost.x + 0.35),unit * (ghost.y + 0.4),3,0,2 * Math.PI);
      ctx.lineTo(unit * (ghost.x + 0.35),unit * (ghost.y + 0.4));
      ctx.fill();
      ctx.beginPath();
      ctx.arc(unit * (ghost.x + 0.65),unit * (ghost.y + 0.4),3,0,2 * Math.PI);
      ctx.lineTo(unit * (ghost.x + 0.65),unit * (ghost.y + 0.4));
      ctx.fill();
    }
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
    ctx.fillStyle = "gold";
    var pacman = currentlyLoaded.gameState.objects[0];
    ctx.beginPath();
    ctx.arc(unit * (pacman.x + 0.5),unit * (pacman.y + 0.5),unit * 0.45,((pacman.frame >= 50 ? 50 - (pacman.frame - 50) : pacman.frame) * 0.006 + pacman.direction * 0.5) * Math.PI,(2 - (pacman.frame >= 50 ? 50 - (pacman.frame - 50) : pacman.frame) * 0.006 + pacman.direction * 0.5) * Math.PI);
    ctx.lineTo(unit * (pacman.x + 0.5),unit * (pacman.y + 0.5));
    ctx.fill();
    pacman.frame++;
    if ( pacman.frame >= 100 ) pacman.frame = 0;
    renderGhost(1);
    renderGhost(2);
    renderGhost(3);
    renderGhost(4);
  }
}
