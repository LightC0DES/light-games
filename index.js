const { exception } = require('console');
const ticTacToeModule = require("./TicTacToe")
const TicTacToeGame = ticTacToeModule.TicTacToeGame
const express = require('express')
const {readFile, readFileSync, writeFile, writeFileSync} = require('fs');
const socketio = require('socket.io')

const port = process.env.PORT || 3000

const app = express();

function err500() {
    const html = readFileSync('./html/err500.html', 'utf8')
    return html
}

app.get("/tictactoeServiceWorker.js", (request, response) => {
    console.log("sent file!")
    response.sendFile(__dirname + '/public/scripts/tictactoeServiceWorker.js', {'headers': {'Service-Worker-Allow': '/tic-tac-toe', 'type': 'text/javascript'}})
})

app.get('/', (request, response) => {
    readFile('./html/index.html', 'utf8', (err, html) =>{
        if (err) {
            response.status(500).send(err500())
        }
        else
        {
            response.send(html);
        }
    })
});

app.get('/tic-tac-toe/', (request, response) => {
    readFile('./html/tictactoe.html', 'utf8', (err, html) =>{
        if (err) {
            response.status(500).send(err500())
        }
        else
        {
            response.send(html);
        }
    })
})

const server = app.listen(port, function() {
    console.log("App available on http://localhost:"+port)
    console.log("TicTacToe available on http://localhost:"+port+"/tic-tac-toe")
})

const serverSocket = socketio(server)

serverSocket.on('connection', function(socket) {
    socket.on('ticTacToeConnection', function() {
        let room = undefined
        const emptyRooms = ticTacToeModule.GetEmptyRooms()
        if (emptyRooms[0] != undefined) {
            console.log("joining room!")
            room = emptyRooms[0]
            room.addPlayer(socket)
        }
        else {
            console.log("creating room!")
            room = new TicTacToeGame(socket)
        }
        delete emptyRooms
        socket.on("move", function(move) {
            room.playerMakeMove(socket, move)
        })
        socket.on("disconnect", function() {
            room.removePlayer(socket)
            delete room
        })
    })
})

app.use(express.static('public'));