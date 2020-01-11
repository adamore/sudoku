const cssCellPrefix = '#cell-';
const textColorForDisabled = 'white';
const textColorForValid = 'black';
const textColorForInvalid = 'white';
const backgroundColorForDisabled = 'grey';
const backgroundColorForValid = 'lightgreen';
const backgroundColorForInvalid = 'lightred';
const backgroundColorForEmpty = 'white';

var difficultyToIntMap = {
    'Very Easy': 2,
    'Easy': 5,
    'Medium': 10,
    'Hard': 15,
};

function writeToDOM(givenPuzzle, answerPuzzle) {
    for (var location in givenPuzzle) {
        disable(location, givenPuzzle);
    }
    if (answerPuzzle !== null) {
        for (var location in answerPuzzle) {
            if (!givenPuzzle.hasOwnProperty(location)) {
                valid(location, answerPuzzle);
            }
        }
    }
}

function disable(location, puzzle) {
    var obj = $(cssCellPrefix + location);
    obj.val(puzzle[location]);
    obj.prop('disabled', true);
    obj.css({
        'background-color': backgroundColorForDisabled,
        'color': textColorForDisabled
    });
}

function valid(location, puzzle) {
    var obj = $(cssCellPrefix + location);
    obj.val(puzzle[location]);
    obj.prop('disabled', false);
    obj.css({
        'background-color': backgroundColorForValid,
        'color': textColorForValid
    });
}

function invalid(location, puzzle) {
    $(cssCellPrefix + location).css({
        'background-color': backgroundColorForInvalid,
        'color': textColorForInvalid
    });
}

function clear(location) {
    var obj = $(cssCellPrefix + location);
    obj.prop('disabled', false);
    obj.val('');
    obj.css({
        'background-color': backgroundColorForEmpty,
        'color': textColorForValid
    });
}

function clearDOMPuzzle() {
    for (var r = 1; r <= 9; r++) {
        for (var c = 0; c < 9; c++) {
            clear(window.COLS[c] + r);
        }
    }
}

// DO THIS
function updateDOMWithCheckedPuzzle(invalidLocations, puzzle) {
    var solvedPuzzle = solvePuzzle(puzzle);
    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            var location = COLS[c] + ROWS[r];
            if (invalidLocations.has(location)) {
                invalid(location, puzzle);
            } else if (!(location in puzzle)) {
                valid(location, solvedPuzzle);
            }
        }
    }
}

function readPuzzleFromDOM() {
    var DOMPuzzle = {}
    for (var row = 0; row < 9; row++) {
        for (var col = 0; col < 9; col++) {
            var location = COLS[col] + ROWS[row];
            var obj = $(cssCellPrefix + location);
            DOMPuzzle[location] = obj.val();
        }
    }
    return DOMPuzzle;
}

function getInvalidLocations(DOMPuzzle, puzzle) {
    var solvedPuzzle = solvePuzzle(puzzle);
    var invalidCells = new Set()
    for (var location in solvedPuzzle) {
        if (DOMPuzzle[location] != solvedPuzzle[location]) {
            invalidCells.add(location);
        }
    }
    return invalidCells;
}

function createCookieJSON(DOMGrid, originalPuzzle) {
    var obj = {};
    var userInput = {};
    for (var location in DOMGrid) {
        if (!(location in originalPuzzle) && (DOMGrid[location] != '')) {
            userInput[location] = parseInt(DOMGrid[location]);
        }
    }
    obj['user'] = userInput;
    obj['puzzle'] = originalPuzzle;
    var JSONObj = JSON.stringify(obj);
    return JSONObj;
}

function setCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toGMTString();
    } else {
        expires = '';
    }
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + expires + '; path=/';
}

function getCookie(name) {
    var nameEQ = encodeURIComponent(name) + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function hasCookie(name) {
    return (getCookie(name) !== null);
}

function eraseCookie(name) {
    setCookie(name, '', -1);
}

function loadGameFromCookie() {
    var cookie = getCookie('game');
    var cookieContents = JSON.parse(cookie);
    var userInput = cookieContents['user'];
    var originalPuzzle = cookieContents['puzzle'];
    writeToDOM(originalPuzzle);
    for (var location in userInput) {
        var obj = $(cssCellPrefix + location);
        obj.val(userInput[location]);
    }
    return originalPuzzle;
}

function setNewCookie(DOMPuzzle, originalPuzzle) {
    if (hasCookie('game')) {
        eraseCookie('game');
    }
    var cookieObj = createCookieJSON(DOMPuzzle, originalPuzzle);
    setCookie('game', cookieObj, 2);
}

$(document).ready(function() {
    $('.cell').focusout(function() {
        if (!$.isNumeric($(this).val())) {
            $(this).val('');
        } else {
            if ($(this).val() > 9) {
                $(this).val('9');
            }
            if ($(this).val() < 1) {
                $(this).val('1');
            }
        }
    });

    $('#generate-button').bind('click', function() {
        clearDOMPuzzle();
        puzzle = generateGame(difficultyToIntMap[$('#difficulty').val()]);
        writeToDOM(puzzle);
    });

    $('#clear-button').bind('click', function() {
        clearDOMPuzzle();
        writeToDOM(puzzle);
        eraseCookie('game');
    });

    $('#solve-button').bind('click', function() {
        var solvedPuzzle = solvePuzzle(puzzle);
        writeToDOM(puzzle, solvedPuzzle);
        eraseCookie('game');
    });

    $('#check-button').bind('click', function() {
        var DOMPuzzle = readPuzzleFromDOM();
        var invalidLocations = getInvalidLocations(DOMPuzzle, puzzle);
        updateDOMWithCheckedPuzzle(invalidLocations, puzzle);
    });

    $('input').on('change paste keyup', function() {
        $(this).css({
            'background-color': backgroundColorForEmpty,
            'color': textColorForValid
        });
        setNewCookie(readPuzzleFromDOM(), puzzle, 2);
    });

    if (hasCookie('game')) {
        puzzle = loadGameFromCookie();
    } else {
        $('#generate-button').click();
    }
});