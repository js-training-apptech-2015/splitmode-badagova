var cells, // array contain cells of the game field
    freeCells, // array contain numbers of cells are available for the next move (use in one player mode)
    lastMove, // cell number where last move was made
    moveCounter, // total amount of moves were made from start a current round
    points1, points2, // player's points in currernt game
    turn = false; // shows who does next move

$(document).ready(newGame);
$(".cell").bind("click", onePlayerMoves);
$("#menu__newgame").bind("click", newGame);
$("#menu__oneplayer").bind("click", changeModeOnePlayer);
$("#menu__twoplayers").bind("click", changeModeTwoPlayers);

function clearField(){ // prepeares field for new round
  $(".cell").empty();
  turn = !turn; //changes the player who make a move first
  cells = [0,0,0,0,0,0,0,0,0];	
  freeCells = [0,1,2,3,4,5,6,7,8];
  moveCounter = 0;
}

function newGame(){
  clearField();
  $("#score1").text("0");
  $("#score2").text("0");
  points1 = 0;
  points2 = 0;
}

function changeModeTwoPlayers(evnt){
  newGame();
  $(".cell").bind("click", onePlayerMoves);
  $(".cell").bind("click", twoPlayersMoves);
}

function changeModeOnePlayer(evnt){
  newGame();
  $(".cell").unbind("click", twoPlayersMoves);
  $(".cell").bind("click", onePlayerMoves);
}

function twoPlayersMoves(evnt){ //is game logic for two players mode
  lastMove = Number(this.id);
  if (cells[lastMove]===0){ // checks if the current cell isn't occupied
    if(turn){
  	  cells[Number(this.id)]=1; // saves '1' in current cell, if player 1 made move
  	  $(evnt.target).text("X");
  	  turn = false;
    } else {
  	  cells[Number(this.id)]=-1; // saves '-1' in current cell, if player 2 made move
  	  $(evnt.target).text("0");
  	  turn = true;
    }
    checkWinner(); 	  
  }
}

function onePlayerMoves(evnt){ //is game logic for one player mode
  lastMove = Number(this.id);
  if (cells[lastMove]===0){ // checks if the current cell isn't occupied
    cells[Number(this.id)]=1; // saves '1' in current cell, if player made move
  	$(evnt.target).text("X");
  	turn = false; 
  	moveCounter++;
  	freeCells.splice(freeCells.indexOf(Number(this.id)),1); // removes number of last move from array of available cells
    if(!checkWinner()){ // if player didn't win computer make a move
      computerMove();
  	  moveCounter++;
  	  turn = true;
  	  checkWinner();
  	}
  }
}

function computerMove(){ // logic for computer moves
  var nextMove, // index of possible next move in cells array
      cellId, // string contains the id of cell for jQuery
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
    case (cells[2]+cells[4]+cells[6]===2):{ //if the second diagonal has two "0"
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
  cells[freeCells[nextMove]] = -1; // saves '-1' in current cell, if computer made move
  lastMove = freeCells[nextMove];
  cellId = "#" + freeCells[nextMove];
  $(cellId).text("0");
  freeCells.splice(nextMove,1);
}

function checkWinner(){ //checks there is a winner or not
  var row = Math.floor(lastMove/3), //number of row where last move was made
      column = lastMove%3; //number of column where last move was made
  if ((Math.abs(cells[row*3]+cells[row*3+1]+cells[row*3+2])==3)||   // if sum of all elements in current    
  	  (Math.abs(cells[column]+cells[column+3]+cells[column+6])==3)||// row or column or one of diagonals
  	  (Math.abs(cells[0]+cells[4]+cells[8])==3)||                   // is 3 or -3, we have a winner
      (Math.abs(cells[2]+cells[4]+cells[6])==3)){
  	  showWinner();
  	  return true;
  }
  if (moveCounter == 9){ //if we haven't winner even there is not available cell 
  	showDraw();          //we have a draw    
  }
  return false;
}

function showWinner(){ //shows which player won
  if(turn) {
  	points2 += 2;
  	$("#score2").text(points2);
  	alert("Player 0 won!");
  } else {
    points1 += 2;
    $("#score1").text(points1);
    alert("Player X won!");
  }
  clearField();
}

function showDraw(){ //shows if nobody won, each players get 1 point
  alert("Nobody won! Dead heat!");
  points1++;
  points2++;
  $("#score1").text(points1);
  $("#score2").text(points2);
  clearField();
}