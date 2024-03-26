<template>
  <div class="chess-board">
    <div class="board">
      <div v-for="(rank, rankIndex) of ranks" :key="rankIndex">
        <div class="row" :class="rank">
          <div v-for="(file, fileIndex) of files" :key="file">
            <div @click="select($event)"
              :class="((fileIndex + rankIndex) % 2 == 0) ? ('white ' + file + '' + (8 - rankIndex)) : ('black ' + file + '' + (8 - rankIndex))">
            </div>
          </div>
        </div>
      </div>
    </div>

    <br>

    <hr>

    <div class="row">
      <button class="btn btn-lg btn-warning col-xs-2 boardButton undo" @click="undo()">Undo</button>
      <button class="btn btn-lg btn-success col-xs-4 col-xs-offset-1 boardButton start-game"
        v-show="showStart && !gameStarted" @click="resetGame(false); toggleStart()">Start Game</button>


      <button id="gameMenu" class="btn btn-lg btn-default col-xs-4 col-xs-offset-1 boardButton menu"
        @click="toggleGameMenu($event)">
        {{ showGameMenu ? 'Hide Menu' : 'Show Menu' }}
        <i class="fa fa-bars" aria-hidden="true"></i>
      </button>
    </div>

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

    <div v-show="showGameMenu">
      <div class="row">
        <hr>
        <button class="btn btn-lg btn-primary col-xs-4 col-xs-offset-1 boardButton piece-pallet"
          @click="togglePiecePallet()">
          {{ showPiecePallet ? 'Hide Piece Pallet' : 'Show Piece Pallet' }}</button>
      </div>
      <div class="row">
        <button class="btn btn-sm btn-success col-xs-3 boardButton save" @click="saveCurrentConfig()">
          Save Board</button>

        <select class="col-xs-3 col-xs-offset-1 dropdown" v-model="LoadThisBoardConfig">
          <option value="" disabled selected>Select Config</option>
          <option v-for="(config, i) of savedConfigs" :key="i" :value="config">{{ config.name }}</option>
        </select>

        <button class="btn btn-sm btn-warning col-xs-2 boardButton load" @click="loadBoardConfig();">Load</button>
        <button class="btn btn-sm btn-warning col-xs-2 boardButton delete" :disabled="!LoadThisBoardConfig"
          @click="deleteBoardConfig();">Delete</button>

        <button class="btn btn-sm btn-danger col-xs-2  col-xs-offset-1 boardButton reset" v-show="gameStarted"
          @click="resetGame();">Reset Board</button>
      </div>
      <button class="btn btn-sm col-xs-2  col-xs-offset-1 boardButton" @click="goToAboutPage();">About Page</button>
    </div>

    <hr>


  </div>
</template>


<script setup lang="ts">
import router from '@/router';
import { onMounted, ref, type Ref } from 'vue';

const gameStarted = ref(false);
const LoadThisBoardConfig: Ref<BoardConfigType> = ref({} as BoardConfigType);
const ranks = ref([1, 2, 3, 4, 5, 6, 7, 8]); // Columns
const files = ref(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']); // Row
const newLocation = ref();

const baseImgPath = '/img';

const whitePalletCells: Ref<{ type: string, image: string }[]> = ref([
  { 'type': 'White-Pawn', 'image': `${baseImgPath}/whitePawn.svg` },
  { 'type': 'White-Rook', 'image': `${baseImgPath}/whiteRook.svg` },
  { 'type': 'White-Knight', 'image': `${baseImgPath}/whiteKnight.svg` },
  { 'type': 'White-Bishop', 'image': `${baseImgPath}/whiteBishop.svg` },
  { 'type': 'White-King', 'image': `${baseImgPath}/whiteKing.svg` },
  { 'type': 'White-Queen', 'image': `${baseImgPath}/whiteQueen.svg` }]
);
const blackPalletCells: Ref<{ type: string, image: string }[]> = ref([
  { 'type': 'Black-Pawn', 'image': `${baseImgPath}/blackPawn.svg` },
  { 'type': 'Black-Rook', 'image': `${baseImgPath}/blackRook.svg` },
  { 'type': 'Black-Knight', 'image': `${baseImgPath}/blackKnight.svg` },
  { 'type': 'Black-Bishop', 'image': `${baseImgPath}/blackBishop.svg` },
  { 'type': 'Black-King', 'image': `${baseImgPath}/blackKing.svg` },
  { 'type': 'Black-Queen', 'image': `${baseImgPath}/blackQueen.svg` }]);

// Map the piece types to there respective images
const pieceMap = ref({
  "White-Pawn": `${baseImgPath}/whitePawn.svg`,
  "White-Knight": `${baseImgPath}/whiteKnight.svg`,
  "White-Bishop": `${baseImgPath}/whiteBishop.svg`,
  "White-Rook": `${baseImgPath}/whiteRook.svg`,
  "White-King": `${baseImgPath}/whiteKing.svg`,
  "White-Queen": `${baseImgPath}/whiteQueen.svg`,

  "Black-Pawn": `${baseImgPath}/blackPawn.svg`,
  "Black-Knight": `${baseImgPath}/blackKnight.svg`,
  "Black-Bishop": `${baseImgPath}/blackBishop.svg`,
  "Black-Rook": `${baseImgPath}/blackRook.svg`,
  "Black-King": `${baseImgPath}/blackKing.svg`,
  "Black-Queen": `${baseImgPath}/blackQueen.svg`
});

const moveStack: Ref<any[]> = ref([]); // TODO: type this
const showStart = ref(true);
let showPiecePallet = ref(false);

const startingBoardConfig: BoardLayoutType = {
  "A1": "White-Rook", "A2": "White-Pawn", "A3": "", "A4": "", "A5": "", "A6": "", "A7": "Black-Pawn", "A8": "Black-Rook",
  "B1": "White-Knight", "B2": "White-Pawn", "B3": "", "B4": "", "B5": "", "B6": "", "B7": "Black-Pawn", "B8": "Black-Knight",
  "C1": "White-Bishop", "C2": "White-Pawn", "C3": "", "C4": "", "C5": "", "C6": "", "C7": "Black-Pawn", "C8": "Black-Bishop",
  "D1": "White-Queen", "D2": "White-Pawn", "D3": "", "D4": "", "D5": "", "D6": "", "D7": "Black-Pawn", "D8": "Black-Queen",
  "E1": "White-King", "E2": "White-Pawn", "E3": "", "E4": "", "E5": "", "E6": "", "E7": "Black-Pawn", "E8": "Black-King",
  "F1": "White-Bishop", "F2": "White-Pawn", "F3": "", "F4": "", "F5": "", "F6": "", "F7": "Black-Pawn", "F8": "Black-Bishop",
  "G1": "White-Knight", "G2": "White-Pawn", "G3": "", "G4": "", "G5": "", "G6": "", "G7": "Black-Pawn", "G8": "Black-Knight",
  "H1": "White-Rook", "H2": "White-Pawn", "H3": "", "H4": "", "H5": "", "H6": "", "H7": "Black-Pawn", "H8": "Black-Rook"
}

const checkersConfig: BoardConfigType =
{
  "name": "Checkers",
  "config": {
    "A1": "White-Pawn", "A2": "", "A3": "White-Pawn", "A4": "", "A5": "", "A6": "", "A7": "Black-Pawn", "A8": "",
    "B1": "", "B2": "White-Pawn", "B3": "", "B4": "", "B5": "", "B6": "Black-Pawn", "B7": "", "B8": "Black-Pawn",
    "C1": "White-Pawn", "C2": "", "C3": "White-Pawn", "C4": "", "C5": "", "C6": "", "C7": "Black-Pawn", "C8": "",
    "D1": "", "D2": "White-Pawn", "D3": "", "D4": "", "D5": "", "D6": "Black-Pawn", "D7": "", "D8": "Black-Pawn",
    "E1": "White-Pawn", "E2": "", "E3": "White-Pawn", "E4": "", "E5": "", "E6": "", "E7": "Black-Pawn", "E8": "",
    "F1": "", "F2": "White-Pawn", "F3": "", "F4": "", "F5": "", "F6": "Black-Pawn", "F7": "", "F8": "Black-Pawn",
    "G1": "White-Pawn", "G2": "", "G3": "White-Pawn", "G4": "", "G5": "", "G6": "", "G7": "Black-Pawn", "G8": "",
    "H1": "", "H2": "White-Pawn", "H3": "", "H4": "", "H5": "", "H6": "", "H7": "", "H8": "Black-Pawn"
  }
};


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
type BoardLayoutType = {
  "A1": string, "A2": string, "A3": string, "A4": string, "A5": string, "A6": string, "A7": string, "A8": string,
  "B1": string, "B2": string, "B3": string, "B4": string, "B5": string, "B6": string, "B7": string, "B8": string,
  "C1": string, "C2": string, "C3": string, "C4": string, "C5": string, "C6": string, "C7": string, "C8": string,
  "D1": string, "D2": string, "D3": string, "D4": string, "D5": string, "D6": string, "D7": string, "D8": string,
  "E1": string, "E2": string, "E3": string, "E4": string, "E5": string, "E6": string, "E7": string, "E8": string,
  "F1": string, "F2": string, "F3": string, "F4": string, "F5": string, "F6": string, "F7": string, "F8": string,
  "G1": string, "G2": string, "G3": string, "G4": string, "G5": string, "G6": string, "G7": string, "G8": string,
  "H1": string, "H2": string, "H3": string, "H4": string, "H5": string, "H6": string, "H7": string, "H8": string
};

type BoardConfigType = {
  name: string,
  config: BoardLayoutType,
};

const savedConfigs: Ref<BoardConfigType[]> = ref([]);

const boardConfig: Ref<BoardLayoutType> = ref(startingBoardConfig);
const showGameMenu = ref(false);

onMounted(() => {
  LoadStartingConfigurations();
});

function LoadStartingConfigurations() {
  if (savedConfigs.value.length === 0) {
    savedConfigs.value.push(checkersConfig);
    window.localStorage.savedBoardConfig = JSON.stringify(savedConfigs.value);
  }
}

function goToAboutPage() {
  router.replace({ path: '/about' })
}



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
  if (!name) {
    return;
  }
  var savedBoards = [];
  if (window.localStorage.savedBoardConfig != null) {
    savedBoards = JSON.parse(window.localStorage.savedBoardConfig);
    for (const c of savedBoards) {
      if (name === c.name) {
        alert(`Name: ${name} alrady exists, try again with a unique name`);
        return;
      }
    }
  }

  makeBoardJson();
  var configObject: BoardConfigType = {
    "name": name,
    "config": boardConfig.value
  }
  savedBoards.push(configObject);
  window.localStorage.savedBoardConfig = JSON.stringify(savedBoards);
  savedConfigs.value.push(configObject);
}

function loadBoardConfig() {
  var config = LoadThisBoardConfig.value;
  if (!config || !config.name) {
    return;
  }
  if (confirm("Are you sure you want to load the following Board Configuration: " + config.name)) {
    populateJsonBoard(config.config);
  }
}

function deleteBoardConfig() {
  var config = LoadThisBoardConfig.value;
  if (!config || !config.name) {
    return;
  }
  if (confirm("Are you sure you want to delete the following Board Configuration: " + config.name)) {
    const savedConfigs = JSON.parse(window.localStorage.savedBoardConfig) as [];
    const newConfigs: BoardConfigType[] = savedConfigs.filter((c: BoardConfigType) => c.name !== config.name);
    window.localStorage.savedBoardConfig = JSON.stringify(newConfigs);
  }
}

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
        clearSelection();
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
      e.target.className = e.target.className + ' selected';
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
      clearSelection();
      selectedPiece.value = null;
    }
  }
}

function clearSelection() {
  const elements = document.getElementsByClassName('selected');
  for (const e of elements) {
    e.classList.remove('selected');
  }
}

function move(oldLocation: any) {
  newLocation.value.appendChild(selectedPiece.value);
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
  var move = moveStack.value.pop();

  move.newLocation.removeChild(move.movedPiece);
  if (move.capturedPiece != null) {
    move.newLocation.appendChild(move.capturedPiece);
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
  }
  boardConfig.value = { ...blankBoardConfig };
}

function makeBoardJson() {
  boardConfig.value = { ...blankBoardConfig };
  for (var i = 1; i <= 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (document.getElementsByClassName(files.value[j] + i)[0].innerHTML) {
        (boardConfig.value as any)[files.value[j] + i] = (document.getElementsByClassName(files.value[j] + i)[0] as any).firstChild.getAttribute('type');
      }
    }
  }
}

function populateJsonBoard(bc = boardConfig.value) {
  clearBoard();
  for (var square in bc) {
    var pieceType = (bc as any)[square];
    if (pieceType) {
      document.getElementsByClassName(square)[0].innerHTML = '<img type="' + pieceType + '" class="chessPiece" src="' + (pieceMap.value as any)[pieceType] + '">';
    }
  }
}

function resetBoard() {
  selectedPiece.value = null;
  resetPiecePallet();
  clearSelection();
  makeBoardJson();
}

</script>




<style>
.chess-board {
  display: block;
  width: 100vw;
  margin-top: 60px;
}

.chessPiece {
  position: relative;
  z-index: 2;
  background-color: inherit;
  height: 100%;
  width: 100%;
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
  min-height: 25vw;
  margin: 10px 12vw;
}

.boardButton {
  padding: 15px 10px;
  border-radius: 15px;
  margin: 5px;
  font-size: 1.25rem;
  font-weight: bold;

  &.undo {
    color: black;
    /* background-color: hsl(0, 29%, 85%);
    color: hsl(0, 41%, 20%); */
  }

  &.piece-pallet {
    background-color: hsl(239, 41%, 85%);
    color: hsl(239, 41%, 20%);
  }

  &.start-game {
    background-color: hsl(119, 41%, 85%);
    color: hsl(119, 41%, 20%);
  }

  &.menu {
    color: black;
    /* background-color: hsl(119, 41%, 85%);
    color: hsl(119, 41%, 20%); */
  }

  &.save {
    background-color: hsl(119, 41%, 85%);
    color: hsl(119, 41%, 20%);
  }

  &.load {
    color: black;
    /* background-color: hsl(119, 41%, 85%);
    color: hsl(119, 41%, 20%); */
  }

  &.reset {
    background-color: hsl(0, 29%, 85%);
    color: hsl(0, 41%, 20%);
  }
}

.dropdown {
  background-color: #e8eaed;
  height: 50px;
  min-width: 100px;
  border-radius: 10px;
  padding: 10px;
  font-size: 1.25rem;
}

.white {
  background-color: white;
  color: black;
  width: 12.5vw;
  height: 12.5vw;
  float: left;
  border-bottom: 1px solid hsl(25 76% 16% / 1);
  box-shadow: inset 0px 4px 6px 0px hsl(25 76% 75% / 1);
}

.white:hover {
  background-color: lightblue;
  width: 12.5vw;
  height: 12.5vw;
  float: left;
}

.black {
  background-color: saddlebrown;
  width: 12.5vw;
  height: 12.5vw;
  float: left;
  border-bottom: 1px solid hsl(25 76% 16% / 1);
  box-shadow: -1px 0px 20px -5px hsl(25 76% 20% / 1);
}

.black:hover {
  background-color: lightblue;
  width: 12.5vw;
  height: 12.5vw;
  float: left;
}

.selected {
  background-color: hsl(195 53% 42% / 1);
}
</style>
