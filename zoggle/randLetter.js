//customRand: key: int associative array -> object
//given a distribution, initializes an object with function that will 
//randomly return an element based on the distribution
function customRand (dist) {
    this.table = new Object();
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
        var randVal = Math.floor(Math.random() * (start + 1));
        return table[randVal];
    }
}


function RandLetter() {
    //probability distribution that a specific letter will show up on the grid
    //over 100 events
    var letterDist = 
        {"e": 3,
         "t": 7,
         "a": 3,
         "o": 3,
         "i": 2,
         "n": 7, 
         "s": 7,
         "h": 7,
         "r": 6,
         "d": 6,
         "l": 5,
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
         "x": 2,
         "q": 2,
         "z": 2};
    
    //probability distribution that a specific vowel will show up on the grid
    //over 100 events

    var vowelDist = 
        { "a": 23, 
          "e": 23,
          "o": 17, 
          "i": 17, 
          "u": 13, 
          "y": 8};

    this.getRandLetter = new customRand(letterDist);
    this.getRandVowel = new customRand(vowelDist);
}