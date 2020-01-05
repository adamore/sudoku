const cssCellPrefix = '#cell-';
var difficultyToIntMap = {
    'Very Easy': 1,
    'Easy': 2,
    'Medium': 4,
    'Hard': 15,
};

function writeToDOM(givenPuzzle, answerPuzzle) {
    var colorForDisabled = 'grey';
    var colorForEnabled = 'lightgreen';

    for (var location in givenPuzzle) {
        $(cssCellPrefix + location).val(givenPuzzle[location]);
        $(cssCellPrefix + location).prop('disabled', true);
        $(cssCellPrefix + location).css({
            'background-color': colorForDisabled
        });
        $(cssCellPrefix + location).css({
            'color': 'white'
        });
    }
    if (answerPuzzle !== null) {
        for (var location in answerPuzzle) {
            if (!givenPuzzle.hasOwnProperty(location)) {
                $(cssCellPrefix + location).val(answerPuzzle[location]);
                $(cssCellPrefix + location).prop('disabled', false);
                $(cssCellPrefix + location).css({
                    'background-color': colorForEnabled
                });
                $(cssCellPrefix + location).css({
                    'color': 'black'
                });
            }
        }
    }
};

function clearDOMPuzzle() {
    for (var r = 1; r <= 9; r++) {
        for (var c = 0; c < 9; c++) {
            $(cssCellPrefix + window.COLS[c] + r).prop("disabled", false);
            $(cssCellPrefix + window.COLS[c] + r).val("");
            $(cssCellPrefix + window.COLS[c] + r).css({
                "background-color": "#f5ebeb"
            });
        }
    }
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


    $('#solve-button').bind('click', function() {
        var solvedPuzzle = solvePuzzle(puzzle);
        writeToDOM(puzzle, solvedPuzzle);
    });

    $('#check-button').bind('click', function() {

    });

    $('#generate-button').click();
});