class Blackjack {
  constructor() {
    this.gameState = {
      activeDeck: [],
      player: {
        sum: 0,
        aces: 0
      },
      dealer: {
        sum: 0,
        aces: 0
      },
      mode: 0
    }
    this.winner = 0;
    this.directionalAPI = {
      x: {
        positive: Function.prototype,
        negative: Function.prototype
      },
      z: {
        positive: this.hit,
        negative: this.stand
      },
      a: Function.prototype
    }
    this.metadata = {
      controllerType: 0
    }
  }
  init() {
    for ( var i = 1; i <= 13; i++ ) {
      for ( var j = 0; j < 4; j++ ) {
        currentlyLoaded.gameState.activeDeck.push(["CDHS".split("")[j],i]);
      }
    }
    currentlyLoaded.gameState.activeDeck = currentlyLoaded.shuffle(currentlyLoaded.gameState.activeDeck);
    currentlyLoaded.hit();
    currentlyLoaded.hit();
  }
  hit() {
    if ( currentlyLoaded.gameState.mode != 0 ) return;
    if ( currentlyLoaded.gameState.activeDeck.length <= 0 ) {
      for ( var i = 1; i <= 13; i++ ) {
        for ( var j = 0; j < 4; j++ ) {
          currentlyLoaded.gameState.activeDeck.push(["CDHS".split("")[j],i]);
        }
      }
      currentlyLoaded.gameState.activeDeck = currentlyLoaded.shuffle(currentlyLoaded.gameState.activeDeck);
    }
    var selected = currentlyLoaded.gameState.activeDeck[0];
    var number = selected[1];
    currentlyLoaded.gameState.activeDeck = currentlyLoaded.gameState.activeDeck.slice(1);
    currentlyLoaded.renderCard(document.getElementById("bj-player-cards"),selected);
    currentlyLoaded.gameState.player.sum += Math.min(number == 1 ? 11 : number,11);
    if ( number == 1 ) currentlyLoaded.gameState.player.aces++;
    if ( currentlyLoaded.gameState.player.sum > 21 ) {
      if ( currentlyLoaded.gameState.player.aces > 0 ) {
        currentlyLoaded.gameState.player.sum -= 10;
        currentlyLoaded.gameState.player.aces--;
      } else {
        currentlyLoaded.winner = 1;
      }
    }
    if ( currentlyLoaded.gameState.player.sum == 21 ) {
      currentlyLoaded.winner = 2;
    }
    document.getElementById("bj-player-info").innerText = `Player cards: (Total = ${currentlyLoaded.gameState.player.sum}) ${["","LOSS","WIN"][currentlyLoaded.winner]}`;
    document.getElementById("bj-dealer-info").innerText = `Dealer cards: (Total = ${currentlyLoaded.gameState.dealer.sum}) ${["","WIN","LOSS"][currentlyLoaded.winner]}`;
  }
  stand() {
    currentlyLoaded.gameState.mode = 1;
    var interval = setInterval(function() {
      if ( currentlyLoaded.gameState.activeDeck.length <= 0 ) {
        for ( var i = 1; i <= 13; i++ ) {
          for ( var j = 0; j < 4; j++ ) {
            currentlyLoaded.gameState.activeDeck.push(["CDHS".split("")[j],i]);
          }
        }
        currentlyLoaded.gameState.activeDeck = currentlyLoaded.shuffle(currentlyLoaded.gameState.activeDeck);
      }
      var selected = currentlyLoaded.gameState.activeDeck[0];
      var number = selected[1];
      currentlyLoaded.gameState.activeDeck = currentlyLoaded.gameState.activeDeck.slice(1);
      currentlyLoaded.renderCard(document.getElementById("bj-dealer-cards"),selected);
      currentlyLoaded.gameState.dealer.sum += Math.min(number == 1 ? 11 : number,11);
      if ( number == 1 ) currentlyLoaded.gameState.dealer.aces++;
      if ( currentlyLoaded.gameState.dealer.sum > 21 ) {
        if ( currentlyLoaded.gameState.dealer.aces > 0 ) {
          currentlyLoaded.gameState.dealer.sum -= 10;
          currentlyLoaded.gameState.dealer.aces--;
        } else {
          currentlyLoaded.gameState.dealer.sum -= Math.min(number == 1 ? 11 : number,11);
          if ( currentlyLoaded.gameState.dealer.sum >= currentlyLoaded.gameState.player.sum ) currentlyLoaded.winner = 1;
          else currentlyLoaded.winner = 2;
        }
      }
      if ( currentlyLoaded.gameState.dealer.sum == 21 ) currentlyLoaded.winner = 1;
      if ( currentlyLoaded.gameState.dealer.sum >= currentlyLoaded.gameState.player.sum ) currentlyLoaded.winner = 1;
      if ( currentlyLoaded.winner > 0 ) clearInterval(interval);
      document.getElementById("bj-player-info").innerText = `Player cards: (Total = ${currentlyLoaded.gameState.player.sum}) ${["","LOSS","WIN"][currentlyLoaded.winner]}`;
      document.getElementById("bj-dealer-info").innerText = `Dealer cards: (Total = ${currentlyLoaded.gameState.dealer.sum}) ${["","WIN","LOSS"][currentlyLoaded.winner]}`;
    },1000);
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
  renderCard(element,cardID) {
    var cardNumber = parseInt(cardID[1]);
    cardID[0] = "CDHS".split("").indexOf(cardID[0]);
    cardID[1] = "_A23456789TJQK".split("")[cardNumber];
    function drawClub(x,y,scale) {
      var width = card.width / scale * 1.5;
      var height = card.height / scale * 1.5;
      var circleRadius = width * 0.15
      var bottomWidth = width * 0.7;
      var bottomHeight = height * 0.5;
      ctx.beginPath();
      ctx.arc(x,y + circleRadius * 1.5 - 5,circleRadius + 1,0,2 * Math.PI,false);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + circleRadius * 1.5,y + 17,circleRadius + 1,0,2 * Math.PI,false);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x - circleRadius * 1.5,y + 17,circleRadius + 1,0,2 * Math.PI,false);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x,y + (height * 0.5),circleRadius / 2,0,2 * Math.PI,false);
      ctx.fill();
      ctx.moveTo(x,y + (height * 0.6));
      ctx.quadraticCurveTo(x,y + height,x - bottomWidth / 2,y + height);
      ctx.lineTo(x + bottomWidth / 2,y + height);
      ctx.quadraticCurveTo(x,y + height,x,y + (height * 0.6));
      ctx.closePath();
      ctx.fill();
    }
    function drawDiamond(x,y,scale) {
      var width = card.width / scale * 1.5;
      var height = card.height / scale * 1.5;
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.lineTo(x - width / 2,y + height / 2);
      ctx.lineTo(x,y + height);
      ctx.lineTo(x + width / 2,y + height / 2);
      ctx.closePath();
      ctx.fill();
    }
    function drawHeart(x,y,scale) {
      var width = card.width / scale * 1.5;
      var height = card.height / scale * 1.5;
      var topCurveHeight = height * 0.3;
      ctx.beginPath();
      ctx.moveTo(x,y + topCurveHeight);
      ctx.bezierCurveTo(x,y,x - width / 2,y,x - width / 2,y + topCurveHeight);
      ctx.bezierCurveTo(x - width / 2,y + (height + topCurveHeight) / 2,x,y + (height + topCurveHeight) / 2,x,y + height);
      ctx.bezierCurveTo(x,y + (height + topCurveHeight) / 2,x + width / 2,y + (height + topCurveHeight) / 2,x + width / 2,y + topCurveHeight);
      ctx.bezierCurveTo(x + width / 2,y,x,y,x,y + topCurveHeight);
      ctx.closePath();
      ctx.fill();
    }
    function drawSpade(x,y,scale) {
      var width = card.width / scale * 1.5;
      var height = card.height / scale * 1.5;
      var bottomWidth = width * 0.7;
      var topHeight = height * 0.7;
      var bottomHeight = height * 0.3;
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.bezierCurveTo(x,y + topHeight / 2,x - width / 2,y + topHeight / 2,x - width / 2,y + topHeight);
      ctx.bezierCurveTo(x - width / 2,y + topHeight * 1.3,x,y + topHeight * 1.3,x,y + topHeight);
      ctx.bezierCurveTo(x,y + topHeight * 1.3,x + width / 2,y + topHeight * 1.3,x + width / 2,y + topHeight);
      ctx.bezierCurveTo(x + width / 2,y + topHeight / 2,x,y + topHeight / 2,x,y);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x,y + topHeight);
      ctx.quadraticCurveTo(x,y + topHeight + bottomHeight,x - bottomWidth / 2,y + topHeight + bottomHeight);
      ctx.lineTo(x + bottomWidth / 2,y + topHeight + bottomHeight);
      ctx.quadraticCurveTo(x,y + topHeight + bottomHeight,x,y + topHeight);
      ctx.closePath();
      ctx.fill();
    }
    var patterns = [[[0,0,0],[0,0,0],[0,1,0],[0,0,0],[0,0,0]],[[0,1,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0]],[[0,1,0],[0,0,0],[0,1,0],[0,0,0],[0,1,0]],[[1,0,1],[0,0,0],[0,0,0],[0,0,0],[1,0,1]],[[1,0,1],[0,0,0],[0,1,0],[0,0,0],[1,0,1]],[[1,0,1],[0,0,0],[1,0,1],[0,0,0],[1,0,1]],[[1,0,1],[0,1,0],[1,0,1],[0,0,0],[1,0,1]],[[1,0,1],[0,1,0],[1,0,1],[0,1,0],[1,0,1]],[[1,0,1],[1,0,1],[0,1,0],[1,0,1],[1,0,1]],[[1,0,1],[1,0,1],[1,0,1],[1,0,1],[1,0,1]],[[0,0,0],[0,0,0],[0,1,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,1,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,1,0],[0,0,0],[0,0,0]]];
    var card = document.createElement("canvas");
    element.appendChild(card);
    var ctx = card.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,card.width,card.height);
    ctx.fillStyle = ["black","red","red","black"][cardID[0]];
    ctx.strokeStyle = ["black","red","red","black"][cardID[0]];
    ctx.font = "35px Arial";
    ctx.fillText(cardID[1],2,28);
    ctx.fillText(cardID[1],card.width - 22,28);
    ctx.fillText(cardID[1],2,card.height - 5);
    ctx.fillText(cardID[1],card.width - 22,card.height - 5);
    ctx.strokeRect(25,5,card.width - 50,card.height - 10);
    var selected = patterns[cardNumber - 1];
    for ( var i = 0; i < selected.length; i++ ) {
      for ( var j = 0; j < selected[i].length; j++ ) {
        var f = [drawClub,drawDiamond,drawHeart,drawSpade][cardID[0]];
        if ( selected[i][j] == 1 ) f(card.width * 0.25 * (j + 1),card.height * 0.18 * i + [5,4,5,3][cardID[0]],7,7.5);
      }
    }
    if ( cardNumber > 10 ) {
      ctx.font = "100px Arial";
      ctx.fillText(cardID[1],card.width * 0.1,card.height * 0.75);
      ctx.fillText(cardID[1],card.width * 0.65,card.height * 0.75);
    }
  }
}
