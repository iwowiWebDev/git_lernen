window.onload = () => {
    showBoardInHTML();
    setMode(true);
};


class Square {
    row: number;
    col: number;

    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}

class Board {
    gameBoard: Array<any>;

    constructor(board) {
        this.gameBoard = board;
    }

    makeMove(square: Square, char: string): boolean {
        if(char === 'X' || char === 'O'){
            if(this.gameBoard[square.row][square.col] != ' ') {
                return false;
            } else {
                this.gameBoard[square.row][square.col] = char;
                return true;
            }
        } else {
            console.log("Char is not X or O");
            return false;
        }

    }

    getWinner(): string {
        if(this.isGameWon('X')) {
            return 'X';
        } else if (this.isGameWon('O')) {
            return 'O';
        } else {
            return ' ';
        }
    }

    isGameWon(char: string): boolean {
        // horizontal
        for(let i=0; i<this.gameBoard.length; i++) {
            if(this.gameBoard[i][0] == char && this.gameBoard[i][1] == char && this.gameBoard[i][2] == char) {
                return true;
            }
        }

        // vertical
        for(let i=0; i<this.gameBoard.length; i++) {
            if(this.gameBoard[0][i] == char && this.gameBoard[1][i] == char && this.gameBoard[2][i] == char) {
                return true;
            }
        }

        // diagonal
        if(this.gameBoard[0][0] == char && this.gameBoard[1][1] == char && this.gameBoard[2][2] == char) {
            return true;
        }

        return this.gameBoard[0][2] == char && this.gameBoard[1][1] == char && this.gameBoard[2][0] == char;

    }

    getAllPossibleSquares(): Square[] {
        let moves = [];
        this.gameBoard.forEach((item, i) => {
            item.forEach((item, j) => {
                if(item == ' ') {
                    moves.push(new Square(i, j));
                }
            });
        });

        return moves;
    }

    getGameBoard(): Array<any> {
        return this.gameBoard;
    }

    getValue(char: string): number {
        let winner: string = this.getWinner();
        if(winner === char){
            return 100;
        } else if (winner === ' ') {
            return 0;
        } else {
            return -100;
        }
    }

    isFull(): boolean {
        let isFull: boolean = true;
        this.gameBoard.forEach((item, i) => {
            item.forEach((item, i) => {
                if(item == ' '){
                    isFull = false;
                }
            });
        });

        return isFull;
    }

    isEmpty(): boolean{
        return this.gameBoard.every(function(cell) {
            return cell == ' ';
        });
    }

}

class Player {
    char: string;
    
    constructor(char) {
        this.char = char;
    }

    getChar(): string {
        return this.char;
    }

    calculateTurn(board: Board, maxDepth: number): Square {
        // return the best square
        console.log("Calculating the best turn of player " + this.char + " and maxDepth " + maxDepth);
        let bestVal = -100;
        let move;

        board.getAllPossibleSquares().forEach((item, i) => {
            //console.log("We are in turn " + i);
            //console.log(JSON.stringify(item));
            let arr = copyArray(board.getGameBoard());
            let childBoard = new Board(arr);
            childBoard.makeMove(item, this.char);

            let nodeVal = this.minimax(childBoard, false, 1, maxDepth, this.char == 'X' ? 'O' : 'X');

            //console.log("Resulting board would be:");
            //console.log(childBoard.getGameBoard());
            //console.log("Value of: " + nodeVal);

            if(nodeVal > bestVal) {
                bestVal = nodeVal;
                move = item;
                console.log("Best move: " + JSON.stringify(move) + " with value: " + bestVal);
            }

        });

        return move;
    }

    minimax(board: Board, isMaximizing: boolean, depth: number, maxDepth: number, char: string): number {
        if(depth == maxDepth || board.isFull() || board.getWinner() != ' ') {
            if(board.isFull()){
                //console.log("Board is full:");
                //console.log(board.getGameBoard());
            }
            //console.log("Leaving minimax of player " + char + " and depth " + depth);
            let val = board.getValue(this.char);
            if(val == 100) {
                val = 100 - depth;
            } else if (val == -100) {
                val = -100 + depth;
            } else {
                val = 0;
            }
            return val;
        }

        if (isMaximizing) {
            let bestVal = -100;

            board.getAllPossibleSquares().forEach((item, i) => {
                let arr = copyArray(board.getGameBoard());
                let childBoard = new Board(arr);
                childBoard.makeMove(item, char);

                let nodeVal = this.minimax(childBoard, false, depth+1, maxDepth, char == 'X' ? 'O' : 'X');

                if(nodeVal > bestVal) {
                    bestVal = nodeVal;
                    //move = item;
                }

            });

            return bestVal;

        } else {

            let bestVal = 100;

            board.getAllPossibleSquares().forEach((item, i) => {
                let arr = copyArray(board.getGameBoard());
                let childBoard = new Board(arr);
                childBoard.makeMove(item, char);

                let nodeVal = this.minimax(childBoard, true, depth+1, maxDepth, char == 'X' ? 'O' : 'X');

                if(nodeVal < bestVal) {
                    bestVal = nodeVal;
                    //move = item;
                }

            });

            return bestVal;
        }
    }

}


// --------------- VARIABLES -----------------
let darkModeOn: boolean = false;
let maxDepth: number;
const humanPlayer: Player = new Player('O');
const aiPlayer: Player = new Player('X');
const players: Player[] = [humanPlayer, aiPlayer];
var board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
];
var boardObj: Board = new Board(board);

// ---------------- GAME FUNCTIONS --------------
/**
 * When clicked on "Spiel starten", board is reseted, maxDepth is set and onClicks are inserted
 */
async function startGame() {
    board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];
    boardObj = new Board(board);

    let difficultyForm: any = document.querySelector('input[name="difficulty"]:checked');

    maxDepth = difficultyForm.value;

    document.getElementById("end-message").innerHTML = "Du bist am Zug";
    showBoardInHTML();

    // humanPlayer always starts
    insertOnClicks();

}

/**
 * Human player clicks on square. Move is validated and AI-Player makes his turn
 * @param row row of board
 * @param col column of board
 */
function makeClick(row, col) {
    console.log("Human player makes move on row " + row + " and col " + col);
    boardObj.makeMove(new Square(row, col), humanPlayer.getChar());
    showBoardInHTML();
    removeOnClicks();

    if(checkIfGameEnded()){
        return;
    }

    document.getElementById("end-message").innerHTML = "KI-Spieler am Zug";

    let boardCopy = copyArray(boardObj.getGameBoard());
    let b = new Board(boardCopy);

    let square = players[1].calculateTurn(b, maxDepth);
    console.log("AI Player makes move on row " + square.row + " and column " + square.col);

    boardObj.makeMove(square, players[1].getChar());

    showBoardInHTML();

    if(checkIfGameEnded()){
        return;
    }

    insertOnClicks();


}

/**
 * Insert onClicks on the cells of the game-table.
 */
function insertOnClicks(): void{
    document.getElementById("end-message").innerHTML = "Du bist am Zug";

    let table: HTMLTableElement = <HTMLTableElement> document.getElementById('container');
    let rows = table.rows;


    let freeSquares = boardObj.getAllPossibleSquares();
    freeSquares.forEach(function (item, index){
        rows[item.row].cells[item.col].onclick = function() {
            makeClick(item.row, item.col);
        }
    });

}

/**
 * Remove onClicks of the cells of the game-table after human made a turn
 */
function removeOnClicks(): void{
    let table: HTMLTableElement = <HTMLTableElement> document.getElementById('container');
    let rows = table.rows;
    for(let i=0; i<rows.length; i++){
        for(let j=0; j<rows[i].cells.length; j++){
            rows[i].cells[j].onclick = null;
        }
    }
}

/**
 * Checks if game ended and set an end-message.
 */
function checkIfGameEnded(): boolean {
    if(boardObj.getWinner() != ' '){
        console.log("Player " + boardObj.getWinner() + " has won.");
        document.getElementById("end-message").innerHTML = "Das Spiel ist vorbei. " +
            "Spieler " + boardObj.getWinner() + " hat gewonnen.";
        removeOnClicks();
        return true;
    }
    if(boardObj.isFull()){
        console.log("Draw.");
        document.getElementById("end-message").innerHTML = "Das Spiel endet unentschieden.";
        return true;
    }
}


// ---------------- HELP FUNCTIONS ---------------
function copyArray(arr: Array<any>): Array<any>{
    let copy = [];

    arr.forEach((item, i) => {
        copy[i] = [...item];
    });

    return copy;
}

function sleep(ms): Promise<any> {
    // @ts-ignore
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showBoardInHTML(): void {

    let table: HTMLTableElement = <HTMLTableElement> document.getElementById('container');
    let rows = table.rows;
    for(let i=0; i<rows.length; i++){
        for(let j=0; j<rows[i].cells.length; j++){
            rows[i].cells[j].innerHTML = boardObj.getGameBoard()[i][j];
        }
    }
}

function toggleMode(): void {
    let r: any = document.querySelector(':root');

    if(darkModeOn) {
        darkModeOn = false;
        r.style.setProperty('--text-color', 'black');
        r.style.setProperty('--body-bg-color', 'white');
    } else {
        darkModeOn = true;
        r.style.setProperty('--text-color', 'white');
        r.style.setProperty('--body-bg-color', '#121212');
    }
}

function setMode(dark: boolean) {
    let r: any = document.querySelector(':root');

    if(dark) {
        darkModeOn = true;
        r.style.setProperty('--text-color', 'white');
        r.style.setProperty('--body-bg-color', '#121212');

    } else {
        darkModeOn = false;
        r.style.setProperty('--text-color', 'black');
        r.style.setProperty('--body-bg-color', 'white');
    }
}
