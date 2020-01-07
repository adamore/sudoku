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

function shuffledArray() {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var length = 9;
    var tempVal;
    var randIndex;
    while (length != 0) {
        randIndex = Math.floor(Math.random() * length);
        length -= 1;
        tempValue = numbers[length];
        numbers[length] = numbers[randIndex];
        numbers[randIndex] = tempValue;
    }
    return numbers;
}

function fillGrid(grid) {
    var r;
    var c;
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            r = row;
            c = col;
            var numbers = shuffledArray();
            if (grid[row][col] == 0) {
                var numbers = shuffledArray();
                for (var k = 0; k < 9; k++) {
                    var num = numbers[k];
                    if (isNumValid(row, col, grid, num)) {
                        grid[row][col] = num;
                        if (checkIfBoardComplete(grid)) {
                            return true;
                        } else {
                            if (fillGrid(grid)) {
                                return true;


                            }
                        }

                    }
                }
                row = 10;
                break;
            }
        }
    }
    grid[r][c] = 0;
}

function copyGrid(grid) {
    var copiedGrid = [];
    for (var r = 0; r < 9; r++) {
        var copiedRow = [];
        for (var c = 0; c < 9; c++) {
            copiedRow.push(grid[r][c]);
        }
        copiedGrid.push(copiedRow);
    }
    return copiedGrid;
}

function generateGame(attempts) {
    var gameGrid = Array.from({
        length: 9
    }, () => new Array(9).fill(0));
    fillGrid(gameGrid);
    while (attempts > 0) {
        var row, col;
        do {
            row = randNum() - 1;
            col = randNum() - 1;
        } while (gameGrid[row][col] == 0);


        var value = gameGrid[row][col];
        gameGrid[row][col] = 0;

        var copiedGrid = copyGrid(gameGrid);

        if (!hasSingleSolution(copiedGrid, [0])) {
            gameGrid[row][col] = value;
            attempts -= 1;
        }
    }

    var puzzleObj = {};
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (gameGrid[i][j] != 0) {
                puzzleObj[window.COLS[j] + window.ROWS[i]] = gameGrid[i][j];
            }
        }
    }
    return puzzleObj;

}

function hasSingleSolution(puzzleToSolve, numSolutionsFoundSoFar) {
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
                            numSolutionsFoundSoFar[0] += 1;
                            break;
                        } else {
                            hasSingleSolution(puzzleToSolve, numSolutionsFoundSoFar);
                            if (numSolutionsFoundSoFar[0] > 1) return false;
                        }
                    }
                }
                endSearch = true;
            }
        }
    }
    puzzleToSolve[currRow][currCol] = 0;
    return numSolutionsFoundSoFar[0] == 1;
}


function isGameValid(grid) {
    if (!checkIfBoardComplete(grid)) {
        return false;
    }
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            if (!(isNumValid(row, col, grid, grid[row][col]))) {
                return false;
            }
        }
    }
    return true;
}