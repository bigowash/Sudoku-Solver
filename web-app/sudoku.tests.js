import fc, { func } from "fast-check";
import help from "./solving_functions.js";

// all possible values
const num = fc.constantFrom(
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
);

//makes a random Array(81)
const e = fc.tuple(
    num, num, num, num, num, num, num, num, num,
    num, num, num, num, num, num, num, num, num,
    num, num, num, num, num, num, num, num, num,
    num, num, num, num, num, num, num, num, num,
    num, num, num, num, num, num, num, num, num,
    num, num, num, num, num, num, num, num, num,
    num, num, num, num, num, num, num, num, num,
    num, num, num, num, num, num, num, num, num,
    num, num, num, num, num, num, num, num, num
);

const valid_nine_instances = function (str) {
    const list = str.split("");
    let occurences = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0
    };
    for (let index = 0; index < 81; index++) {
        const el = str[index];
        if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(el)){
            // update count
            occurences[el]++;
            if (occurences[el] === 10) return false;
        }
    }
    return true;
}

// checks if the rows contain no more than 1 of each number (except 0)
const valid_rows = function (str) {
    const list = str.split("");
    let count = 0
    let occurences = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9": 0
    };
    while (count < 9) {
        const row = list.slice(count*9, count*9+9);
        row.forEach(el => {
            if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(el)){
                // update count
                occurences[el]++;
            }
        });
        Object.values(occurences).forEach(el => {
            if (el > 1) return false
        })
    }
    return true;
}

describe("Sudoku Testing", function () {

    it("Known examples pass correctly", function () {
        const examples = [
            "010020300004005060070000008006900070000100002030048000500006040000800106008000000",
            "010020300002003040050000006004700050000100003070068000300004090000600104006000000",
            "010020300002003040080000006004700030000600008070098000300004090000800104006000000",
            "010020300002003040050000006004200050000100007020087000300004080000600105006000000",
            "010020300002003040050000006004700050000100008070098000300004090000900804006000000"
        ];

        examples.forEach(function (string){
            const validity = help.isvalid(string);

            if (!validity){
                throw (
                    `Expected "${string}" to give true ` +
                    "instead we got false"
                );
            }
        });
    });

    it("A valid sudoku string does not contain more than" +
        "9 instances of each number",
        function () {
            fc.assert(fc.property(
                e,
                function (e) {
                    // .join("") turns the array into string
                    const check = valid_nine_instances(e.join(""));
                    const fromFile = help.isvalid(e.join(""));
                    if (!check && fromFile) return false;
                    return true;
                }
            )
        );
    });

    it("A valid sudoku's rows do not contain more than" +
    "1 instance of each number",
    function () {
        fc.assert(fc.property(
            e,
            function (e) {
                const fromFile = help.isvalid(e.join(""));
                const check = valid_rows(e.join(""));
                if (!check && fromFile) return false;
                    return true;
            }
        ))
    })
});

