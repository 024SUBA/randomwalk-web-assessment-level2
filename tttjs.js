const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');

let currentPlayer = 'X'; // Player X starts first
let gameActive = true; // Flag to check if the game is active
let scores = { X: 0, O: 0 }; // Score tracker
let gameState = ["", "", "", "", "", "", "", "", ""]; // Game state tracking

// Winning combinations
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Handle cell click
function handleCellClick(clickedCell, clickedCellIndex) {
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return; // Ignore if the cell is already filled or the game is over
    }
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer; // Update UI with player's move
    checkResult();

    // If the game is still active and in single-player mode, wait for 1 second before the computer plays
    if (gameActive && isSinglePlayerMode()) {
        setTimeout(computerPlay, 1000); // Delay computer's move by 1 second
    }
}

// Computer plays a random available cell
function computerPlay() {
    const availableCells = gameState.map((val, index) => (val === "" ? index : null)).filter(val => val !== null);
    
    if (availableCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const cellIndex = availableCells[randomIndex];
        gameState[cellIndex] = 'O'; // Computer's move
        cells[cellIndex].textContent = 'O'; // Update UI with computer's move
        checkResult(); // Check if this move results in a win or draw
    }
}

// Check game results
function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === "" || gameState[b] === "" || gameState[c] === "") {
            continue; // Check if cells are filled
        }
        if (gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true; // A winning combination found
            break;
        }
    }
    if (roundWon) {
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
        scores[currentPlayer]++;
        updateScore();
        gameActive = false; // End game if someone wins
        return;
    }
    if (!gameState.includes("")) {
        statusDisplay.textContent = "It's a draw!"; // Check for draw
        gameActive = false; // End game if draw
        return;
    }
    // Switch players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
}

// Update score display
function updateScore() {
    scoreXDisplay.textContent = scores.X;
    scoreODisplay.textContent = scores.O;
}

// Reset game state
function resetGame() {
    gameActive = true;
    currentPlayer = 'X'; // Reset to Player X
    gameState = ["", "", "", "", "", "", "", "", ""]; // Reset game state
    statusDisplay.textContent = `It's ${currentPlayer}'s turn`; // Update status
    cells.forEach(cell => cell.textContent = ""); // Clear cells
}

// Check if it's single player mode
function isSinglePlayerMode() {
    return document.querySelector('input[name="mode"]:checked').value === "single-player";
}

// Add event listeners to cells
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (gameActive) {
            handleCellClick(cell, index);
        }
    });
});

// Reset button functionality
resetButton.addEventListener('click', resetGame);
statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
