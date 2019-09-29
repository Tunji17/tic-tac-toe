let gameBoard;
const humanPlayer = 'X';
const computer = 'O';
const tableCells = document.querySelectorAll('.cell');
const minimaxAlgorithm = (board, player) => {
	const availableSquares = emptySquares(board);

	if(checkIfWin(board, player)) {
			return {score: -100}; 
	} else if (checkIfWin(board, computer)) {
			return {score: 100}
	} else if (availableSquares.length === 0) {
			return {score: 0}
	}
	const moves = [];
	for (let i = 0; i < availableSquares.length; i++) {
		const move = {};
		move.index = board[availableSquares[i]];
		board[availableSquares[i]] = player;

		if (player === computer) {
				const result = minimaxAlgorithm(board, humanPlayer);
				move.score = result.score;
		} else {
				const result = minimaxAlgorithm(board, computer);
				move.score = result.score;
		}

		board[availableSquares[i]] = move.index;
		
		moves.push(move);
		}

		let bestMove;
		if(player === computer) {
				let bestScore = -10000;
				for (let i = 0; i < moves.length; i++) {
						if (moves[i].score > bestScore) {
								bestScore = moves[i].score;
								bestMove = i;
						}
				}
		} else {
				let bestScore = 10000;
				for(let i = 0; i < moves.length; i++) {
						if (moves[i].score < bestScore) {
								bestScore = moves[i].score;
								bestMove = i;
						}
				}
		}
		return moves[bestMove];
}

const checkTie = () => {
	if (emptySquares().length === 0) {
			for (let i = 0; i < tableCells.length; i++) { 
					tableCells[i].style.backgroundColor = "#e0d728";
					tableCells[i].removeEventListener('click', onClickOfSquares, false);
			}
			declareAWinner("Game is a Tie!", "#e0d728")
			return true;
	}
	return false;
}
const bestSpot = () => {
	return minimaxAlgorithm(gameBoard, computer).index;
}

const emptySquares = () => {
	return gameBoard.filter(s => typeof s === 'number');
}

const declareAWinner = (who, textColor) => {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame").style.color = textColor;  
	document.querySelector(".endgame .text").innerText = who;
}

const combinationsToWin = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]; 

const gameOver = (gameWon) => {
  for (let index of combinationsToWin[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = 
		gameWon.player == humanPlayer ? "#39a3a3" : "#e02828";
}
  for (let i= 0; i < tableCells.length; i++ ) {
    tableCells[i].removeEventListener('click', onClickOfSquares, false);
}
	declareAWinner(gameWon.player == humanPlayer ? "You win!" : "You lose.", gameWon.player == humanPlayer ? "#39a3a3" : "#e02828");
} 

const checkIfWin = (board, player) => {
  const plays = board.reduce((a, e, i) => 
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

const playTurn = (squareId, player) => {
  gameBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
 const gameWon = checkIfWin(gameBoard, player)
 if (gameWon) gameOver(gameWon)
} 

const onClickOfSquares = (square) => {
  if (typeof gameBoard[square.target.id] === 'number') {
    playTurn(square.target.id, humanPlayer)
    if (!checkTie()) setTimeout(function(){ playTurn(bestSpot(), computer); }, 700);
    }   
} 

const startGame = () => {  
	document.querySelector(".endgame").style.display = "none"
 	gameBoard = Array.from(Array(9).keys())
 	for (let i=0; i< tableCells.length; i++) {
		tableCells[i].innerText = '';
		tableCells[i].style.removeProperty('background-color');
		tableCells[i].addEventListener('click', onClickOfSquares, false);
    }
} 

startGame();
document.querySelector('.restart').addEventListener('click', startGame)
