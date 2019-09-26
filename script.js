let gameBoard;
const player = 'X';
const Computer = 'O';
const combinationsToWin = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const tableCells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	gameBoard = Array.from(Array(9).keys());
	for (let i = 0; i < tableCells.length; i++) {
		tableCells[i].innerText = '';
		tableCells[i].style.removeProperty('background-color');
		tableCells[i].addEventListener('click', onClickOfSquares, false);
	}
}

function onClickOfSquares(square) {
	if (typeof gameBoard[square.target.id] == 'number') {
    playTurn(square.target.id, player)
		if (!checkTie()) setTimeout(function(){ playTurn(bestSpot(), Computer); }, 700);
	}
}

function playTurn(squareId, player) {
	gameBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkIfWin(gameBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkIfWin(board, player) {
	let plays = board.reduce((a, e, i) => 
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of combinationsToWin.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of combinationsToWin[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == player ? "#39a3a3" : "#e02828";
	}
	for (let i = 0; i < tableCells.length; i++) {
		tableCells[i].removeEventListener('click', onClickOfSquares, false);
  }
	declareAWinner(gameWon.player == player ? "You win!" : "You lose.", gameWon.player == player ? "#39a3a3" : "#e02828");
}

function declareAWinner(who, textColor) {
  document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame").style.color = textColor;  
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return gameBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return emptySquares()[0];
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (let i = 0; i < tableCells.length; i++) {
			tableCells[i].style.backgroundColor = "#e0d728";
			tableCells[i].removeEventListener('click', onClickOfSquares, false);
		}
		declareAWinner("Game is a Tie!","#e0d728")
		return true;
	}
	return false;
}
