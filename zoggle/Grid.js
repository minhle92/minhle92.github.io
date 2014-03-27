// the Grid prototype allows for the representation of a 2D grid with 
// the given width and height as a 1D array, where the length of
// the array is the total of points on the grid (width * height), 
// and also as an undirected graph via an adjacency matrix.
// The grid prototype contains functionality for switching back and 
// forth between the array representation (where points are represented
// as indices of the array) and the grid represention (where points
// are represented as coordinates (x,y) where x = row and y = column. 
// This prototype does not contain functionality for filling the grid with data
// For the game, this is taken care of in the Board prototype 

function Grid(width, height) {
    this.height = height;
    this.width = width;
    this.size = width * height;
    //any prototype or program that uses the grid prototype is responsible
    //for population arrayRep with data
    this.arrayRep = new Array(width * height);
    this.adjList = new Array();
}

Grid.prototype.getCol = function(index){
	return index % this.width;
};

Grid.prototype.getRow =  function (index){
	return Math.floor(index/this.height);
};

Grid.prototype.toIndex =  function (row,col){
	return row * this.width + col;
};

Grid.prototype.isValidCoord =  function (row,col){
    return (row >= 0 && row < this.width && 
	    col >= 0 && col < this.height);
};


//helper function for Grid.setAdjList
//returns an array of indices of nodes adjacent to the node at the given index
Grid.prototype.getAdjNodes =  function (index){
    var row = this.getRow(index);
    var col = this.getCol(index);
    var neighbors = new Array();
    
    //check above neighbors (northwest, north, northeast)
    for(var i = 0; i < 3; i ++){
	if (this.isValidCoord(row - 1, col - 1 + i)){
	    neighbors.push(this.toIndex(row - 1, col - 1 + i));
	}
    }
    
    //check west neighbor
    if (this.isValidCoord(row , col - 1)){
	neighbors.push(this.toIndex(row, col - 1));
    }

    //check east neighbor
    if (this.isValidCoord(row, col + 1)){
	neighbors.push(this.toIndex(row, col + 1));
    }

    //check below neighbors (southwest, south, southeast)
    for(var i = 0; i < 3; i ++){
	if (this.isValidCoord(row + 1, col - 1 + i)){
	    neighbors.push(this.toIndex(row + 1, col - 1 + i));
	}
    }
    return neighbors;
};

//generates adjacency list representation of the grid
Grid.prototype.makeAdjList = function(){
    var adjlist = new Array();
    for (var i = 0; i < this.size; i++){
        adjlist.push(this.getAdjNodes(i));
    }
    this.adjList =  adjlist;
};

//returns all indices of the array representation of the grid which contains
//the given item
Grid.prototype.allIndicesOf =  function(item){
    var res = new Array();
    for (var i = 0; i < this.size; i++){
        if (this.arrayRep[i] === item){
            res.push(i);
        }
    }
    return res;
}; 
