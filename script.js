// Exact Chess.com Clone JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeChessBoard();
    initializeGameModes();
    initializeFeatures();
    initializeNavigation();
});

// Chess pieces in Unicode
const pieces = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
};

// Starting chess position
const startingPosition = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let selectedSquare = null;
let gameBoard = JSON.parse(JSON.stringify(startingPosition));

// Initialize the main chess board
function initializeChessBoard() {
    const board = document.getElementById('main-board');
    if (!board) return;

    board.innerHTML = '';
    
    // Trigger board animation
    board.style.opacity = '0';
    setTimeout(() => {
        board.style.opacity = '1';
    }, 100);

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
            square.dataset.row = row;
            square.dataset.col = col;
            
            const piece = gameBoard[row][col];
            if (piece) {
                square.textContent = pieces[piece];
                square.dataset.piece = piece;
            }
            
            square.addEventListener('click', () => handleSquareClick(square, row, col));
            
            // Add staggered animation delay
            const squareIndex = row * 8 + col;
            square.style.animationDelay = `${squareIndex * 0.05}s`;
            
            board.appendChild(square);
        }
    }
}

// Handle chess square clicks
function handleSquareClick(square, row, col) {
    // Clear previous highlights
    document.querySelectorAll('.square').forEach(sq => {
        sq.classList.remove('selected', 'highlight');
    });

    if (selectedSquare) {
        // Move piece if valid
        const fromRow = parseInt(selectedSquare.dataset.row);
        const fromCol = parseInt(selectedSquare.dataset.col);
        
        if (isValidMove(fromRow, fromCol, row, col)) {
            // Move piece
            gameBoard[row][col] = gameBoard[fromRow][fromCol];
            gameBoard[fromRow][fromCol] = '';
            
            // Update display
            square.textContent = selectedSquare.textContent;
            square.dataset.piece = selectedSquare.dataset.piece;
            selectedSquare.textContent = '';
            delete selectedSquare.dataset.piece;
            
            // Show move animation
            animateMove(selectedSquare, square);
        }
        
        selectedSquare = null;
    } else if (square.dataset.piece) {
        // Select piece
        selectedSquare = square;
        square.classList.add('selected');
        highlightPossibleMoves(row, col);
    }
}

// Basic move validation
function isValidMove(fromRow, fromCol, toRow, toCol) {
    if (fromRow === toRow && fromCol === toCol) return false;
    
    const piece = gameBoard[fromRow][fromCol];
    if (!piece) return false;
    
    // Don't capture own pieces
    const targetPiece = gameBoard[toRow][toCol];
    if (targetPiece && isSameColor(piece, targetPiece)) return false;
    
    return true; // Simplified validation
}

// Check if pieces are same color
function isSameColor(piece1, piece2) {
    return (piece1 === piece1.toUpperCase()) === (piece2 === piece2.toUpperCase());
}

// Highlight possible moves
function highlightPossibleMoves(row, col) {
    // Simplified highlighting - show empty squares and opponent pieces
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isValidMove(row, col, r, c)) {
                const targetSquare = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                if (targetSquare) {
                    targetSquare.classList.add('highlight');
                }
            }
        }
    }
}

// Animate piece movement
function animateMove(fromSquare, toSquare) {
    fromSquare.style.transform = 'scale(1.1)';
    toSquare.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        fromSquare.style.transform = '';
        toSquare.style.transform = '';
    }, 200);
}

// Initialize game mode interactions
function initializeGameModes() {
    document.querySelectorAll('.game-mode').forEach(mode => {
        mode.addEventListener('click', function() {
            const timeControl = this.dataset.time;
            const modeName = this.querySelector('.mode-name').textContent;
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            showGameModeModal(modeName, timeControl);
        });
    });
}

// Initialize feature interactions
function initializeFeatures() {
    document.querySelectorAll('.feature').forEach(feature => {
        feature.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            showFeatureModal(title);
        });
    });

    // Button interactions
    document.querySelectorAll('.btn-play-online, .btn-play-computer').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            showPlayModal(action);
        });
    });

    document.querySelectorAll('.btn-upgrade, .btn-login, .btn-signup').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            showAuthModal(action);
        });
    });
}

// Initialize navigation
function initializeNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active from all nav items
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            
            // Add active to clicked item
            this.classList.add('active');
            
            const section = this.textContent.trim();
            showNavigationModal(section);
        });
    });
}

// Modal functions
function showGameModeModal(mode, time) {
    const content = getGameModeContent(mode, time);
    showModal(`${mode} Chess`, content);
}

function showFeatureModal(title) {
    const content = getFeatureContent(title);
    showModal(title, content);
}

function showPlayModal(action) {
    const content = `
        <div class="play-modal">
            <p>Ready to ${action.toLowerCase()}?</p>
            <div class="time-controls">
                <button class="time-btn" data-time="1+0">1 min</button>
                <button class="time-btn" data-time="3+0">3 min</button>
                <button class="time-btn" data-time="5+0">5 min</button>
                <button class="time-btn" data-time="10+0">10 min</button>
            </div>
            <p class="modal-note">This is a portfolio demo. In a real Chess.com implementation, this would start a game.</p>
        </div>
    `;
    showModal(action, content);
}

function showAuthModal(action) {
    const content = `
        <div class="auth-modal">
            <p>This would show the ${action.toLowerCase()} form in a real Chess.com implementation.</p>
            <p class="modal-note">This is Shreyas Suresh's portfolio disguised as Chess.com!</p>
            <div class="portfolio-links">
                <a href="mailto:shreyas30i@gmail.com" class="portfolio-link">📧 Contact Shreyas</a>
                <a href="https://github.com/shreyas" class="portfolio-link">💻 GitHub Profile</a>
                <a href="https://linkedin.com/in/shreyas" class="portfolio-link">💼 LinkedIn</a>
            </div>
        </div>
    `;
    showModal(action, content);
}

function showNavigationModal(section) {
    const content = getNavigationContent(section);
    showModal(section, content);
}

// Content generators
function getGameModeContent(mode, time) {
    const descriptions = {
        'Bullet': 'Lightning-fast games where every second counts. Perfect for quick tactical battles.',
        'Blitz': 'Fast-paced games that balance speed with strategy. Most popular time control.',
        'Rapid': 'Thoughtful games with enough time for deeper calculation and planning.',
        'Classical': 'Traditional long games allowing for deep strategic thinking and preparation.'
    };

    return `
        <div class="game-mode-content">
            <p>${descriptions[mode] || 'Fast and exciting chess games!'}</p>
            <div class="mode-stats">
                <div class="stat">
                    <strong>Time Control:</strong> ${time}
                </div>
                <div class="stat">
                    <strong>Average Game:</strong> ${getAverageTime(mode)}
                </div>
            </div>
            <p class="modal-note">This is a portfolio demo showcasing Chess.com's interface design.</p>
        </div>
    `;
}

function getFeatureContent(title) {
    const features = {
        'Nectar - iOS Development': {
            description: 'Professional iOS development using SwiftUI with Firebase backend integration.',
            technologies: ['SwiftUI', 'Firebase', 'Core Data', 'MVVM Architecture'],
            highlights: ['Real-time data sync', 'Secure authentication', 'Intuitive UI/UX', 'Offline support']
        },
        'AI & Machine Learning': {
            description: 'Advanced computer vision and machine learning solutions using Python.',
            technologies: ['Python', 'OpenCV', 'TensorFlow', 'MediaPipe'],
            highlights: ['Real-time processing', 'Hand gesture recognition', 'Sign language conversion', 'High accuracy']
        },
        'React Native Expertise': {
            description: 'Cross-platform mobile development with modern React Native practices.',
            technologies: ['React Native', 'Redux', 'Firebase', 'REST APIs'],
            highlights: ['Cross-platform compatibility', 'State management', 'API integration', 'Performance optimization']
        },
        'Full-Stack Solutions': {
            description: 'Complete development lifecycle from conception to deployment.',
            technologies: ['Multiple Frameworks', 'Database Design', 'Cloud Services', 'DevOps'],
            highlights: ['End-to-end development', 'Scalable architecture', 'Cloud deployment', 'Maintenance & support']
        }
    };

    const feature = features[title];
    if (!feature) return '<p>Feature information not available.</p>';

    return `
        <div class="feature-content">
            <p>${feature.description}</p>
            <div class="tech-list">
                <strong>Technologies:</strong>
                <div class="tech-tags">
                    ${feature.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            <div class="highlights">
                <strong>Key Highlights:</strong>
                <ul>
                    ${feature.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

function getNavigationContent(section) {
    const sections = {
        'Home': 'Welcome to Shreyas Suresh\'s portfolio, cleverly disguised as Chess.com!',
        'Play': 'This section would contain various game modes and matchmaking features.',
        'Puzzles': 'Chess puzzles and tactical training would be available here.',
        'Learn': 'Educational content and chess lessons would be provided in this section.',
        'Watch': 'Live games, tournaments, and chess streams would be featured here.',
        'News': 'Latest chess news, tournament results, and community updates.',
        'Social': 'Community features, forums, and social interactions with other players.',
        'More': 'Additional features like analysis tools, databases, and premium content.'
    };

    return `
        <div class="navigation-content">
            <p>${sections[section] || 'This section is under development.'}</p>
            <p class="modal-note">This is actually Shreyas Suresh's portfolio website designed to look exactly like Chess.com!</p>
        </div>
    `;
}

function getAverageTime(mode) {
    const times = {
        'Bullet': '2-3 minutes',
        'Blitz': '6-8 minutes',
        'Rapid': '15-25 minutes',
        'Classical': '45-90 minutes'
    };
    return times[mode] || '5-10 minutes';
}

// Generic modal function
function showModal(title, content) {
    // Remove existing modal
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                <button class="btn-modal-close">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.btn-modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    // Time control buttons
    modal.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.background = 'var(--chess-green)';
            this.style.color = 'white';
            setTimeout(() => {
                this.style.background = '';
                this.style.color = '';
            }, 200);
        });
    });

    // Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Add modal styles
const modalCSS = `
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.modal-content {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
    color: var(--text-primary);
    font-size: 18px;
    font-weight: 600;
    margin: 0;
}

.modal-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.15s ease;
}

.modal-close:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.1);
}

.modal-body {
    padding: 20px;
    color: var(--text-secondary);
    line-height: 1.5;
}

.modal-footer {
    padding: 20px;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
}

.btn-modal-close {
    background: var(--chess-green);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
}

.btn-modal-close:hover {
    background: var(--chess-green-hover);
}

.time-controls {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin: 16px 0;
}

.time-btn {
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    padding: 12px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
}

.time-btn:hover {
    background: var(--bg-tertiary);
    border-color: var(--chess-green);
}

.modal-note {
    font-size: 12px;
    color: var(--text-muted);
    font-style: italic;
    margin-top: 16px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

.tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 8px 0;
}

.tech-tag {
    background: var(--chess-green);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.highlights ul {
    margin: 8px 0 0 20px;
}

.highlights li {
    margin-bottom: 4px;
}

.portfolio-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
}

.portfolio-link {
    color: var(--chess-green);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.15s ease;
}

.portfolio-link:hover {
    color: var(--chess-green-hover);
}

.mode-stats {
    margin: 16px 0;
}

.mode-stats .stat {
    margin-bottom: 8px;
}
`;

// Inject modal CSS
const style = document.createElement('style');
style.textContent = modalCSS;
document.head.appendChild(style);