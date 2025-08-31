// Chess Engine with AI

class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.gameOver = false;
        this.moveHistory = [];
        this.lastMove = null;
        this.kingPositions = { white: [7, 4], black: [0, 4] };
        this.initializeGame();
    }

    initializeBoard() {
        return [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
    }

    initializeGame() {
        this.renderBoard();
        this.updateStatus('Your turn - Move White');
    }

    renderBoard() {
        const boardElement = document.getElementById('chess-board');
        boardElement.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;

                const piece = this.board[row][col];
                if (piece) {
                    const img = document.createElement('img');
                    img.src = this.getPieceImage(piece);
                    img.alt = piece;
                    img.className = 'chess-piece';
                    img.draggable = false;
                    square.appendChild(img);
                }

                square.addEventListener('click', () => this.handleSquareClick(row, col));
                boardElement.appendChild(square);
            }
        }

        this.highlightLastMove();
    }

    getPieceImage(piece) {
        const isWhite = piece === piece.toUpperCase();
        const color = isWhite ? 'white' : 'black';
        const pieceType = piece.toLowerCase();
        
        const pieceNames = {
            'k': 'king', 'q': 'queen', 'r': 'rook', 
            'b': 'bishop', 'n': 'knight', 'p': 'pawn'
        };
        
        return `images/pieces/${color}-${pieceNames[pieceType]}.svg`;
    }

    handleSquareClick(row, col) {
        if (this.gameOver || this.currentPlayer !== 'white') return;

        const piece = this.board[row][col];
        
        if (this.selectedSquare) {
            const [selectedRow, selectedCol] = this.selectedSquare;
            
            if (row === selectedRow && col === selectedCol) {
                this.clearSelection();
                return;
            }

            if (this.isValidMove(selectedRow, selectedCol, row, col)) {
                this.makeMove(selectedRow, selectedCol, row, col);
                this.clearSelection();
                
                if (!this.gameOver) {
                    setTimeout(() => this.makeAIMove(), 500);
                }
            } else {
                this.clearSelection();
                if (piece && this.isPlayerPiece(piece, 'white')) {
                    this.selectSquare(row, col);
                }
            }
        } else {
            if (piece && this.isPlayerPiece(piece, 'white')) {
                this.selectSquare(row, col);
            }
        }
    }

    selectSquare(row, col) {
        this.selectedSquare = [row, col];
        this.highlightSquare(row, col, 'selected');
        this.highlightValidMoves(row, col);
    }

    clearSelection() {
        this.selectedSquare = null;
        this.clearHighlights();
    }

    highlightSquare(row, col, className) {
        const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (square) square.classList.add(className);
    }

    clearHighlights() {
        document.querySelectorAll('.square').forEach(square => {
            square.classList.remove('selected', 'valid-move', 'check');
        });
    }

    highlightValidMoves(row, col) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.isValidMove(row, col, r, c)) {
                    this.highlightSquare(r, c, 'valid-move');
                }
            }
        }
    }

    highlightLastMove() {
        if (this.lastMove) {
            const [fromRow, fromCol, toRow, toCol] = this.lastMove;
            this.highlightSquare(fromRow, fromCol, 'last-move');
            this.highlightSquare(toRow, toCol, 'last-move');
        }
    }

    isPlayerPiece(piece, player) {
        if (player === 'white') return piece === piece.toUpperCase();
        return piece === piece.toLowerCase();
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
        
        const piece = this.board[fromRow][fromCol];
        const targetPiece = this.board[toRow][toCol];
        
        if (!piece) return false;
        if (targetPiece && this.isPlayerPiece(piece, this.currentPlayer) && 
            this.isPlayerPiece(targetPiece, this.currentPlayer)) return false;

        // Basic piece movement validation
        const pieceType = piece.toLowerCase();
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;
        const absRowDiff = Math.abs(rowDiff);
        const absColDiff = Math.abs(colDiff);

        switch (pieceType) {
            case 'p': // Pawn
                return this.isValidPawnMove(fromRow, fromCol, toRow, toCol, piece);
            case 'r': // Rook
                return (rowDiff === 0 || colDiff === 0) && this.isPathClear(fromRow, fromCol, toRow, toCol);
            case 'n': // Knight
                return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);
            case 'b': // Bishop
                return absRowDiff === absColDiff && this.isPathClear(fromRow, fromCol, toRow, toCol);
            case 'q': // Queen
                return ((rowDiff === 0 || colDiff === 0) || (absRowDiff === absColDiff)) && 
                       this.isPathClear(fromRow, fromCol, toRow, toCol);
            case 'k': // King
                return absRowDiff <= 1 && absColDiff <= 1;
            default:
                return false;
        }
    }

    isValidPawnMove(fromRow, fromCol, toRow, toCol, piece) {
        const isWhite = piece === piece.toUpperCase();
        const direction = isWhite ? -1 : 1;
        const startRow = isWhite ? 6 : 1;
        const rowDiff = toRow - fromRow;
        const colDiff = Math.abs(toCol - fromCol);

        // Forward move
        if (colDiff === 0) {
            if (rowDiff === direction && !this.board[toRow][toCol]) return true;
            if (fromRow === startRow && rowDiff === 2 * direction && !this.board[toRow][toCol]) return true;
        }
        // Diagonal capture
        else if (colDiff === 1 && rowDiff === direction && this.board[toRow][toCol]) {
            return !this.isPlayerPiece(this.board[toRow][toCol], this.currentPlayer);
        }

        return false;
    }

    isPathClear(fromRow, fromCol, toRow, toCol) {
        const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
        const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
        
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        
        while (currentRow !== toRow || currentCol !== toCol) {
            if (this.board[currentRow][currentCol]) return false;
            currentRow += rowStep;
            currentCol += colStep;
        }
        
        return true;
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];
        
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // Update king position
        if (piece.toLowerCase() === 'k') {
            this.kingPositions[this.currentPlayer] = [toRow, toCol];
        }
        
        this.lastMove = [fromRow, fromCol, toRow, toCol];
        this.addMoveToHistory(fromRow, fromCol, toRow, toCol, piece, capturedPiece);
        
        if (this.isCheckmate(this.currentPlayer === 'white' ? 'black' : 'white')) {
            this.gameOver = true;
            this.updateStatus(`Checkmate! ${this.currentPlayer === 'white' ? 'White' : 'Black'} wins!`);
        } else if (this.isInCheck(this.currentPlayer === 'white' ? 'black' : 'white')) {
            this.updateStatus(`Check! ${this.currentPlayer === 'white' ? 'Black' : 'White'} to move`);
        }
        
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.renderBoard();
    }

    isInCheck(player) {
        const kingPos = this.kingPositions[player];
        const [kingRow, kingCol] = kingPos;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && !this.isPlayerPiece(piece, player)) {
                    if (this.isValidMove(row, col, kingRow, kingCol)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isCheckmate(player) {
        if (!this.isInCheck(player)) return false;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && this.isPlayerPiece(piece, player)) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (this.isValidMove(row, col, toRow, toCol)) {
                                // Simulate move
                                const originalPiece = this.board[toRow][toCol];
                                const originalKingPos = [...this.kingPositions[player]];
                                
                                this.board[toRow][toCol] = piece;
                                this.board[row][col] = null;
                                
                                if (piece.toLowerCase() === 'k') {
                                    this.kingPositions[player] = [toRow, toCol];
                                }
                                
                                const stillInCheck = this.isInCheck(player);
                                
                                // Undo move
                                this.board[row][col] = piece;
                                this.board[toRow][toCol] = originalPiece;
                                this.kingPositions[player] = originalKingPos;
                                
                                if (!stillInCheck) return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
    }

    // AI Implementation
    makeAIMove() {
        if (this.gameOver) return;
        
        this.updateStatus('AI is thinking...');
        
        setTimeout(() => {
            const bestMove = this.getBestMove();
            if (bestMove) {
                const [fromRow, fromCol, toRow, toCol] = bestMove;
                this.makeMove(fromRow, fromCol, toRow, toCol);
                
                if (!this.gameOver) {
                    this.updateStatus('Your turn - Move White');
                }
            }
        }, 1000);
    }

    getBestMove() {
        const moves = this.getAllValidMoves('black');
        if (moves.length === 0) return null;
        
        let bestMove = null;
        let bestScore = -Infinity;
        
        for (const move of moves) {
            const [fromRow, fromCol, toRow, toCol] = move;
            const score = this.evaluateMove(fromRow, fromCol, toRow, toCol);
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        return bestMove;
    }

    getAllValidMoves(player) {
        const moves = [];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && this.isPlayerPiece(piece, player)) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (this.isValidMove(row, col, toRow, toCol)) {
                                moves.push([row, col, toRow, toCol]);
                            }
                        }
                    }
                }
            }
        }
        
        return moves;
    }

    evaluateMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const targetPiece = this.board[toRow][toCol];
        
        let score = 0;
        
        // Piece values
        const pieceValues = {
            'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0
        };
        
        // Capture bonus
        if (targetPiece) {
            score += pieceValues[targetPiece.toLowerCase()] * 10;
        }
        
        // Center control bonus
        const centerDistance = Math.abs(toRow - 3.5) + Math.abs(toCol - 3.5);
        score += (7 - centerDistance) * 0.5;
        
        // Piece development bonus
        if (piece.toLowerCase() === 'n' || piece.toLowerCase() === 'b') {
            if (fromRow === 0) score += 2; // Moving from back rank
        }
        
        // King safety penalty
        if (piece.toLowerCase() === 'k') {
            score -= 5; // Discourage king moves
        }
        
        // Random factor for variety
        score += Math.random() * 2;
        
        return score;
    }

    addMoveToHistory(fromRow, fromCol, toRow, toCol, piece, capturedPiece) {
        const moveNumber = Math.floor(this.moveHistory.length / 2) + 1;
        const notation = this.getMoveNotation(fromRow, fromCol, toRow, toCol, piece, capturedPiece);
        
        this.moveHistory.push({
            moveNumber,
            player: this.currentPlayer,
            notation,
            from: [fromRow, fromCol],
            to: [toRow, toCol]
        });
        
        this.updateMoveHistory();
    }

    getMoveNotation(fromRow, fromCol, toRow, toCol, piece, capturedPiece) {
        const files = 'abcdefgh';
        const ranks = '87654321';
        
        const fromSquare = files[fromCol] + ranks[fromRow];
        const toSquare = files[toCol] + ranks[toRow];
        const pieceSymbol = piece.toUpperCase() === 'P' ? '' : piece.toUpperCase();
        const capture = capturedPiece ? 'x' : '';
        
        return `${pieceSymbol}${capture}${toSquare}`;
    }

    updateMoveHistory() {
        const movesList = document.getElementById('moves-list');
        movesList.innerHTML = '';
        
        for (let i = 0; i < this.moveHistory.length; i += 2) {
            const moveItem = document.createElement('div');
            moveItem.className = 'move-item';
            
            const moveNumber = Math.floor(i / 2) + 1;
            const whiteMove = this.moveHistory[i];
            const blackMove = this.moveHistory[i + 1];
            
            moveItem.innerHTML = `
                <span class="move-number">${moveNumber}.</span>
                <span class="move-notation">${whiteMove.notation}</span>
                <span class="move-notation">${blackMove ? blackMove.notation : ''}</span>
            `;
            
            movesList.appendChild(moveItem);
        }
        
        movesList.scrollTop = movesList.scrollHeight;
    }

    updateStatus(message) {
        document.getElementById('game-status').textContent = message;
    }
}

// Game functions
let game;

function startNewGame() {
    game = new ChessGame();
}

function getHint() {
    if (game.currentPlayer !== 'white' || game.gameOver) return;
    
    const moves = game.getAllValidMoves('white');
    if (moves.length > 0) {
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        const [fromRow, fromCol, toRow, toCol] = randomMove;
        
        game.clearHighlights();
        game.highlightSquare(fromRow, fromCol, 'selected');
        game.highlightSquare(toRow, toCol, 'valid-move');
        
        setTimeout(() => {
            game.clearHighlights();
        }, 3000);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    startNewGame();
});