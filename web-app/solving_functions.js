const help = Object.create(null);

let options = [];

let ones = { "hor": [], "vert": [] };
let twos = { "hor": [], "vert": [] };
let threes = { "hor": [], "vert": [] };
let fours = { "hor": [], "vert": [] };
let fives = { "hor": [], "vert": [] };
let sixes = { "hor": [], "vert": [] };
let sevens = { "hor": [], "vert": [] };
let eights = { "hor": [], "vert": [] };
let nines = { "hor": [], "vert": [] };

let r0 = [];
let r1 = [];
let r2 = [];
let r3 = [];
let r4 = [];
let r5 = [];
let r6 = [];
let r7 = [];
let r8 = [];

let c0 = [];
let c1 = [];
let c2 = [];
let c3 = [];
let c4 = [];
let c5 = [];
let c6 = [];
let c7 = [];
let c8 = [];

let boxes = {
    "a": [],
    "b": [],
    "c": [],
    "d": [],
    "e": [],
    "f": [],
    "g": [],
    "h": [],
    "i": []
};

const quadrants = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
let progress_total = 0;
let progress_percentage = 0;

// prints out the board replacing options with 0
help.view_board = function() {
    let returnedString = "";

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let cell = options[row][col];
            if (Array.isArray(cell)) {
                returnedString += "0"
            }
            else {
                returnedString += cell.toString();
            }

            if ((col + 1) % 3 == 0 && col != 8) {
                returnedString += " | ";
            }
            else {
                returnedString += "  ";
            }
        }
        if ((row + 1) % 3 == 0 && row != 8) {
            returnedString += "\n--------|---------|--------\n";
        }
        else {
            returnedString += "\n";
        }
    }
    console.log(returnedString);
}

// for debugging
// prints out options board
help.view_options_board = function() {
    let returnedString = "";

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            returnedString += options[row][col].toString();
            if ((col + 1) % 3 == 0 && col != 8) {
                returnedString += " | ";
            }
            else {
                returnedString += "  ";
            }
        }
        if ((row + 1) % 3 == 0 && row != 8) {
            returnedString += "\n--------|---------|--------\n";
        }
        else {
            returnedString += "\n";
        }
    }
    console.log(returnedString);
}

//using coords, returns quadrant
help.coords_to_quadrant = function(row, col) {

    if ([0, 1, 2].includes(row) && [0, 1, 2].includes(col)) return "a";
    if ([0, 1, 2].includes(row) && [3, 4, 5].includes(col)) return "b";
    if ([0, 1, 2].includes(row) && [6, 7, 8].includes(col)) return "c";
    if ([3, 4, 5].includes(row) && [0, 1, 2].includes(col)) return "d";
    if ([3, 4, 5].includes(row) && [3, 4, 5].includes(col)) return "e";
    if ([3, 4, 5].includes(row) && [6, 7, 8].includes(col)) return "f";
    if ([6, 7, 8].includes(row) && [0, 1, 2].includes(col)) return "g";
    if ([6, 7, 8].includes(row) && [3, 4, 5].includes(col)) return "h";
    if ([6, 7, 8].includes(row) && [6, 7, 8].includes(col)) return "i";

}

// adds the numbers into the dictionary of current numbers
// fills rows and cols
help.fill_numbers = function() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let value = options[row][col];
            if (value === 0) {
                options[row][col] = [];
            }
            else {
                help.update_instances(value, row, col);
            }
        }
    }
    return help;
}

// Helper functions
help.get_row_values = function(quadrant) {
    switch (quadrant) {
        case "a":
        case "b":
        case "c":
            return [0, 1, 2];
            break;
        case "d":
        case "e":
        case "f":
            return [3, 4, 5];
            break;
        case "g":
        case "h":
        case "i":
            return [6, 7, 8];
            break;
    }
}

help.get_col_values = function(quadrant) {
    switch (quadrant) {
        case "a":
        case "d":
        case "g":
            return [0, 1, 2];
            break;
        case "b":
        case "e":
        case "h":
            return [3, 4, 5];
            break;
        case "c":
        case "f":
        case "i":
            return [6, 7, 8];
            break;
    }
}

// value has been found, update all class attributes
// removes the option of that value from the row/col/box
help.update_instances = function(value, row, col, quadrant = "") {
    // update stats
    progress_total++;
    progress_percentage = `${progress_total / 81}%`;

    // no quadrant passed in (rows and cols are real values from 0-8)
    if (quadrant === "") {
        // the box already contains value
        if (boxes[help.coords_to_quadrant(row, col)].includes(value)) {
            console.log("ERROR")
        }
        boxes[help.coords_to_quadrant(row, col)].push(value);
    }
    else {
        // adding instance to box
        if (boxes[quadrant].includes(value)) {
            console.log("ERROR") //box already has the value
        }
        boxes[quadrant].push(value);
        row = help.get_row_values(quadrant)[row];
        col = help.get_col_values(quadrant)[col];
    }

    // update options
    if (Array.isArray(options[row][col])) {
        options[row][col] = value;
        help.remove_from_row(3, value, row);
        help.remove_from_col(3, value, col);
        help.remove_from_box(value, help.coords_to_quadrant(row, col));
        // help.view_options_board();
    }

    // rows + cols' values
    eval("r" + row + ".push(value)");
    eval("c" + col + ".push(value)");

    // numbers' values
    if (value === 1) {
        ones["hor"].push(row);
        ones["vert"].push(col);
    }
    else if (value === 2) {
        twos["hor"].push(row);
        twos["vert"].push(col);
    }
    else if (value === 3) {
        threes["hor"].push(row);
        threes["vert"].push(col);
    }
    else if (value === 4) {
        fours["hor"].push(row);
        fours["vert"].push(col);
    }
    else if (value === 5) {
        fives["hor"].push(row);
        fives["vert"].push(col);
    }
    else if (value === 6) {
        sixes["hor"].push(row);
        sixes["vert"].push(col);
    }
    else if (value === 7) {
        sevens["hor"].push(row);
        sevens["vert"].push(col);
    }
    else if (value === 8) {
        eights["hor"].push(row);
        eights["vert"].push(col);
    }
    else if (value === 9) {
        nines["hor"].push(row);
        nines["vert"].push(col);
    }
    else {
        console.log("something went wrong");
    }
}

// in a box, if a cell has only one option
// change the value to that option
help.options_simplify = function(box) {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (Array.isArray(box[row][col])) {
                if (box[row][col].length == 1) {
                    // only one option
                    box[row][col] = box[row][col][0];

                }
            }
        }
    }
    return box;
}

// takes the entire grid and changes cells where
// there can only be one value, to that value
help.options_simplify_complete = function() {
    for (let quadrant = 0; quadrant < 9; quadrant++) {

        let box = help.get_box(quadrants[quadrant]);

        //update found answers (from [5] to a 5),
        //changes the class instances
        box = help.options_simplify(box);

        //updates the options (complete grid)
        //but only one box at a time
        help.update_box(box, quadrants[quadrant]);
    }
}

// like update_cells but only for boxes
// help function was written first,
// but update_cells makes it work for rows/cols aswell
help.update_box = function(box, quadrant) {

    const add_to_row = [0, 0, 0, 3, 3, 3, 6, 6, 6]
                    [quadrants.indexOf(quadrant)]
    const add_to_col = [0, 3, 6, 0, 3, 6, 0, 3, 6]
                    [quadrants.indexOf(quadrant)]

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let value = box[row][col];
            if (options[row + add_to_row][col + add_to_col] !== value){
                if (!(Array.isArray(value))) { // value is not an Array
                    help.update_instances(
                        value,
                        row + add_to_row, col + add_to_col);
                }
                else { // update the options of cell
                    options[row + add_to_row][col + add_to_col] =
                        value;
                }
            }
        }
    }
}

// given cells, updates the values of options
// for subsequent analysis
help.update_cells = function(cells, type, index) {
    if (type === "row") {
        options[index] = cells;
    }
    else if (type === "col") {
        for (let row = 0; row < 9; row++) {
            options[row][index] = cells[row];
        }
    }
    else if (type === "box") {
        const add_to_row = [0, 0, 0, 3, 3, 3, 6, 6, 6][index]
        const add_to_col = [0, 3, 6, 0, 3, 6, 0, 3, 6][index]

        for (let cell = 0; cell < 9; cell++) {
            let value = cells[cell];
            if (options[Math.floor(cell / 3 + add_to_row)]
            [Math.floor(cell % 3 + add_to_col)] !== value) {
                // value is not an Array
                if (!(Array.isArray(value))) {
                    help.update_instances(
                        value,
                        Math.floor(cell / 3 + add_to_row),
                        Math.floor(cell % 3 + add_to_col));
                }
                // update the options of cell
                else {
                    options[Math.floor(cell / 3 + add_to_row)]
                    [Math.floor(cell % 3 + add_to_col)] = value;
                }
            }
        }
    }
}

// given a quadrant, checks if everything is full
help.is_box_full = function(quadrant) {
    let box = help.get_box(quadrants[quadrant]);
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (Array.isArray(box[row][col])) return false;
        }
    }
    return true;
}

// given box and number, checks if number in box
help.is_in_box = function(box, number) {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (box[row][col] === number) return true;
        }
    }
    return false;
}

// given array(9) and number, checks if number in array
help.is_in_cells = function(cells, number) {
    for (let row = 0; row < 9; row++) {
        if (cells[row] === number) return true;
    }
    return false;
}

// looks at each box and does a simple analysis of obvious ones
help.get_exhaustive_options = function(input_options) {

    options = input_options;

    // iterate through the quadrants
    for (let quadrant = 0; quadrant < 9; quadrant++) {
        let box = help.get_box(quadrants[quadrant]);
        let rows = help.get_row_values(quadrants[quadrant]);
        let cols = help.get_col_values(quadrants[quadrant]);

        //iterate through numbers then (rows and cols)
        for (let number = 1; number < 10; number++) {

            // if number is in box then change number
            if (help.is_in_box(box, number)) continue;

            //iterate through each cell
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (eval("r" + rows[row] + ".includes(number)") ||
                        eval("c" + cols[col] + ".includes(number)")) {
                        // changes to other point,
                        // the number is already in row/col
                        continue;
                    }

                    // iterate through that rows' Arrays (empty squares)
                    // and add number as a possibility
                    if (Array.isArray(box[row][col])) {

                        // if number not already an option
                        if (!(box[row][col].includes(number)))
                            box[row][col].push(number);
                    }
                }
            }
        }

        // update found answers (from [5] to a 5),
        // changes the class instances
        box = help.options_simplify(box);

        // updates the options (complete grid) but only
        // one box at a time
        help.update_box(box, quadrants[quadrant]);
    }
    return options;
}

// a pair(or triplet) has been found, function is called to remove
// the two(or three) numbers from that row/col/box
help.remove_non_pairs = function(cells, coordinates, numbers) {
    // get paired cells
    for (let index = 0; index < numbers.length; index++) {
        // cells should be [cell number , cell number] format
        const cell_position = coordinates[index];

        // removes all other possible options in that cell
        cells[cell_position] = [...numbers];

    }
    return cells;
}

// finds pairs(or triplets) in a row/col/box and removes those values from
// the complementary row/col/box
help.naked_pairs = function(count = 2, type = "box") {
    for (let index = 0; index < 9; index++) {
        let cells;
        if (type === "row") {
            cells = [...options[index]];
        }
        else if (type === "col") {
            cells = [options[0][index], options[1][index],
            options[2][index], options[3][index],
            options[4][index], options[5][index],
            options[6][index], options[7][index],
            options[8][index]];
        }
        else if (type == "box") {
            let box = help.get_box(quadrants[index]);
            cells = [box[0][0], box[0][1], box[0][2], box[1][0], box[1][1],
            box[1][2], box[2][0], box[2][1], box[2][2]];
        }

        let values = {};

        // iterate through the numbers
        for (let number = 1; number < 10; number++) {

            let amount = count;

            for (let cell = 0; cell < 9; cell++) {
                if (Array.isArray(cells[cell])) {
                    if (cells[cell].includes(number)) {
                        // update count
                        amount--;
                        if (values.hasOwnProperty(number)) {
                            values[number].push(cell);
                        }
                        else {
                            values[number] = [cell];
                        }
                    }
                }
            }
            if (amount !== 0) {
                delete values[number];
            }
            else {
                values[number] = JSON.stringify(values[number])
            }
        }

        // iterate through 'pairs'
        const numbers = Object.keys(values);
        const coords = Object.values(values);

        if (numbers.length >= count) {

            for (let index = 0; index < numbers.length; index++) {
                const number = numbers[index]; //number is a string "1"
                const position = coords[index];

                // removes current instance of value
                // so that when next check can only
                // check with other values' cells
                if (values.hasOwnProperty(number)) {
                    delete values[number];
                }
                else {
                    continue; // change number
                }

                let set = [number];

                // iterate to account for when count is 3
                for (let i = 0; i < count - 1; i++) {
                    if (Object.values(values).includes(position)) {
                        // pushes a "number" like "3"
                        set.push(
                            Object.keys(values)
                            [Object.values(values).indexOf(position)]);

                        // deletes the property of values object
                        delete values
                        [Object.keys(values)
                            [Object.values(values).indexOf(position)]]
                    }
                }
                if (set.length === count) {
                    set = set.map((x) => JSON.parse(x));
                    cells = help.remove_non_pairs(
                        cells,
                        JSON.parse(position),
                        set);
                }
            }
        }
        help.update_cells(cells, type, index);
    }
}

// removes numbers from row/col/box except location of pairs
help.remove_except_pairs = function(cells, numbers, except) {
    for (let cell = 0; cell < 9; cell++) {
        if (!(except.includes(JSON.stringify(cell)))) {
            if (Array.isArray(cells[cell])) {
                for (let number = 0; number < numbers.length; number++) {
                    const value = numbers[number];

                    const index = cells[cell].indexOf(value);
                    if (index > -1) {
                        cells[cell].splice(index, 1);
                    }
                }
            }
        }
    }
    return cells
}

// Checks if x cells are occupied by only the same x numbers, if found:
// removes the two numbers from the rest of the box/row/col
help.obvious_pairs = function(count = 2, type = "box") {
    for (let index = 0; index < 9; index++) {
        let cells;
        if (type === "row") {
            cells = [...options[index]];
        }
        else if (type === "col") {
            cells = [options[0][index], options[1][index],
            options[2][index], options[3][index],
            options[4][index], options[5][index],
            options[6][index], options[7][index],
            options[8][index]];
        }
        else if (type == "box") {
            const box = help.get_box(quadrants[index]);
            cells = [box[0][0], box[0][1], box[0][2], box[1][0], box[1][1],
            box[1][2], box[2][0], box[2][1], box[2][2]];
        }

        let values = {};

        // iterate through the numbers
        for (let cell = 0; cell < 9; cell++) {
            const element = cells[cell];

            if (Array.isArray(element)) {
                if (element.length === count) {
                    values[cell] = JSON.stringify(element);
                }
            }
        }

        const cell_numbers = Object.keys(values);
        const elements = Object.values(values);

        if (cell_numbers.length >= count) {
            for (let cell_index = 0;
                cell_index < cell_numbers.length;
                cell_index++) {

                const number = cell_numbers[cell_index];
                let position;

                // removes current instance of value so that when
                // next check can only check with other values' cells
                if (values.hasOwnProperty(number)) {
                    position = values[number];
                    delete values[number];
                }
                else {
                    continue; // change number
                }

                let set = [number];

                for (let i = 0; i < count - 1; i++) {

                    if (Object.values(values).includes(position)) {

                        // pushes a "number" like "3"
                        set.push(
                            Object.keys(values)
                            [Object.values(values).indexOf(position)]);

                        // deletes the property of values object
                        delete values
                        [Object.keys(values)
                            [Object.values(values).indexOf(position)]]
                    }
                }
                if (set.length === count)
                    cells = help.remove_except_pairs(
                        cells,
                        JSON.parse(position),
                        set);
            }
        }
        help.update_cells(cells, type, index);
    }
}

// removes number from row
help.remove_from_row = function(section, number, row) {
    for (let col = 0; col < 9; col++) {
        if (section === 0 && [3, 4, 5, 6, 7, 8].includes(col) ||
            section === 1 && [0, 1, 2, 6, 7, 8].includes(col) ||
            section === 2 && [0, 1, 2, 3, 4, 5].includes(col) ||
            section === 3) {
            if (Array.isArray(options[row][col])) {
                const index = options[row][col].indexOf(number);
                if (index > -1) {
                    options[row][col].splice(index, 1);
                }
            }
        }
    }
}

// removes number from col
help.remove_from_col = function(section, number, col) {
    for (let row = 0; row < 9; row++) {
        if (section === 0 && [3, 4, 5, 6, 7, 8].includes(row) ||
            section === 1 && [0, 1, 2, 6, 7, 8].includes(row) ||
            section === 2 && [0, 1, 2, 3, 4, 5].includes(row) ||
            section === 3) {
            if (Array.isArray(options[row][col])) {
                const index = options[row][col].indexOf(number);
                if (index > -1) {
                    options[row][col].splice(index, 1);
                }
            }
        }
    }
}

// removes number from box
help.remove_from_box = function(number, quadrant) {
    let box = help.get_box(quadrant);
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (Array.isArray(box[row][col])) {
                const index = box[row][col].indexOf(number);
                if (index > -1) {
                    box[row][col].splice(index, 1);
                }
            }
        }
    }
    help.update_box(box, quadrant);
}

// returns Array of options
help.get_box = function(quadrant) {
    switch (quadrant) {
    case "a":
        return [
            [options[0][0], options[0][1], options[0][2]],
            [options[1][0], options[1][1], options[1][2]],
            [options[2][0], options[2][1], options[2][2]]
        ];
    case "b":
        return [
            [options[0][3], options[0][4], options[0][5]],
            [options[1][3], options[1][4], options[1][5]],
            [options[2][3], options[2][4], options[2][5]]
        ];
    case "c":
        return [
            [options[0][6], options[0][7], options[0][8]],
            [options[1][6], options[1][7], options[1][8]],
            [options[2][6], options[2][7], options[2][8]]
        ];
    case "d":
        return [
            [options[3][0], options[3][1], options[3][2]],
            [options[4][0], options[4][1], options[4][2]],
            [options[5][0], options[5][1], options[5][2]]
        ];
    case "e":
        return [
            [options[3][3], options[3][4], options[3][5]],
            [options[4][3], options[4][4], options[4][5]],
            [options[5][3], options[5][4], options[5][5]]
        ];
    case "f":
        return [
            [options[3][6], options[3][7], options[3][8]],
            [options[4][6], options[4][7], options[4][8]],
            [options[5][6], options[5][7], options[5][8]]
        ];
    case "g":
        return [
            [options[6][0], options[6][1], options[6][2]],
            [options[7][0], options[7][1], options[7][2]],
            [options[8][0], options[8][1], options[8][2]]
        ];
    case "h":
        return [
            [options[6][3], options[6][4], options[6][5]],
            [options[7][3], options[7][4], options[7][5]],
            [options[8][3], options[8][4], options[8][5]]
        ];
    case "i":
        return [
            [options[6][6], options[6][7], options[6][8]],
            [options[7][6], options[7][7], options[7][8]],
            [options[8][6], options[8][7], options[8][8]]
        ];
    }
}

// UNUSED - for debugging
// checks if in class instances a number is present more than once
help.test_board = function() {
    function occurences(list) {
        var a = [],
            b = [],
            prev;
        list.sort();

        for (var i = 0; i < list.length; i++) {
            if (list[i] !== prev) {
                a.push(list[i]);
                b.push(1);
            } else {
                b[b.length - 1]++;
            }
            prev = list[i];
        }
        return [b];
    }

    const correct = JSON.stringify([1, 1, 1, 1, 1, 1, 1, 1, 1]);

    for (let index = 0; index < 9; index++) {
        let result = occurences(boxes[quadrants[index]])[0];
        let result1 = occurences(eval("c" + index))[0];
        let result2 = occurences(eval("r" + index))[0];

        if (JSON.stringify(result) !== correct ||
            JSON.stringify(result1) !== correct ||
            JSON.stringify(result2) !== correct)
            return false;
    }
    return true;
}

// checks is a number is only present once in a row/col/box
help.get_single_option = function(type = "box") {
    for (let index = 0; index < 9; index++) {
        let cells;
        if (type === "row") {
            cells = [...options[index]];
        }
        else if (type === "col") {
            cells = [options[0][index], options[1][index],
            options[2][index], options[3][index],
            options[4][index], options[5][index],
            options[6][index], options[7][index],
            options[8][index]];
        }
        else if (type == "box") {
            let box = help.get_box(quadrants[index]);
            cells = [box[0][0], box[0][1], box[0][2], box[1][0],
            box[1][1], box[1][2], box[2][0], box[2][1], box[2][2]];
        }

        // iterate through the numbers
        for (let number = 1; number < 10; number++) {

            let count = 0;
            let cell_index;

            // if number is already in cells then change number
            if (help.is_in_cells(cells, number)) continue;

            for (let cell = 0; cell < 9; cell++) {
                // if an Array (value is not decided)
                if (Array.isArray(cells[cell])) {
                    // if number already an option
                    if (cells[cell].includes(number)) {
                        // update count
                        count++;
                        if (count === 1) cell_index = cell;
                    }
                }
            }

            // if only one number possible in the cells, change value
            if (count === 1) {
                cells[cell_index] = number;
                if (type === "box")
                    help.update_instances(
                        number,
                        Math.floor(cell_index / 3),
                        cell_index % 3,
                        quadrants[index]);
                if (type === "row")
                    help.update_instances(
                        number,
                        index,
                        cell_index);
                if (type === "col")
                    help.update_instances(
                        number,
                        cell_index,
                        index);
            }
        }
        help.update_cells(cells, type, index);
    }
}

help.easy_single = function(){
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const element = options[row][col];
            if (Array.isArray(element)) {
                if (element.length === 1){
                    // options[row][col] = element[0];
                    help.update_instances(element[0], row, col);
                }
            }
        }
    }
}

// does single_option to row/col/box
help.simple = function(input_options) {
    options = input_options;
    help.easy_single();
    help.get_single_option("box");
    help.get_single_option("row");
    help.get_single_option("col");
    return options;
}

// does obvious_pairs to row/col/box
help.two_pairs = function(input_options) {
    options = input_options;
    help.obvious_pairs(2, "box");
    help.obvious_pairs(2, "row");
    help.obvious_pairs(2, "col");
    return options;
}

// does obvious_triplets to row/col/box
help.three_pairs = function(input_options) {
    options = input_options;
    help.obvious_pairs(3, "box");
    help.obvious_pairs(3, "row");
    help.obvious_pairs(3, "col");
    return options;
}

// does naked_pairs to row/col/box
help.two_naked = function(input_options) {
    options = input_options;
    help.naked_pairs(2, "box");
    help.naked_pairs(2, "row");
    help.naked_pairs(2, "col");
    return options;
}

// does naked_triplets to row/col/box
help.three_naked = function(input_options) {
    options = input_options;
    help.naked_pairs(3, "box");
    help.naked_pairs(3, "row");
    help.naked_pairs(3, "col");
    return options;
}

// checks if in a box, a number can only be on a row or col
// if yes, removes from that row/col
help.cant_be_on_line = function(input_options) {
    options = input_options;
    // get a box
    for (let quadrant = 0; quadrant < 9; quadrant++) {

        let box = help.get_box(quadrants[quadrant]);

        // let values = {};

        // iterate through the numbers
        for (let number = 1; number < 10; number++) {
            // if number is in box then change number
            if (help.is_in_box(box, number)) continue;

            let horz = [];
            let vert = [];

            // iterate through each cell
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    // if an Array (value is not definitive)
                    if (Array.isArray(box[row][col])) {
                        // if number already an option
                        if (box[row][col].includes(number)) {
                            if (!(horz.includes(row))) horz.push(row);
                            if (!(vert.includes(col))) vert.push(col);
                        }
                    }
                }
            }

            if (horz.length === 1)
                help.remove_from_row(
                    quadrant % 3,
                    number,
                    [0, 0, 0, 3, 3, 3, 6, 6, 6][quadrant] + horz[0]);
            if (vert.length === 1)
                help.remove_from_col(
                    Math.floor(quadrant / 3),
                    number,
                    [0, 3, 6, 0, 3, 6, 0, 3, 6][quadrant] + vert[0]);
        }
    }

    help.options_simplify_complete();

    return options;
}

help.restart = function() {
    ones = { "hor": [], "vert": [] };
    twos = { "hor": [], "vert": [] };
    threes = { "hor": [], "vert": [] };
    fours = { "hor": [], "vert": [] };
    fives = { "hor": [], "vert": [] };
    sixes = { "hor": [], "vert": [] };
    sevens = { "hor": [], "vert": [] };
    eights = { "hor": [], "vert": [] };
    nines = { "hor": [], "vert": [] };

    r0 = [];
    r1 = [];
    r2 = [];
    r3 = [];
    r4 = [];
    r5 = [];
    r6 = [];
    r7 = [];
    r8 = [];

    c0 = [];
    c1 = [];
    c2 = [];
    c3 = [];
    c4 = [];
    c5 = [];
    c6 = [];
    c7 = [];
    c8 = [];

    boxes = {
        "a": [],
        "b": [],
        "c": [],
        "d": [],
        "e": [],
        "f": [],
        "g": [],
        "h": [],
        "i": []
    };
}

help.init = function (strBoard) {

    help.restart();

    options = [
        [parseInt(strBoard[0]), parseInt(strBoard[1]), parseInt(strBoard[2]),
        parseInt(strBoard[3]), parseInt(strBoard[4]), parseInt(strBoard[5]),
        parseInt(strBoard[6]), parseInt(strBoard[7]), parseInt(strBoard[8])],
        [parseInt(strBoard[9]), parseInt(strBoard[10]), parseInt(strBoard[11]),
        parseInt(strBoard[12]), parseInt(strBoard[13]), parseInt(strBoard[14]),
        parseInt(strBoard[15]), parseInt(strBoard[16]), parseInt(strBoard[17])],
        [parseInt(strBoard[18]), parseInt(strBoard[19]), parseInt(strBoard[20]),
        parseInt(strBoard[21]), parseInt(strBoard[22]), parseInt(strBoard[23]),
        parseInt(strBoard[24]), parseInt(strBoard[25]), parseInt(strBoard[26])],
        [parseInt(strBoard[27]), parseInt(strBoard[28]), parseInt(strBoard[29]),
        parseInt(strBoard[30]), parseInt(strBoard[31]), parseInt(strBoard[32]),
        parseInt(strBoard[33]), parseInt(strBoard[34]), parseInt(strBoard[35])],
        [parseInt(strBoard[36]), parseInt(strBoard[37]), parseInt(strBoard[38]),
        parseInt(strBoard[39]), parseInt(strBoard[40]), parseInt(strBoard[41]),
        parseInt(strBoard[42]), parseInt(strBoard[43]), parseInt(strBoard[44])],
        [parseInt(strBoard[45]), parseInt(strBoard[46]), parseInt(strBoard[47]),
        parseInt(strBoard[48]), parseInt(strBoard[49]), parseInt(strBoard[50]),
        parseInt(strBoard[51]), parseInt(strBoard[52]), parseInt(strBoard[53])],
        [parseInt(strBoard[54]), parseInt(strBoard[55]), parseInt(strBoard[56]),
        parseInt(strBoard[57]), parseInt(strBoard[58]), parseInt(strBoard[59]),
        parseInt(strBoard[60]), parseInt(strBoard[61]), parseInt(strBoard[62])],
        [parseInt(strBoard[63]), parseInt(strBoard[64]), parseInt(strBoard[65]),
        parseInt(strBoard[66]), parseInt(strBoard[67]), parseInt(strBoard[68]),
        parseInt(strBoard[69]), parseInt(strBoard[70]), parseInt(strBoard[71])],
        [parseInt(strBoard[72]), parseInt(strBoard[73]), parseInt(strBoard[74]),
        parseInt(strBoard[75]), parseInt(strBoard[76]), parseInt(strBoard[77]),
        parseInt(strBoard[78]), parseInt(strBoard[79]), parseInt(strBoard[80])]
    ];

    help.fill_numbers();

    return options;
}

// checks if sudoku_string is a valid sudoku board
// regardless of if it is complete or not
help.isvalid = function (sudoku_string){
    let ar = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ]


    let boxes = [
        [[], [], []],
        [[], [], []],
        [[], [], []]
    ]

    // self-explanatory
    function find_duplicate_in_array(arra1) {
        var object = {};
        var result = [];

        arra1.forEach(function (item) {
            if(!object[item])
                object[item] = 0;
            object[item] += 1;
        })
        for (var prop in object) {
            if(object[prop] >= 2) {
                result.push(prop);
            }
        }
        return result;

    }

    // populate ar and boxes
    for (let index = 0; index < 81; index++) {
        ar[Math.floor(index/9)].push(sudoku_string[index]);
        if ([0,1,2,9,10,11,18,19,20].includes(index))
            boxes[0][0].push(sudoku_string[index])
        if ([3,4,5,12,13,14,21,22,23].includes(index))
            boxes[0][1].push(sudoku_string[index])
        if ([6,7,8,15,16,17,24,25,26].includes(index))
            boxes[0][2].push(sudoku_string[index])
        if ([27,28,29,36,37,38,45,46,47].includes(index))
            boxes[1][0].push(sudoku_string[index])
        if ([30,31,32,39,40,41,48,49,50].includes(index))
            boxes[1][1].push(sudoku_string[index])
        if ([33,34,35,42,43,44,51,52,53].includes(index))
            boxes[1][2].push(sudoku_string[index])
        if ([54,55,56,63,64,65,72,73,74].includes(index))
            boxes[2][0].push(sudoku_string[index])
        if ([57,58,59,66,67,68,75,76,77].includes(index))
            boxes[2][1].push(sudoku_string[index])
        if ([60,61,62,69,70,71,78,79,80].includes(index))
            boxes[2][2].push(sudoku_string[index])
    }

    // check rows
    for (let row = 0; row < 9; row++) {
        const duplicates = find_duplicate_in_array(ar[row]);
        for (let dupe = 0; dupe < duplicates.length; dupe++) {
            if ([1,2,3,4,5,6,7,8,9].includes(JSON.parse(duplicates[dupe])))
                return false;
        }
    }
    // check cols
    for (let col = 0; col < 9; col++) {
        const temp = [ar[0][col], ar[1][col], ar[2][col],
                    ar[3][col], ar[4][col], ar[5][col],
                    ar[6][col], ar[7][col], ar[8][col]]
        const duplicates = find_duplicate_in_array(temp);
        for (let dupe = 0; dupe < duplicates.length; dupe++) {
            if ([1,2,3,4,5,6,7,8,9].includes(JSON.parse(duplicates[dupe])))
                return false;
        }
    }

    // check boxes
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const duplicates = find_duplicate_in_array(boxes[row][col]);
            for (let dupe = 0; dupe < duplicates.length; dupe++) {
                if ([1,2,3,4,5,6,7,8,9].includes(JSON.parse(duplicates[dupe])))
                    return false;
            }
        }
    }
    return true
}

export default Object.freeze(help);