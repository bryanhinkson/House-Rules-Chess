<template>
  <div class="about">
    <h1>Digital Chessboard</h1>
    <section>
      <p>This is a digital representation of a chess board.
        There are no rules attached to the game so you can move however you want. This opens up a lot of doors to
        different variations of the game.
        This also allows you to augment the game of chess in anyway that you wish without the hassle of carrying a board
        around.
      </p>
      <a href="/">
        <button class="btn btn-sm btn-sucess col-xs-2  col-xs-offset-1 boardButton">Back to Board</button>
      </a>
      <a href="https://www.termsfeed.com/live/59a74f01-f082-4c03-9cb1-edc43708c42c" target="_blank">Privacy Policy</a>
    </section>

    <hr>

    <section>
      <h2> How To play </h2>
      <p>At its heart, this is just a chessboard so you can play however you want.</p>

      <h3>Piece Pallet</h3>
      <p>The piece pallet is really the heart of the game. This allows you to place any piece on any point on the board. Say you want to play with all queens. Go for it!</p>
      <p>To place a piece simply select it by tapping on it, then tap on the board where you would like it to go. 
        In this way you can place any peices that you would like on the board. Even duplicate pieces.
      </p>

      <hr>
      <h3> Saving / Loading Board Configurations</h3>
      Digital Chessboard has the ability to save custom configurations of the board and load them on demand.

      <h4>Saving</h4>
      <p>You might like to play our own variation of chess that doesn't follow conventional rules.
        Maybe you want to play with someone who doesn't have as much experience so you want to replace all of their
        pawns with rook, bishops, or queens... go ahead.
      </p>

      <p>If you save a board configuration you don't have to set up the board each time you want to play a variation.
        You can simply load the configuration and off you go.</p>

      <p>To save a board configuration start a game and then click the "Show Menu" button
        You will see some new options appear (One is to save a board configuration) Click that one.
        You will be prompted to supply a name. After you supply a name then the current board configuration (Whatever
        you have on the board) will be saved, and available to access later.
      </p>

      <p>These names must be unique and you will be told if there are conflicts.</p>

      <p class="shout-out">PLEASE NOTE: Saved configurations are tied to your device so if you delete the app or its
        data you will lose your configurations permanently!
      </p>

      <h4>Loading</h4>
      <p>After you have saved a board configuration you can load it at any time by selecting the name of the
        configuration
        in the dropdown, (this is the name you specified when saving) and clicking the "Load" button.
        The board should load with that configuration. (Note that you cannot undo this with the undo button so be
        careful).
      </p>

      <h4>Deleting configurations</h4>
      <p>You can also delete configurations if you no longer need them.
        (For example, maybe you just saved it midgame so you can finish it up later).
        You can delete unwanted configurations by selecting it in the dropdown and clicking the "Delete" button.
      </p>
    </section>

    <hr>

    <section>
      <h2>FAQ</h2>
      <p>Q: How do I remove a piece from the board?</p>
      <p>A: This can be done by selecting the piece you want to remove and then clicking on any piece in the piece
        pallet.</p>
    </section>

    <hr>

    <section>
      <h2>What's Next?</h2>
      See the project board <a
        href="https://woozy-polonium-9e0.notion.site/9bec03a501e645eda0de02c50c55b4aa?v=dbba093a8983461fa31f49d7746588cc&pvs=4"
        target="_blank">Here</a>
    </section>

    <hr>

    <section>
      <h2>Acknowledgements</h2>
      <i>Pieces Drawn By jurgenwesterhof (adapted from work of Cburnett) - <a class="external free"
          href="http://commons.wikimedia.org/wiki/Template:SVG_chess_pieces">http://commons.wikimedia.org/wiki/Template:SVG_chess_pieces</a>,
        <a href="http://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC
          BY-SA 3.0</a>, <a
          href="https://commons.wikimedia.org/w/index.php?curid=35634436">https://commons.wikimedia.org/w/index.php?curid=35634436</a></i>
    </section>
  </div>

</template>

<style scoped>
hr {
  color: gray;
  width: 85vw;
  margin: 15px 0;
}

.about {
  padding: 60px 10vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

section {
  margin-top: 25px;
}

h1,h2,h3 {
  font-weight: bold;
}

h4 {
  margin-top: 10px;
  font-weight: bold;
}

p {
  margin-bottom: 10px;
}

.shout-out {
  background-color: hsl(0, 8%, 90%);
  padding: 15px;
  border-radius: 10px;
  font-weight: bold;
}
</style>
