var ROWS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
var COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

function checkPuzzle(puzzleToCheck, solutionPuzzle) {
    for (var location in solutionPuzzle) {
        if (solutionPuzzle[location] != puzzleToCheck[location]) {
            return false;
        }
    }
    return true;
}

function checkRow(r, c, grid, n) {
    for (var i = 0; i < 9; i++) {
        if ((i != c) && (grid[r][i] == n)) {
            return false;
        }
    }
    return true;
}

function checkColumn(r, c, grid, n) {
    for (var i = 0; i < 9; i++) {
        if ((i != r) && (grid[i][c] == n)) {
            return false;
        }
    }
    return true;
}

function checkSquare(r, c, grid, n) {
    var startRow = (Math.floor(r / 3)) * 3;
    var startCol = (Math.floor(c / 3)) * 3;
    var endRow = startRow + 3;
    var endCol = startCol + 3;

    for (var i = startRow; i < endRow; i++) {
        for (var j = startCol; j < endCol; j++) {
            if (grid[i][j] == n) {
                if ((i == r)) {
                    if (!(j == c)) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
    }
    return true;
}

function isNumValid(r, c, grid, n) {
    if (checkRow(r, c, grid, n) &&
        checkColumn(r, c, grid, n) &&
        checkSquare(r, c, grid, n)) {
        return true;
    } else {
        return false;
    }
}

function checkIfBoardComplete(boardState) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if ((boardState[i][j] == 0)) {
                return false;
            }
        }
    }
    return true;
}

function randNum() {
    return (Math.ceil(Math.random() * 9));
}

function createPuzzleGrid(puzzle) {
    var puzzleGrid = Array.from({
        length: 9
    }, () => new Array(9).fill(0));

    for (var location in puzzle) {
        var row = location.substring(1, 2) - 1;
        var col = location.substring(0, 1);

        puzzleGrid[row][window.COLS.indexOf(col)] = parseInt(puzzle[location]);
    }
    return puzzleGrid;
}

function solvePuzzle(puzzle) {
    var puzzleGrid = createPuzzleGrid(puzzle);
    puzzleSolverHelper(puzzleGrid);
    var solutionPuzzle = {};

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            solutionPuzzle[window.COLS[j] + window.ROWS[i]] = puzzleGrid[i][j];
        }
    }
    return solutionPuzzle;
}

function puzzleSolverHelper(puzzleToSolve) {
    var currRow;
    var currCol;
    var endSearch = false;
    for (var i = 0; i < 9 && endSearch === false; i++) {
        for (var j = 0; j < 9 && endSearch === false; j++) {
            currRow = i;
            currCol = j;
            if (puzzleToSolve[i][j] == 0) {
                for (var k = 1; k < 10; k++) {
                    if (isNumValid(i, j, puzzleToSolve, k)) {
                        puzzleToSolve[i][j] = k;
                        if (checkIfBoardComplete(puzzleToSolve)) {
                            return true;
                        } else {
                            if (puzzleSolverHelper(puzzleToSolve)) {
                                return true;
                            }
                        }
                    }

                }
                endSearch = true;
            }
        }
    }
    puzzleToSolve[currRow][currCol] = 0;
}