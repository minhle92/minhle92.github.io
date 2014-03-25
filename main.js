//TODO: 
//make sure there are at least 2 vowels
//implement timer
//disallow repeated entries
//allow players to enter words by clicking on board
//replace isIn with indexOf
//end display
//provide definition on hover
//implement click and drag

function assert(truthvalue, testname){
    if (!truthvalue) console.log('Test failed: ' + testname);
}

var game = new Game();
var timer;
var i = new Number(120);

function showTime(){
    if (i === 0){
        document.getElementById('timer').innerHTML = 'ding!';
        clearInterval(timer);
        game.Stop();
    } else {
        var min = (i - (i % 60))/60;
        var sec = i % 60;
        if (sec < 10){
            document.getElementById('timer').innerHTML = min + ":0" + sec;
        } else {
            document.getElementById('timer').innerHTML = min + ":" + sec;
        }
    }
    i--;
}
