const playHTML = `
<h2 id="playingAs"></h2>
<h2 id="turn">It's X's turn</h2>
<div class="topRow">
    <button id="0"><h3 class="ticTacToeHidden">.</h3></button>
    <button id="1"><h3 class="ticTacToeHidden">.</h3></button>
    <button id="2"><h3 class="ticTacToeHidden">.</h3></button>
</div>
<div class="middleRow">
    <button id="3"><h3 class="ticTacToeHidden">.</h3></button>
    <button id="4"><h3 class="ticTacToeHidden">.</h3></button>
    <button id="5"><h3 class="ticTacToeHidden">.</h3></button>
</div>
<div class="bottomRow">
    <button id="6"><h3 class="ticTacToeHidden">.</h3></button>
    <button id="7"><h3 class="ticTacToeHidden">.</h3></button>
    <button id="8"><h3 class="ticTacToeHidden">.</h3></button>
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
    document.getElementById(data.id).innerHTML = "<h3 class='"+ textClass +"' >" + data.move + "</h3>"
})

socket.on("updatePlayingAs", function(playingAsWho) {
    element = document.getElementById("playingAs")
    if (element != undefined) {
        element.innerText = "You are playing as: " + playingAsWho
    }
})

socket.on("stateChange", function(state) {
    switch (state) {
        case "win":
            document.getElementsByClassName("center")[0].innerHTML = ""
            document.getElementsByClassName("center")[0].innerHTML = centerTextHTML
            document.getElementById("centerText").innerText = "You won the game!"
            break
        case "lose":
            document.getElementsByClassName("center")[0].innerHTML = ""
            document.getElementsByClassName("center")[0].innerHTML = centerTextHTML
            document.getElementById("centerText").innerText = "You lost the game!"
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
            document.getElementsByClassName("center")[0].innerHTML = ""
            document.getElementsByClassName("center")[0].innerHTML = centerTextHTML
            document.getElementById("centerText").innerText = "It's a tie!"
            break
        case "waitingForPlayer":
            document.getElementsByClassName("center")[0].innerHTML = ""
            document.getElementsByClassName("center")[0].innerHTML = centerTextHTML
            document.getElementById("centerText").innerText = "Waiting for second player!"
            break
    }
})