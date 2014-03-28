//The game prototype runs the actual word game, sets up the board and grid

function Game(gameBoard) {
    var game_score = 0;
    this.mode = -1;
    var submittedWords = new Object();
    var focusSol;
    var focusInput;

    this.Start =  function(game_mode){
        document.getElementById('title').style.display = 'none';
        document.getElementById('dialogue').style.display = 'none';
        document.getElementById('zen').style.display = 'none';
        document.getElementById('flash').style.display = 'none';
        document.getElementById('focus').style.display = 'none';
        document.getElementById('instructions').style.display = 'none';
        document.getElementById('disp').style.display = 'block';

        gameBoard.SetLetterArray(false,game_mode);        

        switch (game_mode) {
        case 0: //zen mode
            this.mode = 0;
            document.getElementById('enterWord').style.display = 'block';
            document.getElementById('giveUp').style.display = 'block';
            document.getElementById('wordList').style.display = 
                'block';
            $('#wordList').prepend('<p> submitted words: </p>');
            gameBoard.Display();
            break;
        
        case 1: //flash mode
            this.mode = 1;
            document.getElementById('waitMsg').style.display = 'block';
            startTime(120);
            break;
        case 2: //focus mode
            this.mode = 2;
            document.getElementById('waitMsg').style.display = 'block';
            focusSol = gameBoard.getFiveLetterWords();
            startTime(30);
            break;
        }
    }

    this.GiveUp =  function(){
        this.Stop(false);
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
        if (!gameBoard.InBoard(input)){
            document.getElementById('disp').innerHTML = input + " is not a valid word";
        } else {
            
            if (this.mode === 2) {
                if (input.length !== 5) {
                    document.getElementById('disp').innerHTML =
                        input + " is not of correct length.";
                } else {
                    if (focusSol.hasOwnProperty(input)) {
                        document.getElementById('disp').innerHTML = 
                        "You found the word " + input + "!";
                        focusInput = input;
                        this.Stop(false);
                    }
                }
            } else {
                document.getElementById('list').style.display = 'block';
                if (submittedWords.hasOwnProperty(input)) {
                    document.getElementById('disp').innerHTML = 
                        input + " has already been submitted.";
                } else {
                    if (words.hasOwnProperty(input)){
                        word_score = score(input);
                        submittedWords[input] = 1;
                        document.getElementById('disp').innerHTML = 
                        input + " scored " 
                        + word_score.toString() + " points.";
                        $('ul').append('<li> ' + input + '</li>');
                        game_score += word_score;
                    } else { 
                        document.getElementById('disp').innerHTML = 
                        input + " is not a word.";
                    }
                }
            }
        }
    }


    this.Stop = function(timed_out) {
        document.getElementById('enterWord').style.display = 'none';
        document.getElementById('giveUp').style.display = 'none';
        switch (this.mode) {
        case 0: //zen mode
            document.getElementById('disp').innerHTML = 
                'Your score was ' + game_score + '.</br> Thanks for playing!';
            break; 
        case 1: //flash mode
            clearInterval(timer);
            document.getElementById('timer').style.display = 'none';
            if (timed_out) {
                document.getElementById('disp').innerHTML =
                    "Time's up! Your score was " + game_score + ".</br> Thanks for playing!";
            } else {
                document.getElementById('disp').innerHTML = 
                    'Your score was ' + game_score + '.</br> Thanks for playing!';
            }
            break;
        case 2: //focus mode
            clearInterval(timer);
            document.getElementById('timer').style.display = 'none';
            document.getElementById('wordList').style.display = 'block';
            document.getElementById('list').style.display = 'block';

            if (timed_out){
                $('#wordList').prepend('<p>Possible words:</p>');
                document.getElementById('disp').innerHTML = 
                    "Time's up! </br> Thanks for playing.";
            } else {
                $('#wordList').prepend('<p>other valid words:</p>');
            }
            for (var key in focusSol) {
                if (focusSol.hasOwnProperty(key)) {
                    if (key === focusInput) {
                        continue;
                    } else {
                        $('ul').append('<li>' + key + '</li>');
                    }
                }
            }
            break;
        }
    }
    
    this.ShowDialogue = function(game_mode) {
        switch (game_mode) {
        case 0: //zen mode
        document.getElementById('instructions').innerHTML = 'Form as many words as you can by connecting adjacent letters on the board. </br> (Letters diagonal to each other count as adjacent.)';
        break;
        case 1: //flash mode
        document.getElementById('instructions').innerHTML = 'You have 2 minutes to form as many words as you can by connecting adjacent letters on the board.</br> (Letters diagonal to each other count as adjacent.)';
        break;
        case 2: //focus mode
        document.getElementById('instructions').innerHTML = 'You have 30 seconds to form a 5 letter word by connecting adjacent letters on the board.</br> (Letters diagonal to each other count as adjacent.)';

        break;
        }
    }

    this.HideDialogue = function(){
        document.getElementById('instructions').innerHTML = "";
    }
}

    
