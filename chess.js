// create the board
//  - 8 * 8 grid 
//  - alternate black and white cells
//      - starts with white
//  - Cell
//    - color
//    - id
//    - piece?
//  - Each square has an id
// - Arrangement of the board
//  
// create a chess object
//  - unique chess piece keys
// Pieces
//  - currentPos (rows, cols)
//  - possiblePos
//  - name
//  - color
//  - uniqueMoveLogic??
//  - move - func
// Conditions
//  - kill
//  - Check
//    - checkmate
//  - castling

var columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
var rows = [1, 2, 3, 4, 5, 6, 7, 8];

var INIT_WHITE = {
  'A1': 'rook', 'B1': 'knight', 'C1': 'bishop', D1: 'king', 'E1': 'queen', 'F1': 'bishop', 'G1': 'knight', 'H1': 'rook',
  'A2': 'pawn', 'B2': 'pawn', 'C2': 'pawn', 'D2': 'pawn', 'E2': 'pawn', 'F2': 'pawn', 'G2': 'pawn', 'H2': 'pawn',
}

var INIT_BLACK = {
  'A8': 'rook', 'B8': 'knight', 'C8': 'bishop', D8: 'queen', 'E8': 'king', 'F8': 'bishop', 'G8': 'knight', 'H8': 'rook',
  'A7': 'pawn', 'B7': 'pawn', 'C7': 'pawn', 'D7': 'pawn', 'E7': 'pawn', 'F7': 'pawn', 'G7': 'pawn', 'H7': 'pawn',
}

var currentMover = 'white';

var selectedPiece;

var cells = {}; // Store of truth 

function assignPiece(row, col) {
  var id = col+row;

  if(INIT_WHITE[id]) {
    return new Piece(INIT_WHITE[id], 'white', row, col)
  } else if(INIT_BLACK[id]) {
    return new Piece(INIT_BLACK[id], 'black', row, col)
  } else {
    return null;
  }
}

rows.forEach((row, i) => {
  columns.forEach((col, j) => {

    var cell = {
      color: (i+j) % 2 == 0 ? 'white' : 'black',
      row: row,
      col: col,
      piece: assignPiece(row, col)
    }

    cells[col+row] = cell;
  })
});

function findPossiblePawnPos(obj) {

}

// 2 col, 1 row
// 2 row, 1 col
function findPossibleKnightPos(obj) { // 'A4'

  var potentialPos = [];

  var indexOfObjCol =  columns.indexOf(obj.col);

  var potentialColumns = [];

  columns.forEach((col, index) => {
    if(Math.abs(index - indexOfObjCol) <= 2 && Math.abs(index - indexOfObjCol) !== 0) {
      potentialColumns.push(col);
    }
  });

  potentialColumns.forEach((col, index) => {
    if(Math.abs(columns.indexOf(col) - indexOfObjCol) == 2) {
      (rows.indexOf(obj.row-1) !== -1) ? potentialPos.push(col + (obj.row-1)) : null;
      (rows.indexOf(obj.row+1) !== -1) ? potentialPos.push(col + (obj.row+1)) : null;
    } else {
      (rows.indexOf(obj.row-2) !== -1) ? potentialPos.push(col + (obj.row-2)) : null;
      (rows.indexOf(obj.row+2) !== -1) ? potentialPos.push(col + (obj.row+2)) : null;
    }
  });

  return potentialPos;
}

function findPossiblePawnPos(obj) {
  
}



function Piece(name, color, row, col) {
  this.name = name;
  this.color = color;
  this.row = row;
  this.col = col;
  this.timesMoved = 0;
  this.possiblePositions = ['A3', 'A4'];
  // position - A1
  // check for validity of move
  // move.
  this.move = function(pos) {
    
    // TODO:check the validity of move.

    var currentPos = this.col + this.row;
    var nextPos = pos;

    this.col = nextPos.split('')[0];
    this.row = nextPos.split('')[1];

    console.log('I am supposed to move to ', nextPos, 'and my current pos is', currentPos);

    // empty the .piece property on the cell object
    cells[currentPos].piece = null;
    // set an new .piece prop on the nextPos cell obj
    // kill logic
    cells[nextPos].piece = this;
    
    // flip the currentMover
    currentMover = this.color == 'white' ? 'black' : 'white';
    selectedPiece = null;

    ++this.timesMoved;

    renderGame();
  }
}

function renderGame() {
  var htmlString = '';
  for(var cell in cells) {
    var pieceInfo = cells[cell].piece ? cells[cell].piece.color + '-' + cells[cell].piece.name : '';
    htmlString += `<div id="${cell}" class="${cells[cell].color} cell" data-piece="${pieceInfo}"></div>`;
  }

  var root = document.getElementById('chess-board');
  root.innerHTML = htmlString;

  //addEventListeners
  var allCells = document.querySelectorAll('.cell');

  allCells.forEach((cell, index) => {
    cell.addEventListener('click', () => {

      if(cells[cell.id].piece && (cells[cell.id].piece.color == currentMover)) {
        selectedPiece = cells[cell.id].piece;
        return;
      }

      if(selectedPiece) {
        selectedPiece.move(cell.id);
      }

    });
  })
}

renderGame();
