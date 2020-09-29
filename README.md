### Known Issues:
- Fast disconnects break the game, no idea what to do about it.

#### Solved Issues:
- Issue: Reloading breaks the game, again no real idea what to do.

  Solution: Checked if 'playingAs' and 'turn' exist before removing them from the document.

- Issue: The index.js file is too large!

  Solution: Moved the TicTacToeGame class to TicTacToe.js