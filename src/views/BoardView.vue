<template>

  <div id="whiteFacingBoard" class="board" ng-show="!board.boardRotated">
    <div class="" ng-repeat="rank in board.ranks">
      <div class="row">
        <div class="" ng-repeat="file in board.files">
          <!-- <div class="{{file}}{{8-$parent.$index}}" ng-click="board.select($event);" -->
          <!-- ng-class="{'white': ($index + $parent.$index) % 2 == 0, 'black': ($index + $parent.$index) % 2 != 0}"></div> -->
        </div>
      </div>
    </div>
  </div>

  <div id="blackFacingBoard" class="board" ng-show="board.boardRotated">
    <div class="" ng-repeat="rank in board.ranks">
      <div class="row">
        <div class="" ng-repeat="file in board.files | orderBy:'':true">
          <!-- <div class="{{file}}{{1+$parent.$index}}" ng-click="board.select($event);" -->
          <!-- ng-class="{'white': ($index + $parent.$index) % 2 == 0, 'black': ($index + $parent.$index) % 2 != 0}"></div> -->
        </div>
      </div>
    </div>
  </div>

  <br>

  <hr>

  <div class="row">
    <button class="btn btn-lg btn-warning col-xs-2 boardButton" ng-click="board.undo()">Undo</button>
    <button class="btn btn-lg btn-primary col-xs-4 col-xs-offset-1 boardButton"
      ng-click="board.togglePiecePallet()">Piece Pallet</button>
    <button class="btn btn-lg btn-success col-xs-4 col-xs-offset-1 boardButton"
      ng-show="board.showStart && !board.gameStarted" ng-click="board.resetGame(false); board.toggleStart()">Start
      Game</button>

    <button ng-show="!board.showStart" id="gameMenu" type="button"
      class="btn btn-lg btn-default col-xs-4 col-xs-offset-1" ng-click="board.toggleGameMenu($event)">
      <i class="fa fa-bars" aria-hidden="true"></i>
    </button>
  </div>

  <div ng-show="board.showGameMenu">
    <div class="row">
      <hr>
      <button class="btn btn-sm btn-success col-xs-3 boardButton" ng-click="board.saveCurrentConfig();">Save
        Board</button>

      <select class="col-xs-3 col-xs-offset-1 dropdown" ng-model="board.LoadThisBoardConfig">
        <!-- <option ng-repeat="config in board.savedConfigs" value="{{config}}">{{ config.name }}</option> -->
      </select>
      <button class="btn btn-sm btn-warning col-xs-2 boardButton" ng-click="board.loadBoardConfig();">Load</button>

      <button class="btn btn-sm btn-danger col-xs-2  col-xs-offset-1 boardButton" ng-show="board.gameStarted"
        ng-click="board.resetGame();">Reset</button>
    </div>
    <br>
    <div class="row">
      <button class="btn btn-sm btn-primary col-xs-3 boardButton" ng-click="board.rotateBoard()">Rotate Board</button>
    </div>
  </div>

  <hr>

  <div ng-show="board.showPiecePallet">
    <div class="palletContainer">
      <div class="row">
        <!-- <div class="piecePalletCell" id="palletPiece-{{piece.type}}" ng-repeat="piece in board.whitePalletCells" -->
        <!-- ng-click="board.select($event)"> -->
        <!-- <img class="chessPiece" type="{{piece.type}}" ng-src="img/{{piece.image}}"> -->
        <!-- </div> -->
      </div>
      <div class="row">
        <!-- <div class="piecePalletCell" id="palletPiece-{{piece.type}}" ng-repeat="piece in board.blackPalletCells" -->
        <!-- ng-click="board.select($event)"> -->
        <!-- <img class="chessPiece" type="{{piece.type}}" ng-src="img/{{piece.image}}"> -->
        <!-- </div> -->
      </div>
    </div>
    <hr>
  </div>
</template>

<script setup lang="ts">

const playerMe = 'me';
const playerOpponent = "";
const gameStarted = false;
const playerTurn = playerMe;

const ranks = [1, 2, 3, 4, 5, 6, 7, 8];
const files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const whitePalletCells = [
  { 'type': 'White-Pawn', 'image': 'whitePawn.svg' },
  { 'type': 'White-Rook', 'image': 'whiteRook.svg' },
  { 'type': 'White-Knight', 'image': 'whiteKnight.svg' },
  { 'type': 'White-Bishop', 'image': 'whiteBishop.svg' },
  { 'type': 'White-King', 'image': 'whiteKing.svg' },
  { 'type': 'White-Queen', 'image': 'whiteQueen.svg' }];

const blackPalletCells = [
  { 'type': 'Black-Pawn', 'image': 'blackPawn.svg' },
  { 'type': 'Black-Rook', 'image': 'blackRook.svg' },
  { 'type': 'Black-Knight', 'image': 'blackKnight.svg' },
  { 'type': 'Black-Bishop', 'image': 'blackBishop.svg' },
  { 'type': 'Black-King', 'image': 'blackKing.svg' },
  { 'type': 'Black-Queen', 'image': 'blackQueen.svg' }];

const moveStack = [];

let showStart = true;
function toggleStart() {
  showStart = !showStart;
}

let showPiecePallet = false;
function togglePiecePallet() {
  showPiecePallet = !showPiecePallet;
}

// resetPiecePallet = function () {
//   for (var i = 0; i < 6; i++) {
//     document.getElementById('palletPiece-' + whitePalletCells[i].type).innerHTML = '<img class="chessPiece" type="' + whitePalletCells[i].type + '" src="img/' + whitePalletCells[i].image + '">';
//     document.getElementById('palletPiece-' + blackPalletCells[i].type).innerHTML = '<img class="chessPiece" type="' + blackPalletCells[i].type + '" src="img/' + blackPalletCells[i].image + '">';
//   }
// }

// // CONFIGURATIONS
// startingBoardConfig = {
//   "A1": "White-Rook", "A2": "White-Pawn", "A7": "Black-Pawn", "A8": "Black-Rook",
//   "B1": "White-Knight", "B2": "White-Pawn", "B7": "Black-Pawn", "B8": "Black-Knight",
//   "C1": "White-Bishop", "C2": "White-Pawn", "C7": "Black-Pawn", "C8": "Black-Bishop",
//   "D1": "White-Queen", "D2": "White-Pawn", "D7": "Black-Pawn", "D8": "Black-Queen",
//   "E1": "White-King", "E2": "White-Pawn", "E7": "Black-Pawn", "E8": "Black-King",
//   "F1": "White-Bishop", "F2": "White-Pawn", "F7": "Black-Pawn", "F8": "Black-Bishop",
//   "G1": "White-Knight", "G2": "White-Pawn", "G7": "Black-Pawn", "G8": "Black-Knight",
//   "H1": "White-Rook", "H2": "White-Pawn", "H7": "Black-Pawn", "H8": "Black-Rook"
// }

// blankBoardConfig = {
//   "A1": "", "A2": "", "A3": "", "A4": "", "A5": "", "A6": "", "A7": "", "A8": "",
//   "B1": "", "B2": "", "B3": "", "B4": "", "B5": "", "B6": "", "B7": "", "B8": "",
//   "C1": "", "C2": "", "C3": "", "C4": "", "C5": "", "C6": "", "C7": "", "C8": "",
//   "D1": "", "D2": "", "D3": "", "D4": "", "D5": "", "D6": "", "D7": "", "D8": "",
//   "E1": "", "E2": "", "E3": "", "E4": "", "E5": "", "E6": "", "E7": "", "E8": "",
//   "F1": "", "F2": "", "F3": "", "F4": "", "F5": "", "F6": "", "F7": "", "F8": "",
//   "G1": "", "G2": "", "G3": "", "G4": "", "G5": "", "G6": "", "G7": "", "G8": "",
//   "H1": "", "H2": "", "H3": "", "H4": "", "H5": "", "H6": "", "H7": "", "H8": ""
// }

// boardConfig = startingBoardConfig;
// // END CONFIGURATIONS

// showGameMenu = false;
// toggleGameMenu = function (e, close = false) {
//   e.stopPropagation();
//   if (close == 'keepAlive') {
//     return;
//   }
//   if (close == true) {
//     showGameMenu = false;
//     return;
//   }
//   else {
//     showGameMenu = !showGameMenu;
//   }
// }

// if (window.localStorage.savedBoardConfig != null) {
//   savedConfigs = JSON.parse(window.localStorage.savedBoardConfig);
// }
// else {
//   savedConfigs = [];
// }
// saveCurrentConfig = function () {
//   var name = prompt("What would you like to call this board Configuration?");
//   var savedBoards = [];
//   if (window.localStorage.savedBoardConfig != null) {
//     savedBoards = JSON.parse(window.localStorage.savedBoardConfig);
//   }
//   var configObject = {
//     "name": name,
//     "config": boardConfig
//   }
//   savedBoards.push(configObject);
//   window.localStorage.savedBoardConfig = JSON.stringify(savedBoards);
//   savedConfigs.push(configObject);
// }

// loadBoardConfig = function () {
//   var config = JSON.parse(LoadThisBoardConfig);
//   if (confirm("Are you sure you want to load the following Board Configuration: " + config.name)) {
//     populateJsonBoard(config.config);
//   }
// }

// // Map the piece types to there respective images
// pieceMap = {
//   "White-Pawn": "whitePawn.svg", "White-Knight": "whiteKnight.svg", "White-Bishop": "whiteBishop.svg", "White-Rook": "whiteRook.svg", "White-King": "whiteKing.svg", "White-Queen": "whiteQueen.svg",
//   "Black-Pawn": "blackPawn.svg", "Black-Knight": "blackKnight.svg", "Black-Bishop": "blackBishop.svg", "Black-Rook": "blackRook.svg", "Black-King": "blackKing.svg", "Black-Queen": "blackQueen.svg"
// }

// resetGame = function (ask = true) {
//   if (playerOpponent == "" || playerOpponent == null) {
//     gameStarted.value = false;
//   }
//   else {
//     gameStarted.value = true;
//   }

//   if (ask) {
//     if (!confirm("You cannot undo this action!  Are you sure you want to reset the board?")) {
//       return;
//     }
//   }

//   resetPiecePallet();

//   moveStack = [];

//   selectedPiece = null;

//   clearBoard();

//   // Set up Board with the starting JSON config
//   populateJsonBoard(startingBoardConfig);
// }

// select = function (e) {
//   //This is how we get data for a piece
//   //console.log(e.target.attributes.type.nodeValue);

//   // If a piece is already selected then we will move or capture
//   if (selectedPiece != null) {

//     // If we are moving to a DIV then we don't need to capture
//     if (e.target.tagName == "DIV") {
//       newLocation = e.target;
//       move(newLocation, selectedPiece.parentNode);
//     }
//     else if (e.target.tagName == "IMG") {
//       // If we select the same piece then don't do anything
//       if (e.target == selectedPiece) {
//         selectedPiece = null;
//         return;
//       }

//       // If we want to move to where there is an IMG then we need to capture
//       newLocation = e.target.parentNode;
//       // Pass in where we are going and where we came from
//       capture(newLocation, selectedPiece.parentNode);
//     }


//     return;
//   }

//   if (e.target.children.length == 0) {
//     if (e.target.tagName == "IMG") {
//       selectedPiece = e.target;
//     }
//     else {
//       selectedPiece = null;
//     }
//   }
//   else {
//     if (e.target.firstChild.tagName == "IMG") {
//       selectedPiece = e.target.firstChild;
//     }
//     else {
//       selectedPiece = null;
//     }
//   }
// }

// move = function (newLocation, oldLocation) {

//   // Change the DOM to move the piece
//   newLocation.appendChild(selectedPiece)

//   // Keep track of where we moved
//   moveStack.push({
//     'movedPiece': selectedPiece,
//     'oldLocation': oldLocation,
//     'newLocation': newLocation,
//     'capturedPiece': null
//   });

//   // Reset stuff
//   selectedPiece = null;
//   newLocation = null;
//   resetPiecePallet();
//   makeBoardJson();
//   return;
// }

// capture = function (newLocation, oldLocation) {

//   // Change the DOM to Capture the piece
//   var capturedPiece = newLocation.firstChild;
//   newLocation.removeChild(newLocation.firstChild);
//   newLocation.appendChild(selectedPiece);

//   // Keep track of where we are moving
//   moveStack.push({
//     'movedPiece': selectedPiece,
//     'oldLocation': oldLocation,
//     'newLocation': newLocation,
//     'capturedPiece': capturedPiece
//   });

//   // Reset stuff
//   selectedPiece = null;
//   newLocation = null;
//   resetPiecePallet();
//   makeBoardJson();
//   return;
// }

// undo = function () {
//   if (moveStack.length == 0) {
//     return;
//   }
//   // Get the last move
//   var move = moveStack.pop();

//   // Put the Pieces back
//   move.newLocation.removeChild(move.movedPiece);
//   if (move.capturedPiece != null) {
//     move.newLocation.appendChild(move.capturedPiece);
//   }
//   move.oldLocation.appendChild(move.movedPiece);

//   selectedPiece = null;
// }

// clearBoard = function () {
//   for (var i = 1; i <= 8; i++) {
//     document.getElementsByClassName('A' + i)[0].innerHTML = "";
//     document.getElementsByClassName('B' + i)[0].innerHTML = "";
//     document.getElementsByClassName('C' + i)[0].innerHTML = "";
//     document.getElementsByClassName('D' + i)[0].innerHTML = "";
//     document.getElementsByClassName('E' + i)[0].innerHTML = "";
//     document.getElementsByClassName('F' + i)[0].innerHTML = "";
//     document.getElementsByClassName('G' + i)[0].innerHTML = "";
//     document.getElementsByClassName('H' + i)[0].innerHTML = "";

//     document.getElementsByClassName('A' + i)[1].innerHTML = "";
//     document.getElementsByClassName('B' + i)[1].innerHTML = "";
//     document.getElementsByClassName('C' + i)[1].innerHTML = "";
//     document.getElementsByClassName('D' + i)[1].innerHTML = "";
//     document.getElementsByClassName('E' + i)[1].innerHTML = "";
//     document.getElementsByClassName('F' + i)[1].innerHTML = "";
//     document.getElementsByClassName('G' + i)[1].innerHTML = "";
//     document.getElementsByClassName('H' + i)[1].innerHTML = "";
//   }
// }

// makeBoardJson = function () {
//   // Get snapshot of board and make a JSON board config out of it
//   boardConfig = {};

//   //if something in the divs then it is a piece so we need to record it
//   for (var i = 1; i <= 8; i++) {
//     for (var j = 0; j < 8; j++) {
//       if (document.getElementsByClassName(files[j] + i)[0].innerHTML && !boardRotated) {
//         boardConfig[files[j] + i] = document.getElementsByClassName(files[j] + i)[0].firstChild.getAttribute('type');
//       }
//       else if (document.getElementsByClassName(files[j] + i)[1].innerHTML && boardRotated) {
//         boardConfig[files[j] + i] = document.getElementsByClassName(files[j] + i)[1].firstChild.getAttribute('type');
//       }
//     }
//   }
// }

// populateJsonBoard = function (boardConfig = boardConfig) {
//   clearBoard();
//   for (var square in boardConfig) {
//     var pieceType = boardConfig[square];
//     document.getElementsByClassName(square)[0].innerHTML = '<img type="' + pieceType + '" class="chessPiece" src="img/' + pieceMap[pieceType] + '">';
//     document.getElementsByClassName(square)[1].innerHTML = '<img type="' + pieceType + '" class="chessPiece" src="img/' + pieceMap[pieceType] + '">';
//   }
// }

// boardRotated = false;
// rotateBoard = function () {
//   boardRotated = !boardRotated;
//   populateJsonBoard(boardConfig);
// }





</script>

<style>
* {
  background-color: #121212;
  color: white;
}

.white {
  background-color: white;
  color: black;
  width: 12vw;
  height: 12vw;
  float: left;
}

.white:hover {
  background-color: lightblue;
  width: 12vw;
  height: 12vw;
  float: left;
}

.black {
  background-color: saddlebrown;
  width: 12vw;
  height: 12vw;
  float: left;
}

.black:hover {
  background-color: lightblue;
  width: 12vw;
  height: 12vw;
  float: left;
}

.board {
  background-color: blue;
}
</style>
