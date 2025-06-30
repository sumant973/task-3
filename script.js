const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const modeRadios = document.querySelectorAll('input[name="mode"]');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let vsAI = false;

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8], 
  [0,3,6], [1,4,7], [2,5,8], 
  [0,4,8], [2,4,6]
];

modeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    vsAI = document.querySelector('input[name="mode"]:checked').value === 'ai';
    restartGame();
  });
});

function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');
  if (!gameActive || board[index] !== '') return;

  makeMove(index, currentPlayer);

  if (checkWinner(currentPlayer)) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (isDraw()) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (vsAI && currentPlayer === 'O') {
    setTimeout(aiMove, 500); // delay to simulate thinking
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
}

function aiMove() {
  if (!gameActive) return;

  const emptyIndices = board.map((val, i) => val === '' ? i : null).filter(i => i !== null);
  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(randomIndex, 'O');

  if (checkWinner('O')) {
    statusText.textContent = `Player O wins!`;
    gameActive = false;
    return;
  }

  if (isDraw()) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = 'X';
  statusText.textContent = `Player X's turn`;
}

function checkWinner(player) {
  return winConditions.some(condition => {
    return condition.every(index => board[index] === player);
  });
}

function isDraw() {
  return board.every(cell => cell !== '');
}

function restartGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  cells.forEach(cell => cell.textContent = '');
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
