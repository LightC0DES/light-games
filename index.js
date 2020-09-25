const { exception } = require('console');
const TicTacToeGame = require("./TicTacToe")
const express = require('express')
const {readFile, readFileSync, writeFile, writeFileSync} = require('fs');
const socketio = require('socket.io')
let emptyRooms = []

const port = process.env.PORT || 3000

const app = express();

app.use(express.static('public'));

function err500() {
    const html = readFileSync('./html/err500.html', 'utf8')
    return html
}

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
        if (emptyRooms[0] != undefined) {
            room = emptyRooms[0]
            room.addPlayer(socket)
        }
        else {
            room = new TicTacToeGame(socket, emptyRooms)
        }
        socket.on("move", function(move) {
            room.playerMakeMove(socket, move)
        })
        socket.on("disconnect", function() {
            room.removePlayer(socket)
            delete room
        })
    })
})
