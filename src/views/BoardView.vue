<template>
  <div class="chess-board">
    <div id="whiteFacingBoard" class="board" v-show="!boardRotated">
      <div v-for="(rank, rankIndex) of ranks" :key="rankIndex">
        <div class="row" :class="rank">
          <div v-for="(file, fileIndex) of files" :key="file">
            <div @click="select($event)"
              :class="((fileIndex + rankIndex) % 2 == 0) ? ('white ' + file + '' + (8 - rankIndex)) : ('black ' + file + '' + (8 - rankIndex))">
              <!-- TODO: refactor this into a function -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="blackFacingBoard" class="board" v-show="boardRotated">
      <div v-for="(rank, rankIndex) of ranks" :key="rankIndex">
        <div class="row" :class="rank">
          <div v-for="(file, fileIndex) of files" :key="fileIndex">
            <div @click="select($event);"
              :class="((fileIndex + rankIndex) % 2 == 0) ? ('white ' + file + '' + (rankIndex + 1)) : ('black ' + file + '' + (1 + rankIndex))">
            </div>
          </div>
        </div>
      </div>
    </div>

    <br>

    <hr>

    <div class="row">
      <button class="btn btn-lg btn-warning col-xs-2 boardButton" @click="undo()">Undo</button>
      <button class="btn btn-lg btn-primary col-xs-4 col-xs-offset-1 boardButton" @click="togglePiecePallet()">
        Piece Pallet</button>
      <button class="btn btn-lg btn-success col-xs-4 col-xs-offset-1 boardButton" v-show="showStart && !gameStarted"
        @click="resetGame(false); toggleStart()">Start Game</button>

      <button v-show="!showStart" id="gameMenu" class="btn btn-lg btn-default col-xs-4 col-xs-offset-1 boardButton"
        @click="toggleGameMenu($event)">
        Menu
        <i class="fa fa-bars" aria-hidden="true"></i>
      </button>
    </div>

    <div v-show="showGameMenu">
      <div class="row">
        <hr>
        <button class="btn btn-sm btn-success col-xs-3 boardButton" @click="saveCurrentConfig()">Save
          Board</button>

        <select class="col-xs-3 col-xs-offset-1 dropdown" v-model="LoadThisBoardConfig">
          <option v-for="(config, i) of savedConfigs" :key="i" :value="config">{{ config.name }}</option>
        </select>
        <button class="btn btn-sm btn-warning col-xs-2 boardButton" @click="loadBoardConfig();">Load</button>

        <button class="btn btn-sm btn-danger col-xs-2  col-xs-offset-1 boardButton" v-show="gameStarted"
          @click="resetGame();">Reset</button>
      </div>
      <br>
      <div class="row">
        <button class="btn btn-sm btn-primary col-xs-3 boardButton" @click="rotateBoard()">Rotate Board</button>
      </div>
    </div>

    <hr>

    <div v-show="showPiecePallet">
      <div class="palletContainer">
        <div class="row">
          <div class="piecePalletCell" v-for="(piece, i) of  whitePalletCells " :key="i"
            :id="'palletPiece-' + piece.type" @click="select($event)">
            <img class="chessPiece" :type="piece.type" :src="piece.image">
          </div>
        </div>
        <div class="row">
          <div class="piecePalletCell" :id="'palletPiece-' + piece.type" v-for="(piece, i) of blackPalletCells" :key="i"
            @click="select($event)">
            <img class="chessPiece" :type="piece.type" :src="piece.image">
          </div>
        </div>
      </div>
      <hr>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';

const gameStarted = ref(false);
const LoadThisBoardConfig = ref();
const ranks = ref([1, 2, 3, 4, 5, 6, 7, 8]);
const files = ref(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
const boardRotated = ref(false);
const newLocation = ref();

const whitePalletCells: Ref<{ type: string, image: string }[]> = ref([
  { 'type': 'White-Pawn', 'image': '/src/assets/img/whitePawn.svg' },
  { 'type': 'White-Rook', 'image': '/src/assets/img/whiteRook.svg' },
  { 'type': 'White-Knight', 'image': '/src/assets/img/whiteKnight.svg' },
  { 'type': 'White-Bishop', 'image': '/src/assets/img/whiteBishop.svg' },
  { 'type': 'White-King', 'image': '/src/assets/img/whiteKing.svg' },
  { 'type': 'White-Queen', 'image': '/src/assets/img/whiteQueen.svg' }]
);
const blackPalletCells: Ref<{ type: string, image: string }[]> = ref([
  { 'type': 'Black-Pawn', 'image': '/src/assets/img/blackPawn.svg' },
  { 'type': 'Black-Rook', 'image': '/src/assets/img/blackRook.svg' },
  { 'type': 'Black-Knight', 'image': '/src/assets/img/blackKnight.svg' },
  { 'type': 'Black-Bishop', 'image': '/src/assets/img/blackBishop.svg' },
  { 'type': 'Black-King', 'image': '/src/assets/img/blackKing.svg' },
  { 'type': 'Black-Queen', 'image': '/src/assets/img/blackQueen.svg' }]);

const moveStack: Ref<any[]> = ref([]); // TODO: type this
const showStart = ref(true);
let showPiecePallet = ref(false);

const startingBoardConfig = {
  "A1": "White-Rook", "A2": "White-Pawn", "A7": "Black-Pawn", "A8": "Black-Rook",
  "B1": "White-Knight", "B2": "White-Pawn", "B7": "Black-Pawn", "B8": "Black-Knight",
  "C1": "White-Bishop", "C2": "White-Pawn", "C7": "Black-Pawn", "C8": "Black-Bishop",
  "D1": "White-Queen", "D2": "White-Pawn", "D7": "Black-Pawn", "D8": "Black-Queen",
  "E1": "White-King", "E2": "White-Pawn", "E7": "Black-Pawn", "E8": "Black-King",
  "F1": "White-Bishop", "F2": "White-Pawn", "F7": "Black-Pawn", "F8": "Black-Bishop",
  "G1": "White-Knight", "G2": "White-Pawn", "G7": "Black-Pawn", "G8": "Black-Knight",
  "H1": "White-Rook", "H2": "White-Pawn", "H7": "Black-Pawn", "H8": "Black-Rook"
}

const blankBoardConfig = {
  "A1": "", "A2": "", "A3": "", "A4": "", "A5": "", "A6": "", "A7": "", "A8": "",
  "B1": "", "B2": "", "B3": "", "B4": "", "B5": "", "B6": "", "B7": "", "B8": "",
  "C1": "", "C2": "", "C3": "", "C4": "", "C5": "", "C6": "", "C7": "", "C8": "",
  "D1": "", "D2": "", "D3": "", "D4": "", "D5": "", "D6": "", "D7": "", "D8": "",
  "E1": "", "E2": "", "E3": "", "E4": "", "E5": "", "E6": "", "E7": "", "E8": "",
  "F1": "", "F2": "", "F3": "", "F4": "", "F5": "", "F6": "", "F7": "", "F8": "",
  "G1": "", "G2": "", "G3": "", "G4": "", "G5": "", "G6": "", "G7": "", "G8": "",
  "H1": "", "H2": "", "H3": "", "H4": "", "H5": "", "H6": "", "H7": "", "H8": ""
}

const selectedPiece = ref();

const savedConfigs: Ref<{
  name: string,
  config: any // TODO: type this
}[]> = ref([]);

const boardConfig = ref(startingBoardConfig);
const showGameMenu = ref(false);

function toggleStart() {
  showStart.value = !showStart.value;
}

function togglePiecePallet() {
  showPiecePallet.value = !showPiecePallet.value;
}

function resetPiecePallet() {
  for (var i = 0; i < 6; i++) {
    (document.getElementById('palletPiece-' + whitePalletCells.value[i].type) as any).innerHTML = '<img class="chessPiece" type="' + whitePalletCells.value[i].type + '" src="' + whitePalletCells.value[i].image + '">';
    (document.getElementById('palletPiece-' + blackPalletCells.value[i].type) as any).innerHTML = '<img class="chessPiece" type="' + blackPalletCells.value[i].type + '" src="' + blackPalletCells.value[i].image + '">';
  }
}


function toggleGameMenu(e: any, close: boolean | string = false) { // Type e
  e.stopPropagation();
  if (close == 'keepAlive') {
    return;
  }
  if (close == true) {
    showGameMenu.value = false;
    return;
  }
  else {
    showGameMenu.value = !showGameMenu.value;
  }
}

if (window.localStorage.savedBoardConfig != null) {
  savedConfigs.value = JSON.parse(window.localStorage.savedBoardConfig);
}
else {
  savedConfigs.value = [];
}
function saveCurrentConfig() {
  var name = prompt("What would you like to call this board Configuration?");
  var savedBoards = [];
  if (window.localStorage.savedBoardConfig != null) {
    savedBoards = JSON.parse(window.localStorage.savedBoardConfig);
  }
  var configObject = {
    "name": name,
    "config": boardConfig.value
  }
  savedBoards.push(configObject);
  window.localStorage.savedBoardConfig = JSON.stringify(savedBoards);
  savedConfigs.value.push(configObject as any); // TODO: type this
}

function loadBoardConfig() {
  var config = JSON.parse(LoadThisBoardConfig.value);
  if (confirm("Are you sure you want to load the following Board Configuration: " + config.name)) {
    populateJsonBoard(config.config);
  }
}

// Map the piece types to there respective images
const pieceMap = ref({
  "White-Pawn": "/src/assets/img/whitePawn.svg",
  "White-Knight": "/src/assets/img/whiteKnight.svg",
  "White-Bishop": "/src/assets/img/whiteBishop.svg",
  "White-Rook": "/src/assets/img/whiteRook.svg",
  "White-King": "/src/assets/img/whiteKing.svg",
  "White-Queen": "/src/assets/img/whiteQueen.svg",

  "Black-Pawn": "/src/assets/img/blackPawn.svg",
  "Black-Knight": "/src/assets/img/blackKnight.svg",
  "Black-Bishop": "/src/assets/img/blackBishop.svg",
  "Black-Rook": "/src/assets/img/blackRook.svg",
  "Black-King": "/src/assets/img/blackKing.svg",
  "Black-Queen": "/src/assets/img/blackQueen.svg"
});

function resetGame(ask = true) {
  gameStarted.value = true;

  if (ask) {
    if (!confirm("You cannot undo this action!  Are you sure you want to reset the board?")) {
      return;
    }
  }

  resetPiecePallet();
  moveStack.value = [];
  selectedPiece.value = null;
  clearBoard();
  populateJsonBoard(startingBoardConfig as any);
}

function select(e: any) {
  if (selectedPiece.value != null) {
    if (e.target.tagName == "DIV") {
      newLocation.value = e.target;
      move(selectedPiece.value.parentNode);
    }
    else if (e.target.tagName == "IMG") {
      if (e.target == selectedPiece.value) {
        selectedPiece.value = null;
        return;
      }
      newLocation.value = e.target.parentNode;
      capture(selectedPiece.value.parentNode);
    }
    return;
  }

  if (e.target.children.length == 0) {
    if (e.target.tagName == "IMG") {
      selectedPiece.value = e.target;
    }
    else {
      selectedPiece.value = null;
    }
  }
  else {
    if (e.target.firstChild.tagName == "IMG") {
      selectedPiece.value = e.target.firstChild;
    }
    else {
      selectedPiece.value = null;
    }
  }
}

function move(oldLocation: any) {
  newLocation.value.appendChild(selectedPiece.value)
  moveStack.value.push({
    'movedPiece': selectedPiece.value,
    'oldLocation': oldLocation,
    'newLocation': newLocation.value,
    'capturedPiece': null
  });


  resetBoard();
  newLocation.value = null;
  return;
}

function capture(oldLocation: any) {
  var capturedPiece = newLocation.value.firstChild;
  newLocation.value.removeChild(newLocation.value.firstChild);
  newLocation.value.appendChild(selectedPiece.value);

  moveStack.value.push({
    'movedPiece': selectedPiece.value,
    'oldLocation': oldLocation,
    'newLocation': newLocation.value,
    'capturedPiece': capturedPiece
  });

  resetBoard();
  newLocation.value = null;
  return;
}

function undo() {
  if (moveStack.value.length == 0) {
    return;
  }
  // Get the last move
  var move = moveStack.value.pop();

  // Put the Pieces back
  move.newLocation.value.removeChild(move.movedPiece);
  if (move.capturedPiece != null) {
    move.newLocation.value.appendChild(move.capturedPiece);
  }
  move.oldLocation.appendChild(move.movedPiece);

  selectedPiece.value = null;
}

function clearBoard() {
  for (var i = 1; i <= 8; i++) {
    document.getElementsByClassName('A' + i)[0].innerHTML = "";
    document.getElementsByClassName('B' + i)[0].innerHTML = "";
    document.getElementsByClassName('C' + i)[0].innerHTML = "";
    document.getElementsByClassName('D' + i)[0].innerHTML = "";
    document.getElementsByClassName('E' + i)[0].innerHTML = "";
    document.getElementsByClassName('F' + i)[0].innerHTML = "";
    document.getElementsByClassName('G' + i)[0].innerHTML = "";
    document.getElementsByClassName('H' + i)[0].innerHTML = "";

    document.getElementsByClassName('A' + i)[1].innerHTML = "";
    document.getElementsByClassName('B' + i)[1].innerHTML = "";
    document.getElementsByClassName('C' + i)[1].innerHTML = "";
    document.getElementsByClassName('D' + i)[1].innerHTML = "";
    document.getElementsByClassName('E' + i)[1].innerHTML = "";
    document.getElementsByClassName('F' + i)[1].innerHTML = "";
    document.getElementsByClassName('G' + i)[1].innerHTML = "";
    document.getElementsByClassName('H' + i)[1].innerHTML = "";
  }
  boardConfig.value = blankBoardConfig;
}

function makeBoardJson() {
  let boardConfig: any = {}; // TODO: type this

  for (var i = 1; i <= 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (document.getElementsByClassName(files.value[j] + i)[0].innerHTML && !boardRotated.value) {
        boardConfig[files.value[j] + i] = (document.getElementsByClassName(files.value[j] + i)[0] as any).firstChild.getAttribute('type');
      }
      else if (document.getElementsByClassName(files.value[j] + i)[1].innerHTML && boardRotated) {
        boardConfig[files.value[j] + i] = (document.getElementsByClassName(files.value[j] + i)[1] as any).firstChild.getAttribute('type');
      }
    }
  }
}

function populateJsonBoard(bc = boardConfig.value) {
  clearBoard();
  for (var square in bc) {
    var pieceType = (bc as any)[square];
    document.getElementsByClassName(square)[0].innerHTML = '<img type="' + pieceType + '" class="chessPiece" src="' + (pieceMap.value as any)[pieceType] + '">';
    document.getElementsByClassName(square)[1].innerHTML = '<img type="' + pieceType + '" class="chessPiece" src="' + (pieceMap.value as any)[pieceType] + '">';
  }
}

function rotateBoard() {
  boardRotated.value = !boardRotated.value;
  populateJsonBoard(boardConfig.value);
}

function resetBoard() {
  selectedPiece.value = null;
  resetPiecePallet();
  makeBoardJson();
}

</script>

<style scoped>
* {
  background-color: #121212;
  color: white;
}


/* Elements */
.chess-board {
  display: block;
  width: 100vw;
}

img {
  width: 100%;
}

/* body {
  height: 100vh;
  background-color: #121212;
  color: white;
} */


/* nav * {
  background-color: lightgray;
  color: black;
  font-size: 1.25em;
  padding: 5px
} */

.chessPiece {
  position: relative;
  z-index: 2;
  background-color: inherit;
  height: 90%;
  width: 90%;
  margin-top: 5%;
  margin-left: 5%;
}

.piecePalletCell {
  background-color: lightgray;
  width: 12.5vw;
  height: 12.5vw;
  float: left;
  border: 2px solid gray;
  border-radius: 5px;
}

.piecePalletCell:hover {
  background-color: lightblue;
  width: 12.5vw;
  height: 12.5vw;
  float: left;
}

.palletContainer {
  margin-left: 12.5vw;
}

.boardButton {
  padding: 10px 0px;
}

.dropdown {
  background-color: #e8eaed;
  /* Light gray*/
  height: 40px;
  min-width: 100px;
  color: black;
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
</style>