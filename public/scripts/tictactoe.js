const playHTML = `
<h2 id="playingAs"></h2>
<h2 id="turn">It's X's turn</h2>
<div class="topRow">
    <button id="0"><h1 class="ticTacToeHidden">.</h1></button>
    <button id="1"><h1 class="ticTacToeHidden">.</h1></button>
    <button id="2"><h1 class="ticTacToeHidden">.</h1></button>
</div>
<div class="middleRow">
    <button id="3"><h1 class="ticTacToeHidden">.</h1></button>
    <button id="4"><h1 class="ticTacToeHidden">.</h1></button>
    <button id="5"><h1 class="ticTacToeHidden">.</h1></button>
</div>
<div class="bottomRow">
    <button id="6"><h1 class="ticTacToeHidden">.</h1></button>
    <button id="7"><h1 class="ticTacToeHidden">.</h1></button>
    <button id="8"><h1 class="ticTacToeHidden">.</h1></button>
</div>
`

const centerTextHTML = `<h1 id="centerText">
Finding a room...
</h1>`

const socket = io.connect()

socket.emit("ticTacToeConnection")
document.getElementsByClassName("center")[0].innerHTML = centerTextHTML

socket.on("move", function(data) {
    let textClass = ""
    let turn = ""
    switch(data.move) {
        case "X":
            turn = "O"
            textClass = "ticTacToeX"
            break;
        case "O":
            turn = "X"
            textClass = "ticTacToeO"
    }
    element = document.getElementById("turn")
    if (element != undefined) {
        element.innerText = "It's " + turn + "'s turn" 
    }
    document.getElementById(data.id).innerHTML = "<h1 class='"+ textClass +"' >" + data.move + "</h1>"
})

socket.on("updatePlayingAs", function(playingAsWho) {
    element = document.getElementById("playingAs")
    if (element != undefined) {
        element.innerText = "You are playing as: " + playingAsWho
    }
})

function winState(stateText) {
    if (document.getElementById("playingAs") != undefined) {
        document.getElementById("playingAs").parentNode.removeChild(document.getElementById("playingAs"))
        document.getElementById("turn").parentNode.removeChild(document.getElementById("turn"))
    }
    document.getElementsByClassName("center")[0].innerHTML = centerTextHTML + document.getElementsByClassName("center")[0].innerHTML
    document.getElementById("centerText").innerText = stateText || "Undefined win text."
}

socket.on("stateChange", function(state) {
    if (document.getElementById("centerText") != undefined) {
        const element = document.getElementById("centerText")
        element.parentNode.removeChild(element)
    }
    switch (state) {
        case "win":
            winState("You won the game!")
            break
        case "lose":
            winState("You lost the game!")
            break
        case "play":
            document.getElementsByClassName("center")[0].innerHTML = ""
            document.getElementsByClassName("center")[0].innerHTML = playHTML
            const buttons = Array.from(document.getElementsByTagName("button"))
            buttons.forEach(element => {           
                element.addEventListener("click", function() {
                    socket.emit("move", Number.parseInt(element.id))
                })
            });
            break
        case "tie":
            winState("It's a tie!")
            break
        case "waitingForPlayer":
            document.getElementsByClassName("center")[0].innerHTML = ""
            document.getElementsByClassName("center")[0].innerHTML = centerTextHTML
            document.getElementById("centerText").innerText = "Waiting for second player!"
            break
    }
})

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("../tictactoeServiceWorker.js", {"scope": "../tic-tac-toe"}).then(registration => {
        console.log(registration.scope)
    }).catch((err) => {

    })
}