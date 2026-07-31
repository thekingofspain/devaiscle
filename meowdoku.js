class Meowdoku {
    constructor(size = 6) {
        this.size = size;
        this.board = [];
        this.regions = [];
        this.solution = [];
        this.playerBoard = [];
        this.moveHistory = [];
        this.gameOver = false;
        
        this.init();
    }

    init() {
        this.generateRegions();
        this.generateSolution();
        this.playerBoard = Array(this.size).fill(null).map(() => Array(this.size).fill(false));
        this.moveHistory = [];
        this.gameOver = false;
    }

    generateRegions() {
        // Generate connected regions using a flood-fill approach
        this.regions = Array(this.size).fill(null).map(() => Array(this.size).fill(-1));
        let regionId = 0;
        const totalCells = this.size * this.size;
        const targetRegions = this.size; // We want exactly N regions for an N×N grid
        
        // Use BFS to create connected regions
        const visited = Array(this.size).fill(null).map(() => Array(this.size).fill(false));
        const cellsPerRegion = Math.floor(totalCells / targetRegions);
        let extraCells = totalCells % targetRegions;
        
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        
        for (let r = 0; r < this.size && regionId < targetRegions; r++) {
            for (let c = 0; c < this.size && regionId < targetRegions; c++) {
                if (!visited[r][c]) {
                    const regionSize = cellsPerRegion + (extraCells > 0 ? 1 : 0);
                    if (extraCells > 0) extraCells--;
                    
                    // BFS to grow region
                    const queue = [[r, c]];
                    visited[r][c] = true;
                    this.regions[r][c] = regionId;
                    let count = 1;
                    
                    let head = 0;
                    while (head < queue.length && count < regionSize) {
                        const [currR, currC] = queue[head++];
                        
                        // Shuffle directions for more organic shapes
                        const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);
                        
                        for (const [dr, dc] of shuffledDirs) {
                            const nr = currR + dr;
                            const nc = currC + dc;
                            
                            if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size &&
                                !visited[nr][nc] && count < regionSize) {
                                visited[nr][nc] = true;
                                this.regions[nr][nc] = regionId;
                                queue.push([nr, nc]);
                                count++;
                            }
                        }
                    }
                    
                    regionId++;
                }
            }
        }
        
        // Assign any remaining unvisited cells to nearest region
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.regions[r][c] === -1) {
                    // Find adjacent region
                    for (const [dr, dc] of directions) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size &&
                            this.regions[nr][nc] !== -1) {
                            this.regions[r][c] = this.regions[nr][nc];
                            break;
                        }
                    }
                }
            }
        }
    }

    generateSolution() {
        // Generate a valid solution using backtracking
        this.solution = Array(this.size).fill(null).map(() => Array(this.size).fill(false));
        
        const isValidPlacement = (row, col, placedCats) => {
            // Check row and column
            for (let i = 0; i < this.size; i++) {
                if (placedCats.some(([r, c]) => r === row || c === col)) {
                    return false;
                }
            }
            
            // Check no touching (including diagonals)
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = row + dr;
                    const nc = col + dc;
                    if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) {
                        if (placedCats.some(([r, c]) => r === nr && c === nc)) {
                            return false;
                        }
                    }
                }
            }
            
            // Check one cat per region
            const regionId = this.regions[row][col];
            if (placedCats.some(([r, c]) => this.regions[r][c] === regionId)) {
                return false;
            }
            
            return true;
        };
        
        const solve = (regionIndex, placedCats) => {
            if (regionIndex === this.size) {
                // Found a valid solution
                for (const [r, c] of placedCats) {
                    this.solution[r][c] = true;
                }
                return true;
            }
            
            // Get all cells in this region
            const regionCells = [];
            for (let r = 0; r < this.size; r++) {
                for (let c = 0; c < this.size; c++) {
                    if (this.regions[r][c] === regionIndex) {
                        regionCells.push([r, c]);
                    }
                }
            }
            
            // Shuffle for randomness
            regionCells.sort(() => Math.random() - 0.5);
            
            for (const [r, c] of regionCells) {
                if (isValidPlacement(r, c, placedCats)) {
                    placedCats.push([r, c]);
                    if (solve(regionIndex + 1, placedCats)) {
                        return true;
                    }
                    placedCats.pop();
                }
            }
            
            return false;
        };
        
        // Try multiple times with different random seeds
        let attempts = 0;
        const maxAttempts = 100;
        while (attempts < maxAttempts) {
            this.solution = Array(this.size).fill(null).map(() => Array(this.size).fill(false));
            if (solve(0, [])) {
                break;
            }
            attempts++;
        }
        
        if (attempts === maxAttempts) {
            // Regenerate regions and try again
            this.generateRegions();
            this.generateSolution();
        }
    }

    placeCat(row, col) {
        if (this.gameOver) return false;
        if (this.playerBoard[row][col]) return false;
        
        this.playerBoard[row][col] = true;
        this.moveHistory.push({ type: 'place', row, col, timestamp: Date.now() });
        
        return true;
    }

    removeCat(row, col) {
        if (this.gameOver) return false;
        if (!this.playerBoard[row][col]) return false;
        
        this.playerBoard[row][col] = false;
        this.moveHistory.push({ type: 'remove', row, col, timestamp: Date.now() });
        
        return true;
    }

    undo() {
        if (this.moveHistory.length === 0 || this.gameOver) return null;
        
        const lastMove = this.moveHistory.pop();
        if (lastMove.type === 'place') {
            this.playerBoard[lastMove.row][lastMove.col] = false;
        } else {
            this.playerBoard[lastMove.row][lastMove.col] = true;
        }
        
        return lastMove;
    }

    checkWin() {
        let catCount = 0;
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.playerBoard[r][c]) catCount++;
            }
        }
        
        if (catCount !== this.size) return false;
        
        // Check if player's board matches solution
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.playerBoard[r][c] !== this.solution[r][c]) {
                    return false;
                }
            }
        }
        
        this.gameOver = true;
        return true;
    }

    getHint() {
        // Find a cell that should have a cat but doesn't yet
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.solution[r][c] && !this.playerBoard[r][c]) {
                    return { row: r, col: c };
                }
            }
        }
        return null;
    }

    validateCurrentBoard() {
        const cats = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.playerBoard[r][c]) {
                    cats.push([r, c]);
                }
            }
        }
        
        const errors = [];
        
        // Check row/column conflicts
        const rows = new Set();
        const cols = new Set();
        for (const [r, c] of cats) {
            if (rows.has(r)) {
                errors.push(`Row ${r} has multiple cats`);
            }
            if (cols.has(c)) {
                errors.push(`Column ${c} has multiple cats`);
            }
            rows.add(r);
            cols.add(c);
        }
        
        // Check touching cats
        for (let i = 0; i < cats.length; i++) {
            for (let j = i + 1; j < cats.length; j++) {
                const [r1, c1] = cats[i];
                const [r2, c2] = cats[j];
                if (Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1) {
                    errors.push(`Cats at (${r1},${c1}) and (${r2},${c2}) are touching`);
                }
            }
        }
        
        // Check region conflicts
        const regionCats = new Map();
        for (const [r, c] of cats) {
            const regionId = this.regions[r][c];
            if (regionCats.has(regionId)) {
                errors.push(`Region ${regionId} has multiple cats`);
            }
            regionCats.set(regionId, [r, c]);
        }
        
        return errors;
    }

    getCatCount() {
        let count = 0;
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.playerBoard[r][c]) count++;
            }
        }
        return count;
    }

    getRegionColors() {
        const colors = [];
        for (let i = 0; i < this.size; i++) {
            // Generate pleasant pastel colors
            const hue = (i * 360 / this.size) % 360;
            colors.push(`hsl(${hue}, 70%, 85%)`);
        }
        return colors;
    }
}

// Game UI Controller
class GameUI {
    constructor() {
        this.game = null;
        this.boardElement = document.getElementById('board');
        this.historyList = document.getElementById('historyList');
        this.catsFoundEl = document.getElementById('catsFound');
        this.totalCatsEl = document.getElementById('totalCats');
        this.moveCountEl = document.getElementById('moveCount');
        this.gameStatusEl = document.getElementById('gameStatus');
        this.messageEl = document.getElementById('message');
        
        this.setupEventListeners();
        this.newGame();
    }

    setupEventListeners() {
        document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('checkBtn').addEventListener('click', () => this.checkBoard());
        document.getElementById('sizeSelect').addEventListener('change', (e) => {
            this.newGame(parseInt(e.target.value));
        });
    }

    newGame(size = null) {
        if (size === null) {
            size = parseInt(document.getElementById('sizeSelect').value);
        }
        
        this.game = new Meowdoku(size);
        this.renderBoard();
        this.updateInfo();
        this.showMessage('New game started! Good luck! 🐱');
    }

    renderBoard() {
        const size = this.game.size;
        const colors = this.game.getRegionColors();
        
        this.boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        this.boardElement.innerHTML = '';
        
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                
                const regionId = this.game.regions[r][c];
                cell.style.backgroundColor = colors[regionId];
                
                if (this.game.playerBoard[r][c]) {
                    cell.classList.add('cat');
                    cell.textContent = '🐱';
                }
                
                cell.addEventListener('click', () => this.handleCellClick(r, c));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleRightClick(r, c);
                });
                
                this.boardElement.appendChild(cell);
            }
        }
        
        this.updateButtons();
    }

    handleCellClick(row, col) {
        if (this.game.gameOver) return;
        
        if (this.game.playerBoard[row][col]) {
            this.game.removeCat(row, col);
        } else {
            this.game.placeCat(row, col);
        }
        
        this.renderBoard();
        this.updateInfo();
        this.addToHistory(row, col, this.game.moveHistory[this.game.moveHistory.length - 1]);
        
        if (this.game.checkWin()) {
            this.showMessage('🎉 Congratulations! You solved the puzzle! 🎉');
            this.gameStatusEl.textContent = 'Won!';
            this.updateButtons();
        }
    }

    handleRightClick(row, col) {
        // For now, right-click works same as left-click
        // Could be extended for flagging/marking cells
        this.handleCellClick(row, col);
    }

    undo() {
        if (!this.game) return;
        
        const move = this.game.undo();
        if (move) {
            this.renderBoard();
            this.updateInfo();
            this.removeFromHistory();
            this.showMessage('Move undone');
        }
    }

    showHint() {
        if (!this.game || this.game.gameOver) return;
        
        const hint = this.game.getHint();
        if (hint) {
            const cell = this.boardElement.querySelector(
                `[data-row="${hint.row}"][data-col="${hint.col}"]`
            );
            if (cell) {
                cell.classList.add('hint');
                setTimeout(() => cell.classList.remove('hint'), 1000);
            }
            this.showMessage('Hint shown! Look for the highlighted cell.');
        }
    }

    checkBoard() {
        if (!this.game || this.game.gameOver) return;
        
        const errors = this.game.validateCurrentBoard();
        if (errors.length === 0) {
            if (this.game.getCatCount() === this.game.size) {
                this.showMessage('Looking good! Keep going! ✓');
            } else {
                this.showMessage(`You have ${this.game.getCatCount()} cats. Need ${this.game.size}!`);
            }
        } else {
            this.showMessage('Errors found: ' + errors.slice(0, 2).join(', '), true);
        }
    }

    updateInfo() {
        const catCount = this.game.getCatCount();
        this.catsFoundEl.textContent = catCount;
        this.totalCatsEl.textContent = this.game.size;
        this.moveCountEl.textContent = this.game.moveHistory.length;
    }

    updateButtons() {
        document.getElementById('undoBtn').disabled = 
            this.game.moveHistory.length === 0 || this.game.gameOver;
        document.getElementById('hintBtn').disabled = this.game.gameOver;
        document.getElementById('checkBtn').disabled = this.game.gameOver;
    }

    addToHistory(row, col, move) {
        const li = document.createElement('li');
        const action = move.type === 'place' ? 'Placed' : 'Removed';
        li.textContent = `${action} cat at (${row + 1}, ${col + 1})`;
        this.historyList.appendChild(li);
        this.historyList.scrollTop = this.historyList.scrollHeight;
    }

    removeFromHistory() {
        if (this.historyList.lastChild) {
            this.historyList.removeChild(this.historyList.lastChild);
        }
    }

    showMessage(text, isError = false) {
        this.messageEl.textContent = text;
        this.messageEl.className = 'message show' + (isError ? ' error' : '');
        
        setTimeout(() => {
            this.messageEl.classList.remove('show');
        }, 3000);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new GameUI();
});
