var game = (function() {

    var maxItems = 8;
    var pattern = [];
    var guesses = [];
    var currentGuess = [];

    var colors = {
        0: 'brown',
        1: 'pink',
        2: 'red',
        3: 'yellow',
        4: 'orange',
        5: 'gray',
        6: 'blue',
        7: 'green',
        8: 'black'
    }

    function choosePattern() {
        patternSet = new Set([]);
        while (patternSet.size < 4) {
            var patternItem = Math.floor(Math.random() * maxItems + 1);
            patternSet.add(patternItem);
        }
        pattern = Array.from(patternSet);
    }

    function updateColor() {
        var columns = document.getElementsByClassName('column');
        for (var i = 0; i < columns.length; i++) {
            cell = columns[i];
            color = colors[parseInt(cell.innerHTML)];
            cell.style = "color: " + colors[parseInt(cell.innerHTML)] + "; background-color: " + colors[parseInt(cell.innerHTML)] + ";"
        }
    }



    function updateGuessedDisplay() {
        if (currentGuess.length >= 1) {
            $('#guessed1').html(currentGuess[0]);
        } else {
            $('#guessed1').html('-');
        }
        if (currentGuess.length >= 2) {
            $('#guessed2').html(currentGuess[1]);
        } else {
            $('#guessed2').html('-');
        }
        if (currentGuess.length >= 3) {
            $('#guessed3').html(currentGuess[2]);
        } else {
            $('#guessed3').html('-');
        }
        if (currentGuess.length >= 4) {
            $('#guessed4').html(currentGuess[3]);
        } else {
            $('#guessed4').html('-');
        }
    }

    function guessPart(guessedNum) {
        if (!currentGuess.includes(guessedNum)) {
            currentGuess.push(guessedNum);
        }
        updateGuessedDisplay();
        updateColor();
    }

    function guessResult() {
        result = [];
        for (var i = 0; i < pattern.length; i++) {
            if (pattern[i] == currentGuess[i]) {
                result.push(2);
            } else if (currentGuess.includes(pattern[i])) {
                result.push(1);
            }
        }
        return result.sort();
    }

    function submitGuess() {
        if (currentGuess.length == 4) {
            guesses.push(currentGuess);
        }
        $('#row' + guesses.length).find('.col1').html(currentGuess[0]);
        $('#row' + guesses.length).find('.col2').html(currentGuess[1]);
        $('#row' + guesses.length).find('.col3').html(currentGuess[2]);
        $('#row' + guesses.length).find('.col4').html(currentGuess[3]);

        result = guessResult();

        if (result[0] == 2 && result[1] == 2 && result[2] == 2 && result[3] == 2) {
            $('#result').html("YOU WIN");
        } else {
            $('#row' + guesses.length).find('.result').html(result.toString());
        }

        currentGuess = [];
        updateGuessedDisplay();
        updateColor();
        if (guesses.length >= 12) {
            $('#result').html("YOU LOSE!");
        }

    }

    function removeGuessPart(removedPart) {
        currentGuess.splice(removedPart - 1, 1);
        updateGuessedDisplay();
        updateColor();
    }

    function setupButtons() {
        $('.guessBtn').click(function() {
            guessPart(parseInt(this.getAttribute("data-number")))
        });
        $('#submitGuess').click(function() {
            submitGuess()
        })
        $('.guessed').click(function() {
            removeGuessPart(parseInt(this.getAttribute("data-number")))
        })

    }

    function startGame() {
        updateColor();
        choosePattern();
        setupButtons();

    }

    function getPattern() {
        return pattern;
    }

    function setPattern(inputPattern) {
        if (inputPattern.length == 4) {
            pattern = inputPattern;
        } else {
            return false;
        }
    }

    return {
        start: startGame,
        pattern: getPattern,
        setPattern: setPattern
    }
})();

window.onload = function() {
    game.start();
}