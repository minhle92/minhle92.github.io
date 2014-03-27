//TODO: 
//make sure there are at least 2 vowels
//allow players to enter words by clicking on board
//end display
//provide definition on hover

function assert(truthvalue, testname){
    if (!truthvalue) console.log('Test failed: ' + testname);
}

var game = new Game();
var timer;
var timeLimit;



function showTime(limit){
    if (timerLimit === limit) {
        document.getElementById('waitMsg').style.display = 'none';
        document.getElementById('giveUp').style.display = 'block';
        document.getElementById('timer').style.display = 'block';
        document.getElementById('enterWord').style.display = 'block';
        
        if (game.mode === 1) {
            document.getElementById('wordList').style.display = 'block';
            $('#wordList').prepend('<p> submitted words: </p>');
        } 
        game.board.Display();
    }
    if (timerLimit=== 0){
        clearInterval(timer);
        game.Stop(true);
    } else {
        var min = (timerLimit- (timerLimit% 60))/60;
        var sec = timerLimit% 60;
        if (sec < 10){
            document.getElementById('timer').innerHTML = min + ":0" + sec;
        } else {
            document.getElementById('timer').innerHTML = min + ":" + sec;
        }
    }
    timerLimit--;
}
