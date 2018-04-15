var easystar = new EasyStar.js();

class Pacman {
  constructor() {
    this.gameState = {
      objects: "0".repeat(5).split("").map(function(item,index) {
        return {
          x: 0,
          y: 0,
          frame: 0,
          direction: 0,
          nextDirection: -1,
          state: index == 0 ? 1 : 0,
          selectedPosition: [Math.floor(Math.random() * 19),Math.floor(Math.random() * 21)]
        }
      }),
      player: {
        level: 0,
        lives: 4,
        coins: 0,
        modeTimer: 149,
        killScreenArray: null
      },
      originalMap: `0000000000000000000
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
0000000000000000000`.split("\n").map(item => item.split("").map(jtem => parseInt(jtem))),
      map: null,
      gameActive: true
    }
    this.directionalAPI = {
      x: {
        positive: function() { currentlyLoaded.gameState.objects[0].nextDirection = 0 },
        negative: function() { currentlyLoaded.gameState.objects[0].nextDirection = 2 }
      },
      z: {
        positive: function() { currentlyLoaded.gameState.objects[0].nextDirection = 3 },
        negative: function() { currentlyLoaded.gameState.objects[0].nextDirection = 1 }
      },
      a: Function.prototype
    }
    this.metadata = {
      controllerType: 0,
      help: ``
    }
  }
  static metadata() {
    return {
      controllerType: 0,
      help: ``
    }
  }
  init() {
    currentlyLoaded.gameState.player.killScreenArray = currentlyLoaded.shuffle(["red","orange","yellow","green","blue","purple","white"]);
    currentlyLoaded.gameState.map = currentlyLoaded.gameState.originalMap.map(item => [].concat(item));
    currentlyLoaded.interval = setInterval(function() {
      currentlyLoaded.render();
    },10);
  }
  render() {
    function renderGhost(index) {
      var ghost = currentlyLoaded.gameState.objects[index];
      ctx.fillStyle = [null,"red","pink","lightblue","orange"][index];
      if ( ghost.state == 2 ) ctx.fillStyle = "blue";
      if ( ghost.state != 3 ) {
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
      }
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
      if ( ghost.frame % 30 == 0 && pacman.state == 0 ) {
        var chasePosition = [Math.round(pacman.x),Math.round(pacman.y)];
        if ( ghost.state < 2 ) {
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
        }
        if ( ghost.state == 1 ) chasePosition = [
          [null,1,map[0].length - 2,map[0].length - 2,1][index],
          [null,1,1,map.length - 2,map.length - 2][index]
        ];
        if ( ghost.state == 2 ) chasePosition = ghost.selectedPosition;
        if ( ghost.state == 3 ) chasePosition = [9,9];
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
          if ( ghost.state >= 1 ) ghost.state = 0;
        }
        easystar.setGrid(map);
        easystar.setAcceptableTiles([1,2,3,4]);
        easystar.findPath(Math.round(ghost.x),Math.round(ghost.y),Math.round(chasePosition[0]),Math.round(chasePosition[1]),function(path) {
          if ( ! path ) {
            ghost.direction = -1;
            return;
          }
          var nextSpace = path[1];
          if ( ! nextSpace ) {
            if ( ghost.state == 2 ) ghost.selectedPosition = [Math.floor(Math.random() * 19),Math.floor(Math.random() * 21)];
            if ( ghost.state == 3 ) setTimeout(function() {
              ghost.state = 0;
            },1000);
            return;
          }
          var differences = [nextSpace.x - Math.round(ghost.x),nextSpace.y - Math.round(ghost.y)];
          if ( differences[0] >= 1 ) ghost.direction = 0;
          if ( differences[1] >= 1 ) ghost.direction = 1;
          if ( differences[0] <= -1 ) ghost.direction = 2;
          if ( differences[1] <= -1 ) ghost.direction = 3;
        });
        easystar.calculate();
      }
      if ( Math.round(pacman.x) == Math.round(ghost.x) && Math.round(pacman.y) == Math.round(ghost.y) ) {
        if ( ghost.state >= 2 ) {
          ghost.state = 3;
        } else {
          pacman.state = 1;
          currentlyLoaded.gameState.player.modeTimer = 0;
        }
      }
      ghost.frame++;
      if ( ghost.frame >= 300 ) ghost.frame = 0;
    }
    if ( ! currentlyLoaded.gameState.gameActive ) return;
    var canvas = document.getElementById("pacman-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var map = currentlyLoaded.gameState.map;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    var unit = canvas.height / 23;
    for ( var i = 0; i < map.length; i++ ) {
      for ( var j = 0; j < map[0].length; j++ ) {
        if ( currentlyLoaded.gameState.player.level == 256 && j > 9 ) {
          ctx.fillStyle = currentlyLoaded.gameState.player.killScreenArray[(i * 19 + j) % 7];
          ctx.fillRect(unit * j,unit * i,unit,unit);
        } else if ( map[i][j] == 0 || map[i][j] == 4 ) {
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
    var timer = currentlyLoaded.gameState.player.modeTimer;
    if ( pacman.state == 0 || timer >= 150 ) {
      var directions = [
        map[Math.round(pacman.y)][Math.round(pacman.x - 0.45) + 1],
        map[Math.round(pacman.y - 0.45) + 1][Math.round(pacman.x)],
        map[Math.round(pacman.y)][Math.round(pacman.x + 0.45) - 1],
        map[Math.round(pacman.y + 0.45) - 1][Math.round(pacman.x)]
      ];
      if ( pacman.nextDirection == 0 && Math.round((pacman.y - Math.floor(pacman.y)) * 10) % 10 == 0 && directions[0] != 0 && directions[0] != 4 ) {
        pacman.direction = 0;
        pacman.nextDirection = -1;
      }
      if ( pacman.nextDirection == 1 && Math.round((pacman.x - Math.floor(pacman.x)) * 10) % 10 == 0 && directions[1] != 0 && directions[1] != 4 ) {
        pacman.direction = 1;
        pacman.nextDirection = -1;
      }
      if ( pacman.nextDirection == 2 && Math.round((pacman.y - Math.floor(pacman.y)) * 10) % 10 == 0 && directions[2] != 0 && directions[2] != 4 ) {
        pacman.direction = 2;
        pacman.nextDirection = -1;
      }
      if ( pacman.nextDirection == 3 && Math.round((pacman.x - Math.floor(pacman.x)) * 10) % 10 == 0 && directions[3] != 0 && directions[3] != 4 ) {
        pacman.direction = 3;
        pacman.nextDirection = -1;
      }
      if ( pacman.direction == 0 && directions[0] != 0 && directions[0] != 4 ) pacman.x += 0.05;
      if ( pacman.direction == 1 && directions[1] != 0 && directions[1] != 4 ) pacman.y += 0.05;
      if ( pacman.direction == 2 && directions[2] != 0 && directions[2] != 4 ) pacman.x -= 0.05;
      if ( pacman.direction == 3 && directions[3] != 0 && directions[3] != 4 ) pacman.y -= 0.05;
      if ( map[Math.round(pacman.y)][Math.round(pacman.x)] == 1 ) {
        currentlyLoaded.gameState.player.coins++;
        map[Math.round(pacman.y)][Math.round(pacman.x)] = 3;
      }
      if ( map[Math.round(pacman.y)][Math.round(pacman.x)] == 2 ) {
        currentlyLoaded.gameState.objects[1].state = 2;
        currentlyLoaded.gameState.objects[2].state = 2;
        currentlyLoaded.gameState.objects[3].state = 2;
        currentlyLoaded.gameState.objects[4].state = 2;
        map[Math.round(pacman.y)][Math.round(pacman.x)] = 3;
      }
      renderGhost(1);
      renderGhost(2);
      renderGhost(3);
      renderGhost(4);
    } else {
      ctx.fillStyle = "black";
      if ( pacman.state == 1 ) ctx.fillRect(unit * pacman.x,unit * pacman.y,unit,unit * Math.min(currentlyLoaded.gameState.player.modeTimer / 100,0.95));
      else if ( pacman.state == 2 && Math.floor(pacman.frame / 15) % 2 == 0 ) ctx.fillRect(unit * pacman.x,unit * pacman.y,unit,unit);
      if ( timer >= 149 ) {
        if ( pacman.state == 1 ) currentlyLoaded.gameState.player.lives--;
        else if ( pacman.state == 2 ) currentlyLoaded.gameState.player.level++;
        currentlyLoaded.gameState.map = currentlyLoaded.gameState.originalMap.map(item => [].concat(item));
        var xv = [9,9,8,9,10];
        var yv = [15,7,9,9,9];
        var objects = currentlyLoaded.gameState.objects;
        for ( var i = 0; i < objects.length; i++ ) {
          objects[i].x = xv[i];
          objects[i].y = yv[i];
          objects[i].direction = -1;
        }
      }
    }
    if ( pacman.x <= 0 && pacman.direction == 2 ) pacman.x = 18;
    if ( pacman.x >= 18 && pacman.direction == 0 ) pacman.x = 0;
    var lives = currentlyLoaded.gameState.player.lives;
    if ( pacman.state >= 1 && timer >= 300 ) {
      if ( lives > 0 ) currentlyLoaded.gameState.player.modeTimer = 0;
      pacman.state = 0;
      pacman.direction = 0;
      pacman.nextDirection = -1;
      currentlyLoaded.gameState.objects[1].state = 1;
      currentlyLoaded.gameState.objects[2].state = 1;
      currentlyLoaded.gameState.objects[3].state = 1;
      currentlyLoaded.gameState.objects[4].state = 1;
    }
    if ( pacman.state >= 1 && timer >= 150 ) {
      if ( lives > 0 ) {
        ctx.fillStyle = "yellow";
        ctx.font = "20px Lucida Grande";
        ctx.textAlign = "center";
        ctx.fillText("READY?",unit * 9.5,unit * 4.5);
      } else {
        ctx.fillStyle = "red";
        ctx.font = "40px Lucida Grande";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER",unit * 9.5,unit * 4.75);
        currentlyLoaded.gameState.gameActive = false;
      }
    }
    if ( currentlyLoaded.gameState.player.coins >= 146 ) {
      pacman.state = 2;
      currentlyLoaded.gameState.player.coins = 0;
      currentlyLoaded.gameState.player.modeTimer = 0;
    }
    pacman.frame++;
    if ( pacman.frame >= 100 ) pacman.frame = 0;
    ctx.fillStyle = "gold";
    for ( var i = 0; i < currentlyLoaded.gameState.player.lives; i++ ) {
      ctx.beginPath();
      ctx.arc(unit * (i + 0.5),unit * (map.length + 1),unit * 0.45,0.25 * Math.PI,1.75 * Math.PI);
      ctx.lineTo(unit * (i + 0.5),unit * (map.length + 1));
      ctx.fill();
    }
    var icons = ["000000000011\n000000001111\n000000110100\n000001000100\n022100010000\n222120010000\n222220212000\n232202212200\n022202222200\n000002322200\n000000222000","00000100000\n002221222200\n033322221300\n313132333330\n333333131330\n331313333330\n033333331300\n0031313333000\n0003333130000\n0000313300000\n0000033000000","000001110000\n000011100000\n002201020000\n022222222000\n222222222200\n222222222200\n222222222200\n222222222200\n022222222000\n022222222000\n000222200000","000001100000\n000111111000\n000112111000\n001121111100\n001121111100\n001211111100\n001211111100\n011211111110\n012111111110\n013333333310\n013333333310","022220200000\n002222233000\n033332333300\n333333333330\n333333333330\n333333333330\n333333333330\n333333333330\n033333333300\n033333333300\n003300033000","001111111000\n000000010000\n002333333300\n023222322230\n333222322230\n322333333330\n322322232200\n323322232200\n032233332300\n032232233000\n003332200000","100002000010\n100022200010\n132222222310\n113323233110\n111333331110\n011133311100\n001113111000\n000103010000\n000003000000\n000003000000\n000003000000","000111110000\n001100011000\n001111111000\n000111110000\n000022000000\n000020200000\n000020220000\n000020200000\n000020220000\n000020200000\n000002000000"].map(item => item.split("\n").map(jtem => jtem.split("").map(ktem => parseInt(ktem))));
    icons = icons.map(item => ["0".repeat(12).split("").map(jtem => 0)].concat(item));
    icons = icons.map(item => item.map((jtem,i) => item.map(ktem => ktem[i])));
    var palette = [
      ["black","#dd9351","red","white"],
      ["black","white","#00ff00","red"],
      ["black","#00ff00","orange"],
      ["black","yellow","white","#00ccff"],
      ["black","white","#00ff00","red"],
      ["black","#dd9351","#00ff00","green"],
      ["black","blue","red","yellow"],
      ["black","#00ccff","lightgray"]
    ];
    var indices = [0,1,2,2,3,3,4,4,5,5,6,6,7,7,7,7,7,7,7];
    var level = currentlyLoaded.gameState.player.level;
    var xcount = -1;
    for ( var i = Math.max(Math.min(level,18) - 6,0); i <= Math.min(level,18); i++ ) {
      xcount++;
      var icon = icons[indices[i]];
      for ( var j = 0; j < icon.length; j++ ) {
        for ( var k = 0; k < icon[j].length; k++ ) {
          ctx.fillStyle = palette[indices[i]][icon[j][k]];
          ctx.fillRect(unit * (map[0].length - (xcount + 1) + j / 12),unit * (map.length + 0.5 + k / 12),unit / 12,unit / 12);
        }
      }
    }
    if ( timer % 2000 == 0 && timer <= 6000 ) {
      currentlyLoaded.gameState.objects[1].state = 1;
      currentlyLoaded.gameState.objects[2].state = 1;
      currentlyLoaded.gameState.objects[3].state = 1;
      currentlyLoaded.gameState.objects[4].state = 1;
    }
    currentlyLoaded.gameState.player.modeTimer++;
  }
  shuffle(a) {
    for ( var i = a.length - 1; i > 0; i-- ) {
      var j = Math.floor(Math.random() * (i + 1));
      var x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }
  unmount() {
    clearInterval(currentlyLoaded.interval);
  }
}
