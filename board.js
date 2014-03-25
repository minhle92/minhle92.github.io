/*
 * The Board class represents the grid of letters that will be presented
 * to the player and contains functionality for intializing and displaying 
 *  the board, as well as validating submitted words
 *  The input arguments for the constructor of Board are the height
 *  and width of the grid. 
 */

function Board(width, height){
     var letterGrid = new Grid(width, height);
     letterGrid.makeAdjList();

     /* 
      * GetLetterArray: () -> String Array
      * returns a copy of the array representation of the grid
      */
     this.GetLetterArray = function () {
         return letterGrid.arrayRep.slice(0);
     }

     /* 
      * SetLetterArray: Boolean -> ()
      * if debug is set to true, the setLetterArray method fills with board  
      * with a specific array of letters rather than a random one
      */
     this.SetLetterArray = function (debug) {
         if (debug){
             letterGrid.arrayRep = 
             ["s","t","z","i","r","w","l","s","h","t","w","q","k","e","o","a"];
         } else {
             for(var i = 0; i < letterGrid.size; i++) {
                 letterGrid.arrayRep[i] = 
                 String.fromCharCode(97 + Math.random() * 26);
             }
         }
     }

     /* [Helper for inBoard] 
      * wordFromNode: Number * String * String Array -> Boolean
      * returns true if the given word can be formed from the given starting 
      * point on the grid, which is given as an index to the array  
      * representation of the grid. 
      * The visited argument is an array used by the function to ensure that 
      * the path formed by the word is acyclic. It contains indices of the   
      * array representation of the grid that have been visited previously 
      * by previous recursive calls. 
      */
     function wordFromNode(index, word, visited) {
         console.log("index: " + index + ", word: " + word + ", visited: " + visited);
         var neighbors = letterGrid.adjList[index];
         if (word.length === 1){
             for (var i = 0; i < neighbors.length; i++) {
                 if (word[0] === letterGrid.arrayRep[neighbors[i]] && 
                     visited.indexOf(neighbors[i]) === -1){
                     return true;
                 }
             }
             return false;
         } else {
             for (var i = 0; i < neighbors.length; i++){
                 if (word[0] === letterGrid.arrayRep[neighbors[i]] && 
                     visited.indexOf(neighbors[i]) === -1){
                     visited.push(neighbors[i]);
                     if (wordFromNode(neighbors[i], 
                                      word.slice(1,word.length),
                                      visited)){
                         return true;
                     }
                 }
             }
             return false;
         }
     }

     /* 
      * InBoard: String -> Boolean
      * assumes that input is non-empty
      * returns true if input word can be formed within the Board  
      * and false otherwise
      */
     this.InBoard = function(input) {
         var startIndices = letterGrid.allIndicesOf(input[0]);
         for (var i = 0; i < startIndices.length; i++) {
             var visited = new Array();
             visited.push(startIndices[i]);
             if (wordFromNode(startIndices[i], 
                              input.slice(1,input.length), 
                              visited)) {
                 return true;
             }
         }
         return false 
     }

    // generates the html required to display the grid of letters on 
    // the website 
    this.Display = function() {
        var $box = $('<div id= "box"></div>');
        $('#game_board').append($box);
        for(var i = 0; i < 16; i++) {
            var num = new Number(i);
            var $div = $('<div class = "board"></div>');
            var $char = 
                $('<p class = "boardtext">' + letterGrid.arrayRep[i] + '</p>');
            $div.append($char);
            $box.append($div);
            var x = 100* letterGrid.getCol(i);
            var y = 100* letterGrid.getRow(i);
            $div.css({ left: x, top: y});
        }
    }

    //array for the initial call to extend
    var paths = new Array();
    
    for (var i = 0; i < letterGrid.size; i++){
        paths.push([i]);
    }
    
    /* 
     * extend: Number Array Array -> Number Array Array
     * recursive function
     * given a set of starting nodes, generates all the paths of length 
     * 5 starting from the given nodes 
     */
    function extend(shorter_paths) {
        var len = (shorter_paths[0]).length;
        if (len === 5) {
            return shorter_paths;
        } else {
            var longer_paths = new Array();
            for (var i = 0; i < shorter_paths.length; i++) {
                var currPath = shorter_paths[i];
                var neighbors = 
                    (letterGrid.adjList[(currPath[len - 1])]).slice();
                while(neighbors.length > 0) {
                    var newNode = neighbors.pop();                            
                    if (currPath.indexOf(newNode) === -1) {
                        var temp = currPath.slice();                      
                        temp.push(newNode);
                        longer_paths.push(temp);
                    }
                }
            }
            return extend(longer_paths);
        }
    }

    //private array that contains all paths of length 5 in Board
    var fivePaths = extend(paths);
    
    /*
     * ASSUMES: SetLetterArray has been called 
     * returns an array of all valid 5 letter words in board
     * used for focus mode
     */
    this.GetFiveLetterWords = function(){
        for (var i = 0; i < fivePaths.length; i++){
            var letters = new Array();
            for (var j = 0; j < 5; j++) {

            }
        }
    }
}

