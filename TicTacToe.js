let emptyRooms = []

function GetEmptyRooms() {
    return emptyRooms
}

class TicTacToeGame {
    constructor (playerOne) {
        this.state = "waitingForPlayer"
        this.playerOne = playerOne
        this.playerTwo = undefined
        this.startTurn = 1
        this.turn = "X"
        this.gameBoard = [
            "", "", "",
            "", "", "",
            "", "", ""
        ]
        emptyRooms.push(this)
        this.updateState()
    }
    handleWin() {
        switch(this.startTurn) {
            case 1:
                this.startTurn = 2
                break;
            case 2:
                this.startTurn = 1
        }
        this.turn = "X"
        this.gameBoard = [
            "", "", "",
            "", "", "",
            "", "", ""
        ]
        setTimeout(() => {
            switch(this.NumPlayers) {
                case 1:
                    this.state = "waitingForPlayer"
                    this.updateState()
                    break
                case 2:
                    this.state = "play"
                    this.updateState()
                    this.updatePlayingAs()
            }
        }, 5000)
    }
    updatePlayingAs() {
        switch(this.startTurn) {
            case 1:
                this.playerOne.emit("updatePlayingAs", "X")
                this.playerTwo.emit("updatePlayingAs", "O")
                break
            case 2:
                this.playerOne.emit("updatePlayingAs", "O")
                this.playerTwo.emit("updatePlayingAs", "X")
        }
    }
    updateState() {
        let playerOneState = ""
        let playerTwoState = ""
        switch(this.state) {
            case "playerOneWin":
                playerOneState = "win"
                playerTwoState = "lose"
                break
            case "playerTwoWin":
                playerOneState = "lose"
                playerTwoState = "win"
                break
            default:
                playerOneState = this.state
                playerTwoState = this.state
                break
        }
        if (this.playerOne != undefined) {
            this.playerOne.emit("stateChange", playerOneState)
        }
        if (this.playerTwo != undefined) {
            this.playerTwo.emit("stateChange", playerTwoState)
        }
    }
    addPlayer(socket) {
        if (this.playerOne == undefined) {
            this.playerOne = socket
        }
        else if (this.playerTwo == undefined) {
            this.playerTwo = socket
        }
        if (this.NumPlayers == 2) {
            if (emptyRooms.indexOf(this) != -1) {
                emptyRooms.splice(emptyRooms.indexOf(this), 1)
            }
            if (this.state == "waitingForPlayer") {
                this.state = "play"
            }
            this.updateState()
            this.updatePlayingAs()
        }
        else {
            this.state = "waitingForPlayer"
            if (emptyRooms.indexOf(this) == -1) {
                emptyRooms.push(this)
            }
        }
    }
    removePlayer(socket) {
        if (this.playerOne == socket) {
            this.playerOne = undefined
        }
        else if (this.playerTwo == socket) {
            this.playerTwo = undefined
        }
        if (this.NumPlayers == 1) {
            if (emptyRooms.indexOf(this) == -1) {
                emptyRooms.push(this)
            }
            if (this.state == "play") {
                if (this.playerOne != undefined) {
                    this.state = "playerOneWin"
                }
                else if (this.playerTwo != undefined) {
                    this.state = "playerTwoWin"
                }
                this.handleWin()
            }
            else {
                this.state = "waitingForPlayer"
            }
            this.updateState()
            return 1
        }
        else {
            if (emptyRooms.indexOf(this) != -1) {
                emptyRooms.splice(emptyRooms.indexOf(this), 1)
            }
            return 0
        }
    }
    playerMakeMove(socket, move) {
        if (this.state != "play") {
            return
        }
        let playerNum = 0
        if (this.playerOne == socket) {
            playerNum = 1
        }
        else {
            playerNum = 2
        }
        
        let moveTurn = ""
        if (this.startTurn == playerNum) {
            moveTurn = "X"
        }
        else {
            moveTurn = "O"
        }
        if (moveTurn == this.turn) {
            if (this.gameBoard[move] != "") {
                return
            }
            this.gameBoard[move] = moveTurn
            const id = String(move)
            let data = {
                "id": id,
                "move": moveTurn
            }
            this.playerOne.emit("move", data)
            this.playerTwo.emit("move", data)
            switch(move) {
                case 0:
                case 8:
                    if (this.gameBoard[4] == moveTurn && this.gameBoard[0] == moveTurn && this.gameBoard[8] == moveTurn) {
                        switch(playerNum) {
                            case 1:
                                this.state = "playerOneWin"
                                break
                            case 2:
                                this.state = "playerTwoWin"
                        }
                        this.updateState()
                        this.handleWin()
                    }
                    break
                case 2:
                case 6:
                    if (this.gameBoard[2] == moveTurn && this.gameBoard[4] == moveTurn && this.gameBoard[6] == moveTurn) {
                        switch(playerNum) {
                            case 1:
                                this.state = "playerOneWin"
                                break
                            case 2:
                                this.state = "playerTwoWin"
                        }
                        this.updateState()
                        this.handleWin()
                    }
                    break
                case 4:
                    if (this.gameBoard[2] == moveTurn && this.gameBoard[4] == moveTurn && this.gameBoard[6] == moveTurn || this.gameBoard[4] == moveTurn && this.gameBoard[0] == moveTurn && this.gameBoard[8] == moveTurn) {
                        switch(playerNum) {
                            case 1:
                                this.state = "playerOneWin"
                                break
                            case 2:
                                this.state = "playerTwoWin"
                        }
                        this.updateState()
                        this.handleWin()
                    }
                    break
            }
            if (this.state != "play") {
                return
            }
            if (move < 3) {
                if (this.gameBoard[0] == moveTurn && this.gameBoard[1] == moveTurn && this.gameBoard[2] == moveTurn) {
                    switch(playerNum) {
                        case 1:
                            this.state = "playerOneWin"
                            break
                        case 2:
                            this.state = "playerTwoWin"
                    }
                    this.updateState()
                    this.handleWin()
                    return
                }
            }
            else if (move < 6) {
                if (this.gameBoard[3] == moveTurn && this.gameBoard[4] == moveTurn && this.gameBoard[5] == moveTurn) {
                    switch(playerNum) {
                        case 1:
                            this.state = "playerOneWin"
                            break
                        case 2:
                            this.state = "playerTwoWin"
                    }
                    this.updateState()
                    this.handleWin()
                    return
                }
            }
            else {
                if (this.gameBoard[6] == moveTurn && this.gameBoard[7] == moveTurn && this.gameBoard[8] == moveTurn) {
                    switch(playerNum) {
                        case 1:
                            this.state = "playerOneWin"
                            break
                        case 2:
                            this.state = "playerTwoWin"
                    }
                    this.updateState()
                    this.handleWin()
                    return
                }
            }
            
            if (this.gameBoard[0] == moveTurn && this.gameBoard[3] == moveTurn && this.gameBoard[6] == moveTurn) {
                switch(playerNum) {
                    case 1:
                        this.state = "playerOneWin"
                        break
                    case 2:
                        this.state = "playerTwoWin"
                }
                this.updateState()
                this.handleWin()
                return
            }
            if (this.gameBoard[1] == moveTurn && this.gameBoard[4] == moveTurn && this.gameBoard[7] == moveTurn) {
                switch(playerNum) {
                    case 1:
                        this.state = "playerOneWin"
                        break
                    case 2:
                        this.state = "playerTwoWin"
                }
                this.updateState()
                this.handleWin()
                return
            }
            if (this.gameBoard[2] == moveTurn && this.gameBoard[5] == moveTurn && this.gameBoard[8] == moveTurn) {
                switch(playerNum) {
                    case 1:
                        this.state = "playerOneWin"
                        break
                    case 2:
                        this.state = "playerTwoWin"
                }
                this.updateState()
                this.handleWin()
                return
            }

            if (this.GameBoard.indexOf("") == -1) {
                this.state = "tie"
                this.updateState()
                this.handleWin()
                return
            }
            
            switch(this.turn) {
                case "X":
                    this.turn = "O"
                    break
                case "O":
                    this.turn = "X"
                    break
            }
        }
    }

    get GameBoard() {
        return this.gameBoard
    }

    get NumPlayers() {
        let numPlayers = 0
        if (this.playerOne != undefined) {
            numPlayers += 1
        }
        if (this.playerTwo != undefined) {
            numPlayers += 1
        }
        return numPlayers
    }
}

module.exports = {"TicTacToeGame": TicTacToeGame, "GetEmptyRooms": GetEmptyRooms}