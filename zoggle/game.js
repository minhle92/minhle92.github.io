//The game prototype runs the actual word game, sets up the board and grid

function Game() {
    var board = new Board(4,4);
    var game_score = 0;
    var mode = -1;
    var submittedWords = new Object();

    this.Start =  function(game_mode){
        document.getElementById('title').style.display = 'none';
        document.getElementById('dialogue').style.display = 'none';
        document.getElementById('zen').style.display = 'none';
        document.getElementById('flash').style.display = 'none';
        document.getElementById('focus').style.display = 'none';
        document.getElementById('instructions').style.display = 'none';
        document.getElementById('enterWord').style.display = 'block';
        document.getElementById('disp').style.display = 'block';
        
        switch (game_mode) {
        case 0: //zen mode
            mode = 0;
            console.log('zen mode started');
            document.getElementById('giveUp').style.display = 'block';
            document.getElementById('submitted_wrapper').style.display = 
                'block';
            break;
        
        case 1: //flash mode
            mode = 1;
            document.getElementById('giveUp').style.display = 'block';
            document.getElementById('timer').style.display = 'block';
            document.getElementById('submitted_wrapper').style.display = 
                'block';
            timer = setInterval("showTime()", 1000);
            break;
        case 2: //focus mode
            mode = 2;
            document.getElementById('giveUp').style.display = 'block';
            document.getElementById('timer').style.display = 'block';
            document.getElementById('giveUp').style.display = 'block';
            break;
        }

        board.SetLetterArray(false);
        board.Display();
    }

    this.GiveUp =  function(){
        this.Stop();
    }

     /* 
      * [Helper for ValidateWord] score: String -> Number
      * determines the point value of a word based on letters used and 
      * how common the word is in the English language
      */
    function score(input) {
        var multiplier = 1;
        var sum = 0;
        if (freq_table[input]){
            if (freq_table.input > 2500) multiplier = 2;
        }
        else multiplier = 3;
        for( var i = 0; i < input.length; i++){
            sum += letter_point[input.charAt(i)];
        }
        return sum * multiplier;
    }

    /* 
     * ValidateWord: String -> ()
     * if the word can be formed in the Board and word exists in dictionary, 
     * the function displays the score of the word on the website
     * else the function returns an error notification
     */
    this.ValidateWord = function(input) {
        if (event.keyCode == 13 && input.length != 0){
            document.getElementById('inputword').value = "";
             if (!board.InBoard(input)){
                 document.getElementById('disp').innerHTML = input + " is not a valid word";
             }	else {
                 if (submittedWords.hasOwnProperty(input)) {
                     document.getElementById('disp').innerHTML = 
                     input + " has already been submitted.";
                 } else {
                     if (words.hasOwnProperty(input)){
                         word_score = score(input);
                         submittedWords[input] = 1;
                         document.getElementById('disp').innerHTML = 
                         input + " scored " + word_score.toString() + " points.";
                         $('ul').append('<li> ' + input + '</li>');
                         game_score += word_score;
                     } else { 
                         document.getElementById('disp').innerHTML = input + " is not a word.";
                     }
                 }
             }
        }
    }

    this.Stop = function() {
        document.getElementById('enterWord').style.display = 'none';
        document.getElementById('giveUp').style.display = 'none';
        switch (mode) {
        case 0: //zen mode
            console.log('here');
            document.getElementById('disp').innerHTML = 
                'Your score was ' + game_score + '.</br> Thanks for playing!';
            break; 
        case 1: //flash mode
            clearInterval(timer);
            document.getElementById('timer').style.display = 'none';
            document.getElementById('disp').innerHTML = 
                'Your score was ' + game_score + '.</br> Thanks for playing!';
            break;
        case 2: //focus mode
            document.getElementById('submitted_wrapper').style.display = 
                'none';
            break;
        }
    }
    
    this.ShowDialogue = function(game_mode) {
        switch (game_mode) {
        case 0: //zen mode
        document.getElementById('instructions').innerHTML = 'Form as many words as you can by connecting adjacent letters on the board. (Letters diagonal to each other count as adjacent.)';
        break;
        case 1: //flash mode
        document.getElementById('instructions').innerHTML = 'You have 2 minutes to form as many words as you can by connecting adjacent letters on the board. (Letters diagonal to each other count as adjacent.)';
        break;
        case 2: //focus mode
        document.getElementById('instructions').innerHTML = 'You have 2 minutes to form a 5 letter word by connecting adjacent letters on the board. (Letters diagonal to each other count as adjacent.)';

        break;
        }
    }

    this.HideDialogue = function(){
        document.getElementById('instructions').innerHTML = "";
    }
}

    
