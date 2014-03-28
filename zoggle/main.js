//TODO: 
//make sure there are at least 2 vowels
//allow players to enter words by clicking on board
//end display
//provide definition on hover

function assert(truthvalue, testname){
    if (!truthvalue) console.log('Test failed: ' + testname);
}
var board = new Board(4,4);
var game = new Game(board);
console.log(game.mode);
var timer;
var currentTime;
var timeLimit;
$('#inputword').keydown(function(event) {
        var input = document.getElementById('inputword').value;
        if (event.which === 13 && input.length !== 0){
            document.getElementById('inputword').value = "";
            game.ValidateWord(input);
        }
    });

function startTime(limit) {
    console.log("mode in startTime: " + game.mode);
    currentTime = limit;
    timeLimit = limit;
    timer = setInterval("showTime()",1000);
}

function showTime(){
    if (currentTime === timeLimit) {
        document.getElementById('waitMsg').style.display = 'none';
        document.getElementById('giveUp').style.display = 'block';
        document.getElementById('timer').style.display = 'block';
        document.getElementById('enterWord').style.display = 'block';
        
        if (game.mode === 1) {
            console.log("flash mode started");
            document.getElementById('wordList').style.display = 'block';
            $('#wordList').prepend('<p> submitted words: </p>');
        } 
        board.Display();
        
    }
    if (currentTime=== 0){
        clearInterval(timer);
        game.Stop(true);
    } else {
        console.log(game.mode);
        var min = (currentTime - (currentTime% 60))/60;
        var sec = currentTime % 60;
        if (sec < 10){
            document.getElementById('timer').innerHTML = min + ":0" + sec;
        } else {
            document.getElementById('timer').innerHTML = min + ":" + sec;
        }
    }
    currentTime--;
}
