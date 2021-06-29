import Ajax from "./ajax.js";

const numbers = ["one", "two", "three", "four", "five",
                "six", "seven", "eight", "nine"];

// Instantiate the options_board
var options;

// For debugging
var clicks = 0;
var current_board = "";
var solving = [];

// Helper functions - to ease coding
function id(id) {
    return document.getElementById(id);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}

// Main functions
function clear_previous_board() {
    // Access all the tiles
    var tiles = qsa(".tile");

    // Remove all the tile's values
    tiles.forEach((x) => x.remove());
}

function generate_board(board, null_char) {

    clear_previous_board();

    // Used to increment tile ids
    for (let i = 0; i < 81; i++) {

        // Create new div element
        let tile = document.createElement("div");

        // name the tile
        tile.id = i;
        tile.classList.add("tile");

        // cell is defined as a number
        if (board[i] !== null_char) {
            tile.textContent = board[i];
        }

        // the cell's value is undetermined
        else {
            // so that the options can be shown by the css
            tile.classList.add("uncertain");

            // prepare all possible options (1 through 9)
            for (let number = 0; number < 9; number++) {
                const option_number = document.createElement("p");
                option_number.textContent = number + 1;
                option_number.classList.add(numbers[number]);
                option_number.classList.add("hidden");

                tile.appendChild(option_number);
            }
        }

        // completes the grid
        if ((i > 17 && i < 27) || (i > 44 && i < 54))
            tile.classList.add("bottomBorder");
        if ((i + 1) % 9 === 3 || (i + 1) % 9 === 6)
            tile.classList.add("rightBorder");

        id("board").appendChild(tile);
    }
}

function startGame() {
    // update stats
    console.log(++clicks);

    console.log("Start");

    // get the sudoku from the user
    let input_text = id("sudoku-string").value;
    let null_char = id("null-character").value;

    // check if string might be ok
    if (input_text.length === 81) {

        console.log("Acceptable length of sudoku-string");

        // prepare request
        const isValidRequest = {
            "task": "isValid",
            "sudoku_string": input_text
        }

        // send request
        const answer = Ajax.query(isValidRequest);
        console.log("Request: " + JSON.stringify(isValidRequest));

        answer.then(function (answer_obj) {
            console.log("Response: " + JSON.stringify(answer_obj));

            // if there are no blatant sudoku impossibilites, 
            // display the board and buttons
            if (answer_obj.answer) {

                console.log("Seemingly solvable sudoku");

                // create board
                generate_board(input_text, null_char);

                // show buttons
                id("solving-options").classList.remove("hidden");

                // replace the null_charcaters with 0s
                let new_string = "";
                for (let index = 0; index < input_text.length; index++) {
                    if (input_text[index] === null_char) new_string += "0";
                    else new_string += input_text[index];
                }

                // updating storage
                current_board = new_string;

                // get options as a 9x9 array
                const firstRequest = {
                    "task": "get_board",
                    "sudoku_string": new_string
                }

                const template = Ajax.query(firstRequest);
                console.log("Request: " + JSON.stringify(firstRequest));

                template.then(function (object) {
                    console.log("Response: " + JSON.stringify(object));
                    options = object.options;
                })
            }
            else {
                confirm("Please enter a valid unsolved sudoku");
            }
        });

    }
    else {
        confirm(`Please enter a string of 81 digits not ${input_text.length}`);
    }
}

// Originally, so that users can enter the sudoku
// by changing the values on the board (this function used read the board)
// but it is more efficient to copy/paste a 81 char string
function getSudokuString() {
    let newArray = [];
    let options = [];

    // add the cell's values into the newArray
    qsa(".tile").forEach((x) => newArray.push(x.textContent));

    // organize the array into a nested array (options)
    for (let row = 0; row < 9; row++) {
        let temp = []
        for (let col = 0; col < 9; col++) {
            let value = newArray[row + col]
            if (value === "") temp.push(0);
            else temp.push(JSON.parse(value));
        }
        options.push(temp);
    }
    return options;
}

// adds options to the board
function add_options(index, options) {
    // gets cell element
    let cell = id(index);

    for (let number = 1; number < 10; number++) {
        let value = cell.getElementsByClassName(numbers[number - 1])[0];
        if (!value.classList.contains("hidden")) {
            if (!options.includes(number)) value.classList.add("hidden");
        }
        else {
            if (options.includes(number)) value.classList.remove("hidden");
        }
    }
}

// Solving functions
function update_board(bool) {
    // only true for show_all function call
    // the difference is turning options and array of numbers and empty arrays
    // into an array of numbers and non-empty arrays
    if (bool){
        const request = {
            "task": "exhaustive_options",
            "options": options
        };

        const template = Ajax.query(request);
        console.log("Request: " + JSON.stringify(request));

        template.then(function (object) {
            console.log("Response: " + JSON.stringify(object));
            options = object.options;
            let tempArray = [];
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    let value = options[row][col];
                    tempArray.push(JSON.stringify(value));
                }
            }
            for (let i = 0; i < 81; i++) {
                let value = tempArray[i];
                if (Array.isArray(JSON.parse(value))) {
                    add_options(i, value);
                }
                else {
                    id(i).textContent = value;
                    if (id(i).classList.contains("uncertain"))
                        id(i).classList.remove("uncertain");
                }
            }
        })
    } else {
        let tempArray = [];
        // get the 9x9 array into a 81 length array
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                let value = options[row][col];
                tempArray.push(JSON.stringify(value));
            }
        }
        // iterate through temp array and change the board
        for (let i = 0; i < 81; i++) {
            let value = tempArray[i];
            // show the possibilites
            if (Array.isArray(JSON.parse(value))) {
                add_options(i, value);
            }
            // hide the possibilites and change the value of the cell
            else {
                id(i).textContent = value;
                if (id(i).classList.contains("uncertain"))
                    id(i).classList.remove("uncertain");
            }
        }
    }
}

function show_all(){
    solving.push("show_all()");
    update_board(true);
}

function singleOption() {
    // update stats
    solving.push("singleOption()");
    console.log(++clicks);

    // prepare request
    const request = {
        "task": "single_option",
        "options": options
    };

    const template = Ajax.query(request);
    console.log("Request: " + JSON.stringify(request));

    template.then(function (object) {
        console.log("Response: " + JSON.stringify(object));

        // if the function actually changed something, change the onscreen board
        if (JSON.stringify(options) != JSON.stringify(object.options)){
            options = object.options;
            update_board(false);
        }
    });
}

function obviousPairs() {
    // update stats
    solving.push("obviousPairs()");
    console.log(++clicks);

    const request = {
        "task": "obviousPairs",
        "options": options
    };

    const template = Ajax.query(request);
    console.log("Request: " + JSON.stringify(request));

    template.then(function (object) {
        console.log("Response: " + JSON.stringify(object));
        if (JSON.stringify(options) != JSON.stringify(object.options)){
            options = object.options;
            update_board(false);
        }
    });

}

function obviousTriplets() {
    // update stats
    solving.push("obviousTriplets()");
    console.log(++clicks);

    const request = {
        "task": "obviousTriplets",
        "options": options
    };

    const template = Ajax.query(request);
    console.log("Request: " + JSON.stringify(request));

    template.then(function (object) {
        console.log("Response: " + JSON.stringify(object));
        if (JSON.stringify(options) != JSON.stringify(object.options)){
            options = object.options;
            update_board(false);
        }
    });
}

function nakedPairs() {
    // update stats
    solving.push("nakedPairs()");
    console.log(++clicks);

    const request = {
        "task": "nakedPairs",
        "options": options
    };

    const template = Ajax.query(request);
    console.log("Request: " + JSON.stringify(request));

    template.then(function (object) {
        console.log("Response: " + JSON.stringify(object));
        if (JSON.stringify(options) != JSON.stringify(object.options)){
            options = object.options;
            update_board(false);
        }
    });

}

function nakedTriplets() {
    // update stats
    solving.push("nakedTriplets()");
    console.log(++clicks);

    const request = {
        "task": "nakedTriplets",
        "options": options
    };

    const template = Ajax.query(request);
    console.log("Request: " + JSON.stringify(request));

    template.then(function (object) {
        console.log("Response: " + JSON.stringify(object));
        if (JSON.stringify(options) != JSON.stringify(object.options)){
            options = object.options;
            update_board(false);
        }
    });
}

function removeFromLine() {
    // update stats
    solving.push("removeFromLine()");
    console.log(++clicks);

    console.log("options: "+JSON.stringify(options));


    const request = {
        "task": "removeFromLine",
        "options": options
    };
    const template = Ajax.query(request);
    console.log("Request: " + JSON.stringify(request));

    template.then(function (object) {
        console.log("Response: " + JSON.stringify(object));
        if (JSON.stringify(options) != JSON.stringify(object.options)){
            options = object.options;
            update_board(false);
        }
    });
}

// Get the button elements
const start_button = id("start-btn");
const option_0 = id("option-0");
const option_1 = id("option-1");
const option_2 = id("option-2");
const option_3 = id("option-3");
const option_4 = id("option-4");
const option_5 = id("option-5");
const option_6 = id("option-6");

// Equivalent of .onclick = function ()
// (idk why that doesnt seem to work for me but this does)
window.onload = function () {
    start_button.addEventListener("click", startGame);
    option_0.addEventListener("click", show_all);
    option_1.addEventListener("click", singleOption);
    option_2.addEventListener("click", obviousPairs);
    option_3.addEventListener("click", obviousTriplets);
    option_4.addEventListener("click", nakedPairs);
    option_5.addEventListener("click", nakedTriplets);
    option_6.addEventListener("click", removeFromLine);
}