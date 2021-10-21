# Project
This repository is for the submission of your **Computing 2: Applications** coursework.

# Setup
I used Virtual Studio Code Editor to host the server. Opening this folder, I ran the static folder using the launch.json file included in the repository. This hosts a server with a url of http://localhost:8080

## Brief
*State what you set out to acomplish with this web app.*
This app takes an 81-character sudoku strings and solves it using various techniques that the user can select. Each time a button is pressed, the board is simplified and updated without having to reload the page. A link is provided to find 81 character strings easily.

## Coding
*Highlight your approach to coding in this project.*
I started by coding the entire solving process as a class. As we continued learning about the server interaction, I had to change where the solving took place from the file to the server. To do that, I re-wrote all of my help file (mostly by changing all occurences of "this." (class properties) to an object called help). The structure of the html was made by following a tutorial while the css consisted mainly of trial and error using the inspect element option on the browser and chaning the values there. 
The page is loaded from the index.html file using styles.css. Once loaded, eventlisteners monitor each click of the buttons on the main.js file. Once a button is pressed, their associated function is called. For the start game button, the sudoku string and and the null_character is taken 

*Outline the key elements of your UX/UI design.*
The sudoku grid and buttons are hidden until they become useful. The link does not change the current page but creates a new window, preserving the wep app. When hovering over the buttons, text appears explaining the button's effect with regards to the sudoku grid. The only true user input that would affect how the code runs is the sudoku string. For this input, I added two checks: the first checks the length of the input string, ensuring it is 81 characters long (an warning is sent to the user where applicable) then it makes sure it is a valid sudoku string. This means that there are no repeats of the same number in the same row, col or box. This check however is not the most rigourous as a unsolvable sudoku can be entered. To ameliorate this, the code would need to solve it first (to make sure its solvable) before allowing the grid to be built.

## Data
*Explain how you structure and process your data.*
At first, seeing as I wrote my code as a class object, I tried to pass the entire class to and from the server because I needed all the class' methods and especially properties. I realized I could conserve the aspect of class properties to variables on a file making the server do all the adjustments. 
Data is passed as an entire class object. Everytime a solving button is pressed, the class is passed to the ajax.js, that file changes the class depending on the method called and returns the class object again. The object itself is very simple. It contains only 3 values: "makeitnotempty" to make the returned object non-empty (supposedly promises might induce an error without it, it was working fine without it but I included it to be thorough), "name_of_called_function" as a boolean, and "options" the entire sudoku board as an array of numbers and arrays of numbers (for unsolved cells).  

## Debugging
*Describe how you used debugging practices and tools and how they helped you overcome a bug or conceptual issue.*
When writing the core solving code, some of the functions removed too many options, leaving the class attribute .options with empty cells and no options. My code is pretty convoluted so using the VScode debugger was very helpful when looking at the values of each variable at every step. Working through what each variable should be compared to what it is. Most of my errors came from the type of numbers when they were strings instead of numbers. JSON.stringify and JSON.parse were very helpful in that respect. The rest of my errors came from the comparison of arrays in javascript which took me a while to realise. When coding the server side, there is limited information for debugging. I got stuck for an hour trying to understand why an object I was passing to the server always returned an empty object. The error came from rewriting a previous task (instead of copying it) and miss spelling the parameter "task" as "type".

## Best Practice
*Outline your use of software development best practices*
When writing the javascript code, I continually ran and debugged each function before starting to code the next one. This allowed me to be sure that if an error arose, it came from the new code written as opposed to previously written working code. I did my best to optimize my code, not that my program is that demanding, but as a good practice. For example, when clicking a button, an array of arrays is passed (options) to the server with a certain task. The server returns a new array of arrays. The update board is only called if the two arrays are not identical. Because in javascript arrays are compared by memory location as opposed to content (the source of many issues for when writing each solving function), the JSON.stringify is passed on those arrays to compare them. This is only optimized if the that call takes less time to be realized than to update_board(), seemingly a safe bet. 
