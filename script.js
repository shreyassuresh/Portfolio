document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const sidebarLeft = document.querySelector('.sidebar-left');
    const mainContent = document.querySelector('.main-content');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            sidebarLeft.classList.toggle('active');
            mainContent.classList.toggle('shifted');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            if (!sidebarLeft.contains(event.target) && !navToggle.contains(event.target)) {
                sidebarLeft.classList.remove('active');
                mainContent.classList.remove('shifted');
            }
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add active state to nav items
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Highlight current section in navigation
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-menu a');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});

// Chess Board Functionality
function createChessBoard() {
    const board = document.querySelector('.chess-board');
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    // Clear existing board
    board.innerHTML = '';

    // Create squares
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.className = `chess-square ${(i + j) % 2 === 0 ? 'light' : 'dark'}`;
            
            // Add coordinates
            const coordinate = document.createElement('span');
            if (i === 7) {
                coordinate.className = 'coordinate file';
                coordinate.textContent = files[j];
            }
            if (j === 0) {
                const rankCoord = document.createElement('span');
                rankCoord.className = 'coordinate rank';
                rankCoord.textContent = ranks[i];
                square.appendChild(rankCoord);
            }
            square.appendChild(coordinate);

            // Add chess piece if it's an initial position
            if (i <= 1 || i >= 6) {
                const piece = document.createElement('div');
                piece.className = `chess-piece ${i <= 1 ? 'piece-black' : 'piece-white'} ${getPieceType(i, j)}`;
                square.appendChild(piece);
            }

            board.appendChild(square);
        }
    }
}

function getPieceType(rank, file) {
    if (rank === 1 || rank === 6) return 'pawn';
    if (rank === 0 || rank === 7) {
        switch (file) {
            case 0:
            case 7:
                return 'rook';
            case 1:
            case 6:
                return 'knight';
            case 2:
            case 5:
                return 'bishop';
            case 3:
                return 'queen';
            case 4:
                return 'king';
            default:
                return '';
        }
    }
    return '';
}

function toggleChessBoard() {
    const container = document.getElementById('chess-board-container');
    container.classList.toggle('active');
    if (container.classList.contains('active')) {
        createChessBoard();
    }
}

function resetBoard() {
    createChessBoard();
}

function toggleCoordinates() {
    const board = document.querySelector('.chess-board');
    board.classList.toggle('hide-coordinates');
}

function toggleHighlight() {
    const board = document.querySelector('.chess-board');
    board.classList.toggle('show-highlights');
}

// Initialize chess board when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('chess-board-container');
    if (container) {
        container.classList.remove('active');
    }
});

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const container = document.getElementById('chess-board-container');
        container.classList.remove('active');
    }
});

// Add piece movement functionality
let selectedPiece = null;

document.addEventListener('click', (e) => {
    const piece = e.target.closest('.chess-piece');
    const square = e.target.closest('.chess-square');

    if (!piece && !square) return;

    if (selectedPiece) {
        // If a piece is already selected
        document.querySelectorAll('.chess-square').forEach(sq => sq.classList.remove('highlighted', 'selected'));
        
        if (square && square !== selectedPiece.parentElement) {
            // Move the piece
            square.innerHTML = '';
            square.appendChild(selectedPiece);
        }
        selectedPiece = null;
    } else if (piece) {
        // Select the piece
        selectedPiece = piece;
        piece.parentElement.classList.add('selected');
        
        // Highlight possible moves (simplified)
        document.querySelectorAll('.chess-square').forEach(sq => {
            if (!sq.querySelector('.chess-piece')) {
                sq.classList.add('highlighted');
            }
        });
    }
}); 