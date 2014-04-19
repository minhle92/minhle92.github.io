//customRand: key: int associative array -> object
//given a distribution, initializes an object with function that will 
//randomly return an element based on the distribution
function customRand (dist) {
    var table = new Array();
    var start = 0;
    for (var key in dist) {
        if (dist.hasOwnProperty(key)) {
            var weight = dist[key];
            for (var i = start; i < start + weight;i++) {
                table[i] = key;
            }
            start += weight;
        }
    }

    this.get = function () {
        var randVal = Math.floor(Math.random() * (start - 1));
        return table[randVal];
    }
}


function RandLetter() {
    //probability distribution that a specific letter will show up on the grid
    //over 100 events
    var letterDist = 
        {"e": 3,
         "t": 8,
         "a": 3,
         "o": 3,
         "i": 2,
         "n": 8, 
         "s": 7,
         "h": 7,
         "r": 6,
         "d": 6,
         "l": 6,
         "c": 5,
         "u": 1,
         "m": 5,
         "w": 4,
         "f": 4,
         "g": 4,
         "y": 1,
         "p": 3,
         "v": 3,
         "b": 3,
         "k": 3,
         "j": 2,
         "x": 1,
         "q": 1,
         "z": 1};
    
    //probability distribution that a specific vowel will show up on the grid
    //over 100 events

    var vowelDist = 
        { "a": 22, 
          "e": 23,
          "o": 17, 
          "i": 17, 
          "u": 13, 
          "y": 8};

    this.getRandLetter = new customRand(letterDist).get;
    this.getRandVowel = new customRand(vowelDist).get;
}
