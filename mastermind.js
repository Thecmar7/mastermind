var game = (function() {

    var maxItems = 8;
    var pattern = [];
    var guesses = [];
    var currentGuess = [0, 0, 0, 0];
    var selected = 0;

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

    function setSelected(num) {
        selected = num;
    }


    /**
     * choosePattern
     *
     * Chooses a pattern at the start of the game
     */
    function choosePattern() {
        patternSet = new Set([]);
        while (patternSet.size < 4) {
            var patternItem = Math.floor(Math.random() * maxItems + 1);
            patternSet.add(patternItem);
        }
        pattern = Array.from(patternSet);
    }

    /**
     * updateColor
     * 
     * Sets all the numbers to be the correct color based on the color object above
     */
    function updateColor() {
        var columns = document.getElementsByClassName('column');
        for (var i = 0; i < columns.length; i++) {
            cell = columns[i];
            color = colors[parseInt(cell.innerHTML)];
            cell.style = "color: " + colors[parseInt(cell.innerHTML)] + "; background-color: " + colors[parseInt(cell.innerHTML)] + ";"
        }
    }

    /**
     * updateDisplay
     * 
     * Sets all the numbers to be the correct color based on the color object above
     * and sets all the 0s to dashes
     */
    function updateDisplay() {
        var columns = document.getElementsByClassName('column');
        for (var i = 0; i < columns.length; i++) {
            cell = columns[i];
            if (cell.innerHTML == 0) {
                cell.innerHTML = "-";
            }
            color = colors[parseInt(cell.innerHTML)];
            if (cell.id == ('guessed' + selected)) {
                cell.style = "color: " + colors[parseInt(cell.innerHTML)] + "; background-color: " +
                    colors[parseInt(cell.innerHTML)] + "; border: lightgray solid 3px;"
            } else if (cell.innerHTML == '-') {
                cell.style = "border:1px solid grey;";
            } else {
                cell.style = "color: " + colors[parseInt(cell.innerHTML)] + "; background-color: " + colors[parseInt(cell.innerHTML)] + ";"
            }
        }
    }

    /**
     *  updateGuessedDisplay
     *
     * changed the 4 guess buttons to  the current guess array
     */
    function updateGuessedDisplay() {
        $('#guessed0').html(currentGuess[0]);
        $('#guessed1').html(currentGuess[1]);
        $('#guessed2').html(currentGuess[2]);
        $('#guessed3').html(currentGuess[3]);
        updateDisplay();
    }

    function moveSelected() {
        var moveBy = 1;
        if (!currentGuess.includes(0)) {
            moveBy = 0;
        } else {
            if (selected != 3 && currentGuess[selected + 1] == 0) {
                moveBy = 1;
            } else if (selected != 0 && currentGuess[selected - 1] == 0) {
                moveBy = -1;
            }
        }
        if (currentGuess[selected + moveBy] != 0) {
            moveBy = 0;
        }
        setSelected(selected + moveBy);
    }

    /**
     * guessPart
     *
     * @param {*} guessedNum
     */
    function guessPart(guessedNum) {
        if (!currentGuess.includes(guessedNum)) {
            currentGuess[selected] = guessedNum;
            moveSelected();
        } else {
            var swap = currentGuess[currentGuess.indexOf(guessedNum)];
            currentGuess[currentGuess.indexOf(guessedNum)] = currentGuess[selected];
            currentGuess[selected] = swap;
        }
        updateGuessedDisplay();
        updateDisplay();
    }


    /**
     * guessResult
     *
     * returns an array of 1s and 2s according the current guess as compared to 
     * to the pattern
     * 
     * @returns {Array}
     */
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

    /**
     * submitGuess
     * 
     * compares the current guess to the chosen pattern and sets up the 
     */
    function submitGuess() {
        if (!currentGuess.includes(0)) {
            guesses.push(currentGuess);

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

            currentGuess = [0, 0, 0, 0];
            updateGuessedDisplay();
            setSelected(0);
            updateDisplay();
            if (guesses.length >= 12) {
                $('#result').html("YOU LOSE!");
            }

        }
    }


    /**
     * selectGuessSection
     *
     * @param {*} number
     * @param {*} elementSelected
     */
    function selectGuessSection(number, elementSelected) {
        setSelected(number);
        updateDisplay();
    }

    /**
     * setupButtons
     *
     * Sets all the button inputs
     */
    function setupButtons() {
        $('.guessBtn').click(function() {
            guessPart(parseInt(this.getAttribute("data-number")))
        });
        $('#submitGuess').click(function() {
            submitGuess()
        })
        $('.guessed').click(function() {
            var selectedGuessedBtnNum = parseInt(this.getAttribute("data-number"));
            selectGuessSection(selectedGuessedBtnNum, this);
        })
    }

    /**
     * startGame
     *
     * starts the game
     */
    function startGame() {
        updateDisplay();
        choosePattern();
        setupButtons();

    }

    /**
     * getPattern
     *
     * returns the pattern of the game
     * 
     * @returns {Array} pattern
     */
    function getPattern() {
        return pattern;
    }


    /**
     * setPattern
     * 
     * allows for an array of 4 to be set as the pattern of the game
     * 
     * @param {Array} inputPattern
     */
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