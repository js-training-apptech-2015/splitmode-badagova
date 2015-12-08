var cells, // array contain cells of the game field
    freeCells, // array contain numbers of cells are available for the next move (use in one player mode)
    lastMove, // cell number where last move was made
    moveCounter, // total amount of moves were made from start a current round
    points1, points2, // player's points in currernt game
    mode, // boolean for not network modes, true - game with CPU, false - 2 players
    level, // level of computer's complexity
    first, // who makes first move in not network game
    turn,  // shows who makes next move
    networkGame, // an object for network game state
    playerNumber, // who made first move in current network game
	localPlayerNumber,// player number in current session, is used to player's name highlight
    checkTimer;

$(document).ready(newGame);
$(".field-table__cell").on("click", twoPlayersMoves);
mode = false;
$(".menu__item_new-game").on("click", newGame);
$(".menu__item_one-player").on("click", changeModeOnePlayer);
$(".menu__item_two-players").on("click", changeModeTwoPlayers);
$(".menu__item_network").on("click", changeModeNetworkGame);
$(".menu__item_easy").on("click", easyLevel);
$(".menu__item_medium").on("click", mediumLevel);
$(".menu__item_hard").on("click", hardLevel);
$(".menu__item_join-game").on("click", joinNetworkGame);

function changeModeTwoPlayers(evnt){ 
  $(".field-table__cell").off("click", onePlayerMoves);
  $(".field-table__cell").off("click", networkMoves);
  $(".field-table__cell").on("click", twoPlayersMoves);
  $(".menu__item_level").css("visibility", "hidden");
  if ($(".menu__item-join-game") !== null){
	  $(".menu__item_join-game").remove();
  }
  mode = false;
  changeNames("Player #1", "Player #2");
  newGame();
}

function changeModeOnePlayer(evnt){
  $(".field-table__cell").off("click", twoPlayersMoves);
  $(".field-table__cell").off("click", networkMoves);
  $(".field-table__cell").on("click", onePlayerMoves);
  $(".menu__item_level").css("visibility", "visible");
  if ($(".menu__item-join-game") !== null){
	  $(".menu__item_join-game").remove();
  }
  changeNames("You", "CPU");
  level = 2;
  mode = true;
  newGame();
}

function changeModeNetworkGame(evnt){
  $('<li class="menu__item menu__item_join-game"><a href="#">join game</a></li>').insertBefore(".menu__item_mode");
  $(".menu__item_join-game").on("click", joinNetworkGame);
  $(".field-table__cell").off("click", twoPlayersMoves);
  $(".field-table__cell").off("click", onePlayerMoves);
  $(".field-table__cell").on("click", networkMoves);
  $(".menu__item_new-game").off("click", newGame);
  $(".menu__item_new-game").on("click", newNetworkGame)
  clearScore();
  changeNames("Player #1", "Player #2");
}

function easyLevel(evnt){
  newGame();
  level = 1;
}

function mediumLevel(evnt){
  newGame();
  level = 2;
}

function hardLevel(evnt){
  newGame();
  level = 3;
}

function clearField(){ // prepeares field for new round
  fieldEmpty();
  first = !first;
  turn = first;
  cells = [0,0,0,0,0,0,0,0,0];  
  freeCells = [0,1,2,3,4,5,6,7,8];
  moveCounter = 0;
  lastMove = undefined;
  if (turn) {
    firstPlayerTurn();
  } else {
    secondPlayerTurn();
	if (mode) {
      setTimeout(onePlayerMoves,0);
    }
  }
}

function clearFieldNetwork(){ // prepeares field for new round
  fieldEmpty();
  cells = [0,0,0,0,0,0,0,0,0];  
  moveCounter = 0;
  lastMove = undefined;
}

function newGame(){
  first = false;
  clearField();
  $(".points__elem_first-player-points").text("0");
  $(".points__elem_second-player-points").text("0");
  clearScore();
}

function newNetworkGame(){
  playerNumber = 1;
  if (localPlayerNumber === undefined){
	localPlayerNumber = 1;
	changeNames("You", "Player #2");
  } 
  clearFieldNetwork();
  if (localPlayerNumber === 1){
	firstPlayerTurn();
  } else {
	secondPlayerTurn();
  }
  var xhr = new XMLHttpRequest(),
      body = '{"type": 0, "password": "abc"}';
  xhr.open('POST','http://aqueous-ocean-2864.herokuapp.com/games/', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function(){
    networkGame = JSON.parse(this.response);
	$(".field__game-token").text("Current game ID: " + networkGame.token);
  };
  xhr.onerror = function(){
    console.log(this.status);
  }; 
  xhr.send(body);
}

function joinNetworkGame(){
  playerNumber = 2;
  if (localPlayerNumber === undefined){
	localPlayerNumber = 2;
	changeNames("Player #1", "You");
  } 
  if (localPlayerNumber === 2){
	firstPlayerTurn();
  } else {
	secondPlayerTurn();
  }
  var gameToken = prompt("Please, insert the game ID, which you want to join!"),
      xhr = new XMLHttpRequest();
  xhr.open('GET','https://aqueous-ocean-2864.herokuapp.com/games/' + gameToken, true);
  xhr.onload = function(){
    networkGame = JSON.parse(this.response);
    $(".field__game-token").text("Current game ID: " + networkGame.token);
	if (networkGame.field1 !== 0){
		renderNetworkMove();
	} else {
      waitServer();
	}
  };
  xhr.onerror = function(){
    console.log(this.status);
  };
  xhr.send(null);
}

/*function showExistingGame(){
  var xhr = new XMLHttpRequest(),
      resp;
  xhr.open('GET','https://aqueous-ocean-2864.herokuapp.com/games', true);
  xhr.onload = function(){
    console.log(this.response);
  };
  xhr.onerror = function(){
    console.log(this.status);
  };
  xhr.send(null);
}*/

function checkNetworkGameState(gameToken){
  var xhr = new XMLHttpRequest();
  var resp;
  xhr.open('GET','https://aqueous-ocean-2864.herokuapp.com/games/' + gameToken, true);
  xhr.onload = function(){
    networkGame = JSON.parse(this.response);
  };
  xhr.onerror = function(){
    console.log(this.status);
  };
  xhr.send(null);
}

function makeNetworkMove (gameToken, pos){
  var xhr = new XMLHttpRequest(),
      body = '{"player": ' + playerNumber + ', "position": ' + pos +'}',
      resp; 
  xhr.open('PUT','https://aqueous-ocean-2864.herokuapp.com/games/' + gameToken, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function(){
    networkGame = JSON.parse(this.response);
    waitServer();
  };
  xhr.onerror = function(){
    console.log(this.status);
  };
  xhr.send(body);
}

function networkMoves(evnt){
  switch (networkGame.state){
    case "first-player-turn":{
      if (playerNumber == 1){
        lastMove = Number(this.id);
        makeNetworkMove(networkGame.token, lastMove);
        cells[lastMove] = 1;
        if (localPlayerNumber === 1){
	      secondPlayerTurn();
		} else {
		  firstPlayerTurn();
		}
      } else {
        alert("Ooops! It's not your turn.");  
      }
      break;
    }
    case "second-player-turn":{
      if (playerNumber == 2){
        lastMove = Number(this.id);
        makeNetworkMove(networkGame.token, lastMove);
        cells[lastMove] = -1;
        if (localPlayerNumber === 2){
	      firstPlayerTurn();
		} else {
		  secondPlayerTurn();
		}
      } else {
        alert("Ooops! It's not your turn.");
      }
      break;
    }
    default: {
      alert("You must start a new game or join one!");
      break;
    }
  }
  if (lastMove !== undefined){	
    if (cells[lastMove] > 0){
      $("#" + lastMove).text("X");
    } else {
      $("#" + lastMove).text("0");
    }
  }
}
 
function renderNetworkMove(){
  var cellNumber;
  moveCounter++;
  switch (true){
    case ((networkGame.state === "second-player-turn")&&(playerNumber === 2)):{
      for (var i = 1; i <= Math.pow(2,cells.length-1); i = i * 2){
        cellNumber = Math.log2(i);
        if (((networkGame.field1 & i) > 0) && (cells[cellNumber] == 0)){
          cells[cellNumber] = 1; 
          break;
        }
      }
	  if (localPlayerNumber === 2){
	    secondPlayerTurn();
	  } else {
		firstPlayerTurn();
	  }
	  break;
    } 
    case ((networkGame.state === "first-player-turn")&&(playerNumber === 1)):{
      for (var i = 1; i <= Math.pow(2,cells.length-1); i = i * 2){
        cellNumber = Math.log2(i);
        if (((networkGame.field2 & i) > 0) && (cells[cellNumber] == 0)){
          cells[cellNumber] = -1; 
          break;
        }
      }
	  if (localPlayerNumber === 1){
	      firstPlayerTurn();
		} else {
		  secondPlayerTurn();
		}
      break;
    }
  }
  if (cells[cellNumber] > 0){
    $("#" + cellNumber).text("X");
  } else if (cells[cellNumber] < 0){
    $("#" + cellNumber).text("0");
  }
}

function waitServer(){
  if ((networkGame.state === "first-player-wins")||
     (networkGame.state === "second-player-wins")||
     (networkGame.state === "tie")){
    showNetworkWinner();
  } else {
    var lastState = networkGame.state;
    checkTimer = setInterval(function(){
      checkNetworkGameState(networkGame.token);
      if (networkGame.state != lastState){
        clearInterval(checkTimer);
        if ((networkGame.state === "first-player-wins")||
           (networkGame.state === "second-player-wins")||
           (networkGame.state === "tie")){
          showNetworkWinner();     
        } else {
		  renderNetworkMove();
		}
      }
    }, 500);
  }
}

/*function deleteGame (gameToken){
  var xhr = new XMLHttpRequest(),
      resp;
  xhr.open('DELETE','http://aqueous-ocean-2864.herokuapp.com/games/' + gameToken, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function(){
    console.log(this.response);
  };
  xhr.onerror = function(){
    console.log(this.status);
  }; 
  xhr.send();
}*/

function twoPlayersMoves(evnt){ //game logic for two players mode
  lastMove = Number(this.id);
  if (cells[lastMove]===0){ // checks if the current cell isn't occupied
    if(turn){
      cells[Number(this.id)]=1; // saves '1' in current cell, if player 1 made move
  	  $(evnt.target).text("X");
      secondPlayerTurn();
	  moveCounter++;
  	  turn = false;
    } else {
  	  cells[Number(this.id)]=-1; // saves '-1' in current cell, if player 2 made move
  	  $(evnt.target).text("0");
      firstPlayerTurn();
      moveCounter++;
  	  turn = true;
    }
    if (checkWinner()){
      showWinner();
    }
  }
}

function onePlayerMoves(evnt){ //game logic for one player mode
  var win = false;
  lastMove = Number(this.id);
  if (turn){
    if (cells[lastMove]===0){ // checks if the current cell isn't occupied
      cells[Number(this.id)]=1; // saves '1' in current cell, if player made move
  	  $(evnt.target).text("X");
  	  moveCounter++;
      turn = false;
  	  freeCells.splice(freeCells.indexOf(Number(this.id)),1); // removes number of last move from array of available cells
      secondPlayerTurn();
      if (!checkWinner()){ // check if the player is a winner, else computer will move
        switch (level){
          case 1: {
            computerMoveEasy();
            break;
          }
          case 2: {
            computerMoveMedium();
            break;
          }
          case 3: {
            computerMoveHard();
            break;
          }
        }
        firstPlayerTurn();
        turn = true;
        moveCounter++; 
        if (checkWinner()){ // check if the computer is a winner 
          showWinner();
        }
      } else {
        showWinner();
      }
    }
  } else {
    switch (level){
      case 1: {
        computerMoveEasy();
        break;
      }
      case 2: {
        computerMoveMedium();
        break;
      }
      case 3: {
        computerMoveHard();
        break;
      }
    }
    firstPlayerTurn();
    turn = true;
    moveCounter++; 
  }
}

function computerMoveEasy(){ // logic for computer moves, when level is easy
  var cellId, 
      nextMove = Math.floor(Math.random()*(9-moveCounter));
  cells[freeCells[nextMove]] = -1; // saves '-1' in current cell, if computer made move
  lastMove = freeCells[nextMove];
  cellId = "#" + freeCells[nextMove];
  $(cellId).text("0");
  freeCells.splice(nextMove,1);
}

function computerMoveMedium(){ // logic for computer moves, when level is medium
  var nextMove = computerBaseLogic(), // index of possible next move in cells array
      cellId; // string contains the id of cell for jQuery
  cells[freeCells[nextMove]] = -1; // saves '-1' in current cell, if computer made move
  lastMove = freeCells[nextMove];
  cellId = "#" + freeCells[nextMove];
  $(cellId).text("0");
  freeCells.splice(nextMove,1);
}

function computerMoveHard(){ // logic for computer moves, when level is hard
  var nextMove, // index of possible next move in cells array
      cellId; // string contains the id of cell for jQuery
  if ((moveCounter < 2)&&(cells[4] == 0)){ // checks if the central cell is free
    nextMove = freeCells.indexOf(4); // occupies the central cell
  } else if (moveCounter < 3) { // checks counter of moves, if less then 3 cells are occupied, there are no two X in a row/column/diagonel
    do {                        // occupies one of the corner
        nextMove = Math.floor(Math.random()*5)*2; // returns cell #0,2,4,6 or 8, but 4 is already occupied because of first computer move
      } while(cells[nextMove] != 0); // if target cell is free, finish the loop
      nextMove = freeCells.indexOf(nextMove); // gets the index of future move in array of free cells (made for compatibility)
  } else {
    nextMove = computerBaseLogic(); // if more then two X are in a field, use base logic 
  }
  cells[freeCells[nextMove]] = -1; // saves '-1' in current cell, if computer made move
  lastMove = freeCells[nextMove];
  cellId = "#" + freeCells[nextMove];
  $(cellId).text("0");
  freeCells.splice(nextMove,1);
}

function computerBaseLogic(){// common part of computer logic for hard and medium level
  var nextMove,
      row = Math.floor(lastMove/3), //number of row where last move was made
      column = lastMove%3; //number of column where last move was made
  switch (true){ 
    case (cells[0]+cells[1]+cells[2]===-2):{// if the first row has two "0"
      for (var i = 0; i <= 2; i++) {        // make the next move in this row in available cell
        if (cells[i]===0){
          nextMove = freeCells.indexOf(i);
          break;
        }
      }
      break;
    }
    case (cells[3]+cells[4]+cells[5]===-2):{// if the second row has two "0"
      for (var i = 3; i <= 5; i++) {        // make the next move in this row in available cell
        if (cells[i]===0){
          nextMove = freeCells.indexOf(i);
          break;
        }
      }
      break;
    }
    case (cells[6]+cells[7]+cells[8]===-2):{// if the last row has two "0"
      for (var i = 6; i <= 8; i++) {        // make the next move in this row in available cell
        if (cells[i]===0){
          nextMove = freeCells.indexOf(i);
          break;
        }
      }
      break;
    }
    case (cells[0]+cells[3]+cells[6]===-2):{ // if the first column has two "0"
      for (var i = 0; i <= 6; i+=3) {        // make the next move in this column in available cell
        if (cells[i]===0){
          nextMove = freeCells.indexOf(i);
          break;
        }
      }
      break;
    }
    case (cells[1]+cells[4]+cells[7]===-2):{ // if the second column has two "0"
      for (var i = 1; i <= 7; i+=3) {        // make the next move in this column in available cell
        if (cells[i]===0){
          nextMove = freeCells.indexOf(i);
          break;
        }
      }
      break;
    }
    case (cells[2]+cells[5]+cells[8]===-2):{ // if the last column has two "0"
      for (var i = 2; i <= 8; i+=3) {        // make the next move in this column in available cell
        if (cells[i]===0){
          nextMove = freeCells.indexOf(i);
          break;
        }
      }
      break;
    }
    case (cells[0]+cells[4]+cells[8]===-2):{ // if the first diagonal has two "0"
      for (var i = 0; i <= 8; i+=4) {        // make the next move in this diagonal in available cell
        if (cells[i]===0){
          nextMove = freeCells.indexOf(i);
          break;
        }
      }
     break;
    }
    case (cells[2]+cells[4]+cells[6]===-2):{ // if the second diagonal has two "0"
      for (var i = 2; i <= 6; i+=2) {        // make the next move in this diagonal in available cell
        if (cells[i]===0){
          nextMove = freeCells.indexOf(i);
          break;
        }
      }
      break; 
    } 
    case (cells[row*3]+cells[row*3+1]+cells[row*3+2]===2):{ // if there is row with two "X"
      for (var i = row*3; i <= row*3+2; i++) {              
        if (cells[i]===0){
          nextMove = freeCells.indexOf(i);
          break;
        }
      }
      break;
    }
    case (cells[column]+cells[column+3]+cells[column+6]===2):{ // if there is column with two "X"
      for (var i = column; i <= column+6; i+=3) {
        if (cells[i]===0){
          nextMove = freeCells.indexOf(i);
          break;
        }
      }
      break;
    }
    case (cells[0]+cells[4]+cells[8]===2):{ //if the first diagonal has two "0"
      for (var i = 0; i <= 8; i+=4) {
        if (cells[i]===0){
          nextMove = freeCells.indexOf(i);
          break;
        }
      }
      break;
    }
    case (cells[2]+cells[4]+cells[6]===2):{ //if the second diagonal has two "X"
      for (var i = 2; i <= 6; i+=2) {
        if (cells[i]===0){
          nextMove = freeCells.indexOf(i);
          break;
        }
      } 
      break;
    }
    default:{
      nextMove = Math.floor(Math.random()*(9-moveCounter));
      break;
    }
  }
  return nextMove;
}

function checkWinner(){ //checks there is a winner or not
  var row = Math.floor(lastMove/3), //number of row where last move was made
      column = lastMove%3; //number of column where last move was made
  if ((Math.abs(cells[row*3]+cells[row*3+1]+cells[row*3+2])==3)||   // if sum of all elements in current    
  	  (Math.abs(cells[column]+cells[column+3]+cells[column+6])==3)||// row or column or one of diagonals
  	  (Math.abs(cells[0]+cells[4]+cells[8])==3)||                   // is 3 or -3, we have a winner
      (Math.abs(cells[2]+cells[4]+cells[6])==3)||
      (moveCounter == 9)){
    return true;
  }
  return false;
}

function showWinner(){ //shows which player won
  var message;
  if (moveCounter>=9){
    points1++;
    points2++;
    $(".points__elem_first-player-points").text(points1);
    $(".points__elem_second-player-points").text(points2);
    message = "It's a draw!";
  } else if(turn) {
  	points2 += 2;
  	$(".points__elem_second-player-points").text(points2);
  	message = "Player 0 won!";
  } else {
    points1 += 2;
    $(".points__elem_first-player-points").text(points1);
    message = "Player X won!";
  }
  if (confirm(message + " Do you want to start new game? (If you'll agree, you can't keep your score)")){
    newGame();
  } else {
    clearField();
  }
}

function showNetworkWinner(){ //shows which player won in network mode
  var message;
  switch (networkGame.state){
    case "tie":{
      points1++;
      points2++;
      $(".points__elem_first-player-points").text(points1);
      $(".points__elem_second-player-points").text(points2);
      message = "It's a draw!";
      break;
    } 
    case "first-player-wins":{
      if (localPlayerNumber === playerNumber) {
		points1 += 2;
        $(".points__elem_first-player-points").text(points1);
	  } else {
	    points2 += 2;
        $(".points__elem_second-player-points").text(points2);	  
	  }
      if (playerNumber === 1 ){
        message = "You're won!";
      } else {
        message = "You're lose...";
      }
      break;
    } 
    case "second-player-wins":{
      if (localPlayerNumber === playerNumber) {
		points2 += 2;
        $(".points__elem_second-player-points").text(points2);
	  } else {
		points1 += 2;
        $(".points__elem_first-player-points").text(points1);
	  }
      if (playerNumber === 2 ){
        message = "You're won!";
      } else {
        message = "You're lose...";
      }
      break;
    }
  }
  if (confirm(message + " Do you want to start new game?")){
    newNetworkGame();
  } else {
    clearFieldNetwork();
  }
  //clearScore();
}

function firstPlayerTurn (){
  $(".points__elem_first-player-name").css("background-color", "yellow");
  $(".points__elem_second-player-name").css("background-color", "white");
}

function secondPlayerTurn (){
  $(".points__elem_second-player-name").css("background-color", "yellow");
  $(".points__elem_first-player-name").css("background-color", "white");
}

function fieldEmpty(){
  $(".field-table__cell").empty();
  $(".field__game-token").empty();
}

function clearScore(){
  points1 = 0;
  points2 = 0;
  $(".points__elem_first-player-points").text(points1);
  $(".points__elem_second-player-points").text(points2);
}

function changeNames(name1, name2){
  $(".points__elem_first-player-name").text(name1);
  $(".points__elem_second-player-name").text(name2);
}