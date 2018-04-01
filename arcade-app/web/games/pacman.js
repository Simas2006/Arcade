var easystar = new EasyStar.js();

class Pacman {
  constructor() {
    this.gameState = {
      objects: "0".repeat(5).split("").map(function(item,index) {
        return {
          x: [9,8,9,9,10][index],
          y: [15,9,7,9,9][index],
          frame: 0,
          direction: 0,
          state: 0
        }
      }),
      player: {
        level: 1,
        lives: 0,
        modeTimer: 0
      },
      map: `0000000000000000000
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
0000000000000000000`.split("\n").map(item => item.split("").map(jtem => parseInt(jtem)))
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
      ctx.fillStyle = [null,"red","pink","lightblue","orange"][index];
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
      if ( ghost.direction == 0 ) ghost.x += 0.033;
      if ( ghost.direction == 1 ) ghost.y += 0.033;
      if ( ghost.direction == 2 ) ghost.x -= 0.033;
      if ( ghost.direction == 3 ) ghost.y -= 0.033;
      if ( ghost.frame % 30 == 0 ) {
        var chasePosition = [Math.round(pacman.x),Math.round(pacman.y)];
        if ( index == 2 ) {
          if ( pacman.direction == 0 ) chasePosition[0] += 2;
          if ( pacman.direction == 1 ) chasePosition[1] += 2;
          if ( pacman.direction == 2 ) chasePosition[0] -= 2;
          if ( pacman.direction == 3 ) chasePosition[1] -= 2;
        }
        if ( index == 3 ) {
          var dx = Math.round(currentlyLoaded.gameState.objects[1].x) - Math.round(pacman.x);
          var dy = Math.round(currentlyLoaded.gameState.objects[1].y) - Math.round(pacman.y);
          chasePosition = [Math.round(currentlyLoaded.gameState.objects[1].x + dx),Math.round(currentlyLoaded.gameState.objects[1].y + dy)];
          if ( chasePosition[0] < 0 ) chasePosition[0] = 1;
          if ( chasePosition[1] < 0 ) chasePosition[1] = 1;
          if ( chasePosition[0] > map[0].length - 1 ) chasePosition[0] = map[0].length - 1;
          if ( chasePosition[1] > map.length - 1 ) chasePosition[1] = map.length - 1;
        }
        if ( index == 4 ) {
          var dx = Math.round(ghost.x) - Math.round(pacman.x);
          var dy = Math.round(ghost.y) - Math.round(pacman.y);
          var distance = Math.sqrt(dx * dx + dy * dy);
          if ( distance < 8 ) ghost.state = 1;
        }
        if ( ghost.state == 1 ) chasePosition = [
          [null,1,map[0].length - 2,map[0].length - 2,1][index],
          [null,1,1,map.length - 2,map.length - 2][index]
        ];
        if ( chasePosition[0] < 1 ) chasePosition[0] = 1;
        if ( chasePosition[1] > map.length - 2 ) chasePosition[1] = map.length - 2;
        if ( chasePosition[0] > map[0].length - 2 ) chasePosition[0] = map[0].length - 2;
        if ( chasePosition[1] < 1 ) chasePosition[1] = 1;
        if ( map[chasePosition[1]][chasePosition[0]] == 0 ) {
          if ( map[chasePosition[1]][chasePosition[0] + 1] != 0 ) chasePosition[0]++;
          else if ( map[chasePosition[1] + 1][chasePosition[0]] != 0 ) chasePosition[1]++;
          else if ( map[chasePosition[1]][chasePosition[0] - 1] != 0 ) chasePosition[0]--;
          else if ( map[chasePosition[1] - 1][chasePosition[0]] != 0 ) chasePosition[1]--;
        }
        if ( Math.round(ghost.y) == chasePosition[1] && Math.round(ghost.x) == chasePosition[0] ) {
          ghost.direction = -1;
          if ( ghost.state == 1 ) ghost.state = 0;
        }
        easystar.setGrid(map);
        easystar.setAcceptableTiles([1,2,3,4,5]);
        easystar.findPath(Math.round(ghost.x),Math.round(ghost.y),Math.round(chasePosition[0]),Math.round(chasePosition[1]),function(path) {
          if ( ! path ) {
            ghost.direction = -1;
            return;
          }
          var nextSpace = path[1];
          if ( ! nextSpace ) return;
          var differences = [nextSpace.x - Math.round(ghost.x),nextSpace.y - Math.round(ghost.y)];
          if ( differences[0] >= 1 ) ghost.direction = 0;
          if ( differences[1] >= 1 ) ghost.direction = 1;
          if ( differences[0] <= -1 ) ghost.direction = 2;
          if ( differences[1] <= -1 ) ghost.direction = 3;
        });
        easystar.calculate();
      }
      ghost.frame++;
      if ( ghost.frame >= 300 ) ghost.frame = 0;
    }
    var canvas = document.getElementById("pacman-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var map = currentlyLoaded.gameState.map;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    var unit = Math.min(canvas.width,canvas.height) / 21;
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
    var directions = [
      map[Math.round(pacman.y)][Math.round(pacman.x - 0.45) + 1],
      map[Math.round(pacman.y - 0.45) + 1][Math.round(pacman.x)],
      map[Math.round(pacman.y)][Math.round(pacman.x + 0.45) - 1],
      map[Math.round(pacman.y + 0.45) - 1][Math.round(pacman.x)]
    ];
    if ( pacman.direction == 0 && directions[0] != 0 && directions[0] != 4 ) pacman.x += 0.05;
    if ( pacman.direction == 1 && directions[1] != 0 && directions[1] != 4 ) pacman.y += 0.05;
    if ( pacman.direction == 2 && directions[2] != 0 && directions[2] != 4 ) pacman.x -= 0.05;
    if ( pacman.direction == 3 && directions[3] != 0 && directions[3] != 4 ) pacman.y -= 0.05;
    if ( map[Math.round(pacman.y)][Math.round(pacman.x)] == 1 ) map[Math.round(pacman.y)][Math.round(pacman.x)] = 3;
    pacman.frame++;
    if ( pacman.frame >= 100 ) pacman.frame = 0;
    renderGhost(1);
    renderGhost(2);
    renderGhost(3);
    renderGhost(4);
    var timer = currentlyLoaded.gameState.player.modeTimer;
    if ( timer % 2000 == 0 && timer <= 6000 ) {
      currentlyLoaded.gameState.objects[1].state = 1;
      currentlyLoaded.gameState.objects[2].state = 1;
      currentlyLoaded.gameState.objects[3].state = 1;
      currentlyLoaded.gameState.objects[4].state = 1;
    }
    currentlyLoaded.gameState.player.modeTimer++;
  }
}
