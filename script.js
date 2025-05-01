document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const puzzle = document.getElementById('puzzle');
    const photoInput = document.getElementById('photoInput');
    const resetButton = document.getElementById('resetButton');
    const newPhotoButton = document.getElementById('newPhotoButton');
    const viewOriginalButton = document.getElementById('viewOriginalButton');
    const movesElement = document.getElementById('moves');
    const timerElement = document.getElementById('timer');
    const winMessage = document.getElementById('winMessage');
    const originalImagePopup = document.getElementById('originalImagePopup');
    const originalImageContainer = document.getElementById('originalImageContainer');
    const finalMoves = document.getElementById('finalMoves');
    const finalTime = document.getElementById('finalTime');
    const closeWinMessage = document.getElementById('closeWinMessage');
    const closeOriginalImage = document.getElementById('closeOriginalImage');

    // Game state
    let currentImage = null;
    let tiles = [];
    let emptyTileIndex = 15; // Bottom right tile is initially empty
    let moveCount = 0;
    let timerInterval = null;
    let seconds = 0;
    let gameStarted = false;
    let puzzleSolved = false;

    // Initialize the puzzle grid
    function initializePuzzle() {
        puzzle.innerHTML = '';
        tiles = [];
        
        // Create 16 tiles (4x4 grid)
        for (let i = 0; i < 16; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.position = i.toString();
            tile.dataset.index = i.toString();
            
            // Make the last tile empty
            if (i === 15) {
                tile.classList.add('empty');
                emptyTileIndex = 15;
            }
            
            tile.addEventListener('click', () => handleTileClick(i));
            puzzle.appendChild(tile);
            tiles.push(tile);
        }
    }

    // Handle tile click
    function handleTileClick(index) {
        if (puzzleSolved || !currentImage) return;
        
        // Start the game timer on first move
        if (!gameStarted) {
            startTimer();
            gameStarted = true;
        }
        
        const clickedRow = Math.floor(index / 4);
        const clickedCol = index % 4;
        const emptyRow = Math.floor(emptyTileIndex / 4);
        const emptyCol = emptyTileIndex % 4;
        
        // Check if the clicked tile is in the same row or column as the empty tile
        if (clickedRow === emptyRow) {
            // Move tiles in a row (one position each)
            moveRowTiles(clickedRow, clickedCol, emptyCol);
            moveCount++;
            movesElement.textContent = `Moves: ${moveCount}`;
            
            // Check if the puzzle is solved
            if (isPuzzleSolved()) {
                puzzleSolved = true;
                stopTimer();
                showWinMessage();
            }
        } else if (clickedCol === emptyCol) {
            // Move tiles in a column (one position each)
            moveColumnTiles(clickedCol, clickedRow, emptyRow);
            moveCount++;
            movesElement.textContent = `Moves: ${moveCount}`;
            
            // Check if the puzzle is solved
            if (isPuzzleSolved()) {
                puzzleSolved = true;
                stopTimer();
                showWinMessage();
            }
        } else if (isAdjacent(index, emptyTileIndex)) {
            // If not in same row/column but adjacent, perform regular swap
            swapTiles(index, emptyTileIndex);
            emptyTileIndex = index;
            moveCount++;
            movesElement.textContent = `Moves: ${moveCount}`;
            
            // Check if the puzzle is solved
            if (isPuzzleSolved()) {
                puzzleSolved = true;
                stopTimer();
                showWinMessage();
            }
        }
    }
    
    // Move tiles in a row, each tile moves only to adjacent position
    function moveRowTiles(row, clickedCol, emptyCol) {
        // Determine direction of movement
        const direction = clickedCol < emptyCol ? 1 : -1;
        
        // Start with the tile adjacent to the empty space and move one by one
        let currentEmptyCol = emptyCol;
        
        // If moving tiles to the right (empty space is to the right of clicked tile)
        if (direction > 0) {
            // Start from the tile just to the left of the empty space and move left
            for (let col = emptyCol - 1; col >= clickedCol; col--) {
                const tileIndex = row * 4 + col;
                const emptyIndex = row * 4 + currentEmptyCol;
                swapTiles(tileIndex, emptyIndex);
                currentEmptyCol = col; // Update the empty space position
            }
        } 
        // If moving tiles to the left (empty space is to the left of clicked tile)
        else {
            // Start from the tile just to the right of the empty space and move right
            for (let col = emptyCol + 1; col <= clickedCol; col++) {
                const tileIndex = row * 4 + col;
                const emptyIndex = row * 4 + currentEmptyCol;
                swapTiles(tileIndex, emptyIndex);
                currentEmptyCol = col; // Update the empty space position
            }
        }
        
        // Update empty tile index
        emptyTileIndex = row * 4 + clickedCol;
    }
    
    // Move tiles in a column, each tile moves only to adjacent position
    function moveColumnTiles(col, clickedRow, emptyRow) {
        // Determine direction of movement
        const direction = clickedRow < emptyRow ? 1 : -1;
        
        // Start with the tile adjacent to the empty space and move one by one
        let currentEmptyRow = emptyRow;
        
        // If moving tiles down (empty space is below the clicked tile)
        if (direction > 0) {
            // Start from the tile just above the empty space and move up
            for (let row = emptyRow - 1; row >= clickedRow; row--) {
                const tileIndex = row * 4 + col;
                const emptyIndex = currentEmptyRow * 4 + col;
                swapTiles(tileIndex, emptyIndex);
                currentEmptyRow = row; // Update the empty space position
            }
        } 
        // If moving tiles up (empty space is above the clicked tile)
        else {
            // Start from the tile just below the empty space and move down
            for (let row = emptyRow + 1; row <= clickedRow; row++) {
                const tileIndex = row * 4 + col;
                const emptyIndex = currentEmptyRow * 4 + col;
                swapTiles(tileIndex, emptyIndex);
                currentEmptyRow = row; // Update the empty space position
            }
        }
        
        // Update empty tile index
        emptyTileIndex = clickedRow * 4 + col;
    }

    // Check if two tiles are adjacent
    function isAdjacent(index1, index2) {
        const row1 = Math.floor(index1 / 4);
        const col1 = index1 % 4;
        const row2 = Math.floor(index2 / 4);
        const col2 = index2 % 4;
        
        // Check if the tiles are adjacent horizontally or vertically
        return (
            (row1 === row2 && Math.abs(col1 - col2) === 1) ||
            (col1 === col2 && Math.abs(row1 - row2) === 1)
        );
    }

    // Swap two tiles
    function swapTiles(index1, index2) {
        const tile1 = tiles[index1];
        const tile2 = tiles[index2];
        
        // Swap the background positions
        const tempBackground = tile1.style.backgroundPosition;
        tile1.style.backgroundPosition = tile2.style.backgroundPosition;
        tile2.style.backgroundPosition = tempBackground;
        
        // Swap the classes
        tile1.classList.toggle('empty');
        tile2.classList.toggle('empty');
        
        // Swap the data-position attributes
        const tempPosition = tile1.dataset.position;
        tile1.dataset.position = tile2.dataset.position;
        tile2.dataset.position = tempPosition;
    }

    // Check if the puzzle is solved
    function isPuzzleSolved() {
        for (let i = 0; i < tiles.length; i++) {
            if (parseInt(tiles[i].dataset.position) !== i) {
                return false;
            }
        }
        return true;
    }

    // Shuffle the puzzle
    function shufflePuzzle() {
        // Reset game state
        moveCount = 0;
        seconds = 0;
        puzzleSolved = false;
        gameStarted = false;
        movesElement.textContent = 'Moves: 0';
        timerElement.textContent = 'Time: 0s';
        stopTimer();
        
        // Perform random moves to shuffle
        const moves = 100; // Number of random moves
        for (let i = 0; i < moves; i++) {
            // Get all possible moves (tiles adjacent to the empty tile)
            const possibleMoves = [];
            for (let j = 0; j < 16; j++) {
                if (isAdjacent(j, emptyTileIndex)) {
                    possibleMoves.push(j);
                }
            }
            
            // Choose a random move
            const randomIndex = Math.floor(Math.random() * possibleMoves.length);
            const tileToMove = possibleMoves[randomIndex];
            
            // Swap the tiles
            swapTiles(tileToMove, emptyTileIndex);
            emptyTileIndex = tileToMove;
        }
    }

    // Handle image upload
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            processImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // Process the uploaded image
    function processImage(imageUrl) {
        const img = new Image();
        img.onload = function() {
            // Create a canvas to crop and resize the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 400;
            canvas.height = 400;
            
            // Calculate the crop dimensions to make the image square
            let sourceX = 0;
            let sourceY = 0;
            let sourceWidth = img.width;
            let sourceHeight = img.height;
            
            if (img.width > img.height) {
                sourceX = (img.width - img.height) / 2;
                sourceWidth = img.height;
            } else {
                sourceY = (img.height - img.width) / 2;
                sourceHeight = img.width;
            }
            
            // Draw the cropped and resized image on the canvas
            ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 400, 400);
            
            // Set the processed image as the current image
            currentImage = canvas.toDataURL('image/jpeg');
            
            // Apply the image to the tiles
            applyImageToTiles();
            
            // Shuffle the puzzle
            shufflePuzzle();
        };
        img.src = imageUrl;
    }

    // Apply the current image to the tiles
    function applyImageToTiles() {
        for (let i = 0; i < 16; i++) {
            const position = parseInt(tiles[i].dataset.position);
            const row = Math.floor(position / 4);
            const col = position % 4;
            
            // Set the background image and position for each tile
            tiles[i].style.backgroundImage = `url(${currentImage})`;
            tiles[i].style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
            
            // Make sure the empty tile has no background
            if (i === emptyTileIndex) {
                tiles[i].classList.add('empty');
            } else {
                tiles[i].classList.remove('empty');
            }
        }
    }

    // Start the timer
    function startTimer() {
        stopTimer(); // Clear any existing timer
        seconds = 0;
        timerElement.textContent = 'Time: 0s';
        timerInterval = setInterval(() => {
            seconds++;
            timerElement.textContent = `Time: ${seconds}s`;
        }, 1000);
    }

    // Stop the timer
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    // Show the win message
    function showWinMessage() {
        finalMoves.textContent = moveCount;
        finalTime.textContent = seconds;
        winMessage.style.display = 'flex';
    }

    // Event listeners
    resetButton.addEventListener('click', () => {
        if (currentImage) {
            shufflePuzzle();
        }
    });

    newPhotoButton.addEventListener('click', () => {
        photoInput.click();
    });

    viewOriginalButton.addEventListener('click', () => {
        if (currentImage) {
            showOriginalImage();
        }
    });

    photoInput.addEventListener('change', handleImageUpload);
    
    // Show original image in popup
    function showOriginalImage() {
        // Clear previous image if any
        originalImageContainer.innerHTML = '';
        
        // Create image element
        const img = document.createElement('img');
        img.src = currentImage;
        originalImageContainer.appendChild(img);
        
        // Show popup
        originalImagePopup.style.display = 'flex';
    }
    
    // Hide original image popup
    function hideOriginalImage() {
        originalImagePopup.style.display = 'none';
    }

    // Completely revised close button implementation
    document.addEventListener('click', function(event) {
        if (event.target === closeWinMessage) {
            console.log('Close button clicked via document listener');
            winMessage.style.display = 'none';
            event.preventDefault();
            event.stopPropagation();
        } else if (event.target === winMessage) {
            console.log('Outside area clicked');
            winMessage.style.display = 'none';
        } else if (event.target === closeOriginalImage) {
            console.log('Close original image button clicked');
            hideOriginalImage();
            event.preventDefault();
            event.stopPropagation();
        } else if (event.target === originalImagePopup) {
            console.log('Outside original image area clicked');
            hideOriginalImage();
        }
    }, true);
    
    // Add direct inline handler as a backup
    closeWinMessage.setAttribute('onclick', "document.getElementById('winMessage').style.display='none'; console.log('Inline handler'); return false;");
    closeOriginalImage.setAttribute('onclick', "document.getElementById('originalImagePopup').style.display='none'; console.log('Inline handler for original image'); return false;");

    // Make sure win message is hidden at the start
    winMessage.style.display = 'none';

    // Initialize the puzzle
    initializePuzzle();
});