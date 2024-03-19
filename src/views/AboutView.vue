<template>
  <div class="about">
    <a href="/">
      <button class="btn btn-sm btn-sucess col-xs-2  col-xs-offset-1 boardButton">Back to Board</button>
    </a>
    <a href="https://www.termsfeed.com/live/59a74f01-f082-4c03-9cb1-edc43708c42c" target="_blank">Privacy Policy</a>
    <br>
    <br>
    <br>
    <i>Pieces Drawn By jurgenwesterhof (adapted from work of Cburnett) - <a class="external free"
        href="http://commons.wikimedia.org/wiki/Template:SVG_chess_pieces">http://commons.wikimedia.org/wiki/Template:SVG_chess_pieces</a>,
      <a href="http://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC
        BY-SA 3.0</a>, <a
        href="https://commons.wikimedia.org/w/index.php?curid=35634436">https://commons.wikimedia.org/w/index.php?curid=35634436</a></i>
    <vue-markdown :source="src"></vue-markdown>
  </div>

</template>

<script lang="ts">
import VueMarkdown from 'vue-markdown-render'
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AboutView',
  components: {
    VueMarkdown
  },
  setup() {
    const src = ref(`
# Digital Chessboard
This is a digital representation of a chess board.  
There are no rules attached to the game so you can move however you want.  This opens up a lot of doors to different variations of the game.
This also allows you to augment the game of chess in anyway that you wish without the hassle of carrying a full board around.


Now here is how you can use the app:

# Local Play  
You can play locally with friends without an internet connection.  
Click the "Local Play" button and you will be brought to the game board.

Play chess normally or with a twist it is up to you.

# Saving / Loading Board Configurations  
Digital Chessboard has the ability to save custom configurations of the board and load them on demand.  

### _Saving_ -
To save a board configuration start a game and then click the lower menu button (This is the button that takes the place of the "Start Game" button)
You will see some new options appear (One is to save a board configuration) Click that one.
You will be prompted to supply a name.  After you supply a name then the current board configuration will be saved, and available to access at a later date.

PLEASE NOTE THE SAVED CONFIGURATIONS ARE TIED TO THE DEVICE'S LOCALSTORAGE SO IF YOU DELETE THE APP OR ITS DATA YOU WILL LOSE ALL OF YOUR CONFIGURATIONS!!!

### _Loading_ -
After you have saved a board configuration you can load it at any time by selecting the name of the configuration in the dropdown box, (this is the name you specified when saving) and clicking the "Load" button.
        
The board should load with that configuration.  (Note that you cannot undo this with the undo button so be careful)
        
# Todo:
### functionality:
- Different pieces (Checkers pieces)
- Ability to create your own chess board size
    
### Expansions:
- Cards that alter the way pieces move
    `)

    return {
      src,
    }
  }
})
</script>

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
