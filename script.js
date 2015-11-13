var cells,
    lastMove,
    points1, points2,
    newGameButton = $("#menu__newgame"),
    modeButton = $("#menu__mode"),
    turn;
//alert(cells);
$(document).ready(newGame);
$(".cell").bind("click", moves);

$("#menu__newgame").bind("click", newGame);

function clearField(){
  $(".cell").empty();
  turn = true;
  cells = new Array(9);	
}

function newGame(){
  clearField();
  $("#score1").text("0");
  $("#score2").text("0");
  points1 = 0;
  points2 = 0;
}

function moves(evnt){
  lastMove = Number(this.id);
  var txt;
  if (cells[lastMove]===undefined){
    if(turn){
  	  cells[Number(this.id)]=1;
  	  $(evnt.target).text("X");
  	  turn = false;
    } else {
  	  cells[Number(this.id)]=-1;
  	  $(evnt.target).text("0");
  	  turn = true;
    }
    if (count()){
  	  if(turn) {
  	    points2++;
  	    $("#score2").text(points2);
  	    alert("Player 0 won!");
      } else {
        points1++;
        $("#score1").text(points1);
  	    alert("Player X won!");
      }
      clearField();
    }
  }
}

function count(){
  /*if((Math.abs(cells[0]+cells[1]+cells[2])==3)&&
  	 (Math.abs(cells[3]+cells[4]+cells[5])==3)&&
  	 (Math.abs(cells[6]+cells[7]+cells[8])==3))*/
  var row = Math.floor(lastMove/3),
      column = lastMove%3;
  
  if ((Math.abs(cells[row*3]+cells[row*3+1]+cells[row*3+2])==3)||
  	  (Math.abs(cells[column]+cells[column+3]+cells[column+6])==3)||
  	  (Math.abs(cells[0]+cells[4]+cells[8])==3)||
      (Math.abs(cells[2]+cells[4]+cells[6])==3)){
      return true;
  }
  return false;
}
