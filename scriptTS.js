var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
window.onload = function () {
    showBoardInHTML();
    setMode(true);
};
var Square = /** @class */ (function () {
    function Square(row, col) {
        this.row = row;
        this.col = col;
    }
    return Square;
}());
var Board = /** @class */ (function () {
    function Board(board) {
        this.gameBoard = board;
    }
    Board.prototype.makeMove = function (square, char) {
        if (char === 'X' || char === 'O') {
            if (this.gameBoard[square.row][square.col] != ' ') {
                return false;
            }
            else {
                this.gameBoard[square.row][square.col] = char;
                return true;
            }
        }
        else {
            console.log("Char is not X or O");
            return false;
        }
    };
    Board.prototype.getWinner = function () {
        if (this.isGameWon('X')) {
            return 'X';
        }
        else if (this.isGameWon('O')) {
            return 'O';
        }
        else {
            return ' ';
        }
    };
    Board.prototype.isGameWon = function (char) {
        // horizontal
        for (var i = 0; i < this.gameBoard.length; i++) {
            if (this.gameBoard[i][0] == char && this.gameBoard[i][1] == char && this.gameBoard[i][2] == char) {
                return true;
            }
        }
        // vertical
        for (var i = 0; i < this.gameBoard.length; i++) {
            if (this.gameBoard[0][i] == char && this.gameBoard[1][i] == char && this.gameBoard[2][i] == char) {
                return true;
            }
        }
        // diagonal
        if (this.gameBoard[0][0] == char && this.gameBoard[1][1] == char && this.gameBoard[2][2] == char) {
            return true;
        }
        return this.gameBoard[0][2] == char && this.gameBoard[1][1] == char && this.gameBoard[2][0] == char;
    };
    Board.prototype.getAllPossibleSquares = function () {
        var moves = [];
        this.gameBoard.forEach(function (item, i) {
            item.forEach(function (item, j) {
                if (item == ' ') {
                    moves.push(new Square(i, j));
                }
            });
        });
        return moves;
    };
    Board.prototype.getGameBoard = function () {
        return this.gameBoard;
    };
    Board.prototype.getValue = function (char) {
        var winner = this.getWinner();
        if (winner === char) {
            return 100;
        }
        else if (winner === ' ') {
            return 0;
        }
        else {
            return -100;
        }
    };
    Board.prototype.isFull = function () {
        var isFull = true;
        this.gameBoard.forEach(function (item, i) {
            item.forEach(function (item, i) {
                if (item == ' ') {
                    isFull = false;
                }
            });
        });
        return isFull;
    };
    Board.prototype.isEmpty = function () {
        return this.gameBoard.every(function (cell) {
            return cell == ' ';
        });
    };
    return Board;
}());
var Player = /** @class */ (function () {
    function Player(char) {
        this.char = char;
    }
    Player.prototype.getChar = function () {
        return this.char;
    };
    Player.prototype.calculateTurn = function (board, maxDepth) {
        var _this = this;
        // return the best square
        console.log("Calculating the best turn of player " + this.char + " and maxDepth " + maxDepth);
        var bestVal = -100;
        var move;
        board.getAllPossibleSquares().forEach(function (item, i) {
            //console.log("We are in turn " + i);
            //console.log(JSON.stringify(item));
            var arr = copyArray(board.getGameBoard());
            var childBoard = new Board(arr);
            childBoard.makeMove(item, _this.char);
            var nodeVal = _this.minimax(childBoard, false, 1, maxDepth, _this.char == 'X' ? 'O' : 'X');
            //console.log("Resulting board would be:");
            //console.log(childBoard.getGameBoard());
            //console.log("Value of: " + nodeVal);
            if (nodeVal > bestVal) {
                bestVal = nodeVal;
                move = item;
                console.log("Best move: " + JSON.stringify(move) + " with value: " + bestVal);
            }
        });
        return move;
    };
    Player.prototype.minimax = function (board, isMaximizing, depth, maxDepth, char) {
        var _this = this;
        if (depth == maxDepth || board.isFull() || board.getWinner() != ' ') {
            if (board.isFull()) {
                //console.log("Board is full:");
                //console.log(board.getGameBoard());
            }
            //console.log("Leaving minimax of player " + char + " and depth " + depth);
            var val = board.getValue(this.char);
            if (val == 100) {
                val = 100 - depth;
            }
            else if (val == -100) {
                val = -100 + depth;
            }
            else {
                val = 0;
            }
            return val;
        }
        if (isMaximizing) {
            var bestVal_1 = -100;
            board.getAllPossibleSquares().forEach(function (item, i) {
                var arr = copyArray(board.getGameBoard());
                var childBoard = new Board(arr);
                childBoard.makeMove(item, char);
                var nodeVal = _this.minimax(childBoard, false, depth + 1, maxDepth, char == 'X' ? 'O' : 'X');
                if (nodeVal > bestVal_1) {
                    bestVal_1 = nodeVal;
                    //move = item;
                }
            });
            return bestVal_1;
        }
        else {
            var bestVal_2 = 100;
            board.getAllPossibleSquares().forEach(function (item, i) {
                var arr = copyArray(board.getGameBoard());
                var childBoard = new Board(arr);
                childBoard.makeMove(item, char);
                var nodeVal = _this.minimax(childBoard, true, depth + 1, maxDepth, char == 'X' ? 'O' : 'X');
                if (nodeVal < bestVal_2) {
                    bestVal_2 = nodeVal;
                    //move = item;
                }
            });
            return bestVal_2;
        }
    };
    return Player;
}());
// --------------- VARIABLES -----------------
var darkModeOn = false;
var maxDepth;
var humanPlayer = new Player('O');
var aiPlayer = new Player('X');
var players = [humanPlayer, aiPlayer];
var board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
];
var boardObj = new Board(board);
// ---------------- GAME FUNCTIONS --------------
/**
 * When clicked on "Spiel starten", board is reseted, maxDepth is set and onClicks are inserted
 */
function startGame() {
    return __awaiter(this, void 0, void 0, function () {
        var difficultyForm;
        return __generator(this, function (_a) {
            board = [
                [' ', ' ', ' '],
                [' ', ' ', ' '],
                [' ', ' ', ' ']
            ];
            boardObj = new Board(board);
            difficultyForm = document.querySelector('input[name="difficulty"]:checked');
            maxDepth = difficultyForm.value;
            document.getElementById("end-message").innerHTML = "Du bist am Zug";
            showBoardInHTML();
            // humanPlayer always starts
            insertOnClicks();
            return [2 /*return*/];
        });
    });
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
    if (checkIfGameEnded()) {
        return;
    }
    document.getElementById("end-message").innerHTML = "KI-Spieler am Zug";
    var boardCopy = copyArray(boardObj.getGameBoard());
    var b = new Board(boardCopy);
    var square = players[1].calculateTurn(b, maxDepth);
    console.log("AI Player makes move on row " + square.row + " and column " + square.col);
    boardObj.makeMove(square, players[1].getChar());
    showBoardInHTML();
    if (checkIfGameEnded()) {
        return;
    }
    insertOnClicks();
}
/**
 * Insert onClicks on the cells of the game-table.
 */
function insertOnClicks() {
    document.getElementById("end-message").innerHTML = "Du bist am Zug";
    var table = document.getElementById('container');
    var rows = table.rows;
    var freeSquares = boardObj.getAllPossibleSquares();
    freeSquares.forEach(function (item, index) {
        rows[item.row].cells[item.col].onclick = function () {
            makeClick(item.row, item.col);
        };
    });
}
/**
 * Remove onClicks of the cells of the game-table after human made a turn
 */
function removeOnClicks() {
    var table = document.getElementById('container');
    var rows = table.rows;
    for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < rows[i].cells.length; j++) {
            rows[i].cells[j].onclick = null;
        }
    }
}
/**
 * Checks if game ended and set an end-message.
 */
function checkIfGameEnded() {
    if (boardObj.getWinner() != ' ') {
        console.log("Player " + boardObj.getWinner() + " has won.");
        document.getElementById("end-message").innerHTML = "Das Spiel ist vorbei. " +
            "Spieler " + boardObj.getWinner() + " hat gewonnen.";
        removeOnClicks();
        return true;
    }
    if (boardObj.isFull()) {
        console.log("Draw.");
        document.getElementById("end-message").innerHTML = "Das Spiel endet unentschieden.";
        return true;
    }
}
// ---------------- HELP FUNCTIONS ---------------
function copyArray(arr) {
    var copy = [];
    arr.forEach(function (item, i) {
        copy[i] = __spreadArrays(item);
    });
    return copy;
}
function sleep(ms) {
    // @ts-ignore
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function showBoardInHTML() {
    var table = document.getElementById('container');
    var rows = table.rows;
    for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < rows[i].cells.length; j++) {
            rows[i].cells[j].innerHTML = boardObj.getGameBoard()[i][j];
        }
    }
}
function toggleMode() {
    var r = document.querySelector(':root');
    if (darkModeOn) {
        darkModeOn = false;
        r.style.setProperty('--text-color', 'black');
        r.style.setProperty('--body-bg-color', 'white');
    }
    else {
        darkModeOn = true;
        r.style.setProperty('--text-color', 'white');
        r.style.setProperty('--body-bg-color', '#121212');
    }
}
function setMode(dark) {
    var r = document.querySelector(':root');
    if (dark) {
        darkModeOn = true;
        r.style.setProperty('--text-color', 'white');
        r.style.setProperty('--body-bg-color', '#121212');
    }
    else {
        darkModeOn = false;
        r.style.setProperty('--text-color', 'black');
        r.style.setProperty('--body-bg-color', 'white');
    }
}
