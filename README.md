# PhotoSliderPuzzle

A web-based sliding puzzle game that allows users to upload their own photos and solve the puzzle by rearranging the tiles to recreate the original image.


## Features

- **Custom Photo Upload**: Upload any image to create a personalized puzzle
- **4x4 Grid**: Classic 15-tile sliding puzzle format
- **Row and Column Movement**: Click any tile in the same row or column as the empty space to move multiple tiles at once
- **Original Image View**: View the original image while solving the puzzle
- **Game Statistics**: Track moves and time taken to solve the puzzle
- **Responsive Design**: Play on desktop or mobile devices
- **Congratulations Message**: Displays your score upon completion

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
  
## How to Play

1. Upload a photo using the "New Photo" button
2. Click on tiles adjacent to the empty space to move them one position
3. Click on any tile in the same row or column as the empty space to move all tiles between them
4. Rearrange the tiles to recreate the original image
5. Use the "Reset" button to shuffle the current puzzle
6. Click the "View Original" button to see the complete original image in a popup

## Game Logic

- The game creates a 4×4 grid with 15 tiles and one empty space
- Tiles can only move into the empty space
- The game tracks the number of moves and time taken
- The puzzle is considered solved when all tiles are in their original positions
- The game uses a shuffling algorithm that ensures the puzzle is solvable

## Project Structure

- `index.html`: Main HTML structure
- `styles.css`: CSS styling for the game
- `script.js`: JavaScript game logic

## Author

- Matthew W.
