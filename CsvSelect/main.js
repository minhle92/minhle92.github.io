//TODO: 
//implement close drop down menu by clicking outside of menu
//produce csv file that user can download
//error check for empty csv file
//tolerate spaces/invalid characters in entries

//helper functions

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "/": '&#x2F;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>\/]/g, function (s) {
            return entityMap[s];
        });
};

//given a target array, deletes the item from the target array
function ArrayDelete(target, item) {
    var itemIndex = target.indexOf(item);
    if (itemIndex >= 0) {
        var front = target.slice(0, itemIndex);
        return front.concat(target.slice(itemIndex + 1, target.length)); 
    };
    return;
}

//given a target array, deletes the item at the specified index from the array
function ArrayDeleteIdx(target, itemIndex) {
    if (itemIndex >= 0) {
        var front = target.slice(0, itemIndex);
        return front.concat(target.slice(itemIndex + 1, target.length)); 
    };
    return;
}

//given a string formatted in csv format, converts the string into a 
//2D array according to the csv format
function csvToArray(csvStr) {
    //replace all spaces in entries with underscores
    var csvStrOk = csvStr.replace(/ /g,"_");
    csvStrOk = csvStrOk.replace(/\'/g,"");
    csvStrOk = csvStrOk.replace(/\"/g,"");
    csvStrOk = escapeHtml(csvStrOk);
    var rows = csvStrOk.split("\r");

    for (var i = 0; i < rows.length; i++) {
        console.log("row ", i, " before split: ", rows[i]);
        if (rows[i] === ""){
            ArrayDeleteIdx(rows, i);
        } else {
            rows[i] = (rows[i]).split(",");
        }
    };
    var res = new Object();
    res.Array = rows;
    res.Height = rows.length;
    res.Width = rows[0].length;
    return res;
};

//given an 2D array with associate height and width
//generates an HTML table with the contents of the 2D 
//array and adds it to the DOM tree
function ArrayToTable (input, height, width) {
    console.log("converting csv array into HTML table");
    //prepare header row
    for (var i = 0; i < width; i++){
        input[0][i] = 
            '<td class = "header"> <div id = "' + input[0][i] +
            '" class = "headerCell"> ' + input[0][i] + ' </div> </td>';
    };
    
    var displayStr = 
        ('<tr id = "headerrow">').concat(input[0].toString()," </tr>");
    console.log("header row converted");
    //prepare remaining rows
    for (var i = 1; i < height; i++) {
        for (var j = 0; j < width; j++) {
            input[i][j] = 
                "<td> <div class = cell> " + input[i][j] + "</div> </td>";
        };
        displayStr = displayStr.concat((['<tr class = "normalrow", id = "row' + (new Number(i)).toString() + '">'].concat(input[i], ["</tr>"])).toString(" "));
        console.log("row ", i, "converted");
    };
    console.log("csv file converted to HTML table");
    $('#Table').append(displayStr);    
};

//the CSVData object contains a (string -> (string -> int array) map ) map
//whose keys are the header of columns in the csv file and the values
//are themselves maps whose keys are properties that appear in the column
//and whose values are the row numbers in which those attributes appear.
function CsvData (height, headers){
    //headerMap: keys are strings, values are (string -> int array) maps
    this.HeaderMap = new Object();

    //a map containing headers and their associated selected attributes
    this.SelectedAttrs = new Object();

    //the Add method adds the key value pair to the headerMap field
    this.Add = function (key, value) {
        this.HeaderMap[key] = value;
    };

    this.Select = function (header, attr) {
        if (this.SelectedAttrs.hasOwnProperty(header)) {
            (this.SelectedAttrs[header]).push(attr);
        } else {
            this.SelectedAttrs[header] = [attr];
        };
    };

    this.Unselect = function (header, attr) {
        if (this.SelectedAttrs.hasOwnProperty(header)) {
            var attrs = this.SelectedAttrs[header];
            var attrIndex = attrs.indexOf(attr);
            //delete given attribute from list of selected attributes
            if ( attrIndex >= 0) {
                this.SelectedAttrs[header] = ArrayDelete(attrs, attr);
            };
        };
    };

    this.GetSelectedRows = function() {
        var selectedRows = new Array();
        for (header in this.SelectedAttrs) {
            if (this.SelectedAttrs.hasOwnProperty(header)){
                var attrs = this.SelectedAttrs[header];
                for (var i = 0; i < attrs.length; i++) {
                    var rows = this.HeaderMap[header][(attrs[i])];
                    for (var j = 0; j < rows.length; j++){
                        if (selectedRows.indexOf(rows[j]) === -1) {
                            selectedRows.push(rows[j]);
                        };
                    };
                };
            };
        };
        return selectedRows;
    };

    this.HighlightSelected = function () {
        var rows = this.GetSelectedRows();
        for (var i = 1; i < height; i++) {
            $('#row' + (new Number(i)).toString()).css("background-color","#FAFEFF");
        };

        for (var i = 0; i < rows.length; i++) {
            $('#row' + rows[i]).css("background-color", "#FFFAE6");
        };
        
    };

    this.DisplaySelected = function() {
        var unselected = new Array();
        var selected = this.GetSelectedRows();
        for (var i = 1; i < height; i++) {
            if (selected.indexOf(i) === -1) {
                unselected.push(i);
            };
        };
        //remove unselected rows from the DOM
        for (var i = 0; i < unselected.length; i++){
            $('#row' + (new Number(unselected[i])).toString()).remove();
        };

        $('#selectRows').hide();
        //remove menus
        for (var i = 0; i < headers.length; i++){
            $('#' + headers[i]).unbind();
        };
    };
};

//the CSVSelect object contains the CSVFile object and a CSVData object
//corresponding the given csv file. 
//the Display method displays the csv file as an HTML table on the browser
function CsvSelect (file) {
    var csvArray = csvToArray(file);
    console.log("csv file converted into 2D array");
    this.Array2D = csvArray.Array;
    this.Height = csvArray.Height;
    this.Width = csvArray.Width;
    
    this.MapRep = new CsvData(this.Height, this.Array2D[0]);

    //initialize maprep.HeaderMap
    for (var i = 0; i < this.Width; i++) {
        var header = this.Array2D[0][i];
        var headerObj = new Object();
        for (var j = 1; j < this.Height; j++){
            var attr = this.Array2D[j][i];
            if (headerObj.hasOwnProperty(attr)) {
                headerObj[attr].push(j);
            } else {
                headerObj[attr] = [j];
            }
        };
        this.MapRep.Add(header, headerObj);
    };

    //helper function for created a menu given an array of options 
    //and an html ID (string) for the menu
    function MakeMenu(header, options, leftPos, topPos){
        console.log("MakeMenu -header: ", header);
        console.log("MakeMenu -options: ", options);
        var id = header + 'Menu';
        var menuDiv = $('<div class = "menu", id = ' + id 
                        + '> <ul id = ' + id + 'Options> </ul> </div>');
        $('body').append(menuDiv);
        $('#' + id).hide();
        $('#' + id).css("z-index", "2");
        $('#' + id).css("position", "absolute");
        $('#' + id).css("top", topPos + 'px');
        $('#' + id).css("left", leftPos + 'px');

        
        //add options to menu div
        var optionsStr = "";
        for (var i = 0; i < options.length; i++){
            optionsStr = optionsStr.concat('<li> <input type="checkbox", id="',
                                     id, 
                                     options[i],
                                     '", value="', 
                                     options[i],  
                                     '"> ', 
                                     options[i],
                                     '</li>');
                                                                 
        };
        optionsStr = optionsStr.concat('<li> <button id = "' + 
                                 id + 'Hide"> Close </button> </li>');
        $('#' + id + 'Options').append(optionsStr);
        $('#' + id + 'Hide').on('click', function(event){
                $('#' + id).hide();
            });
        
        for (var i = 0; i < options.length; i++) {
            $('#' + id + options[i]).on('click', function(event) {
                    var state = document.getElementById(event.target.id);
                    if (state.checked) {
                        csvselect.MapRep.Select(header, event.target.value);
                    } else {
                        csvselect.MapRep.Unselect(header, event.target.value);
                    };
                    csvselect.MapRep.HighlightSelected();
                });
            console.log("MakeMenu here 1");
        }; 
    };
    
    this.Display = function () {
        //clone this.Array2D into displayArray because ArrayToTable modifies
        //the array that is passed in
        var displayArray = new Array();
        for (var i = 0; i < this.Height; i++){
            displayArray.push(((this.Array2D[i]).slice()));
        };
        
        console.log("converting csv array into html table");
        ArrayToTable(displayArray, this.Height, this.Width);
        
        
        //create dropdown menus for each header in csv file
        // with the appropriate event handlers
        console.log("creating drop down menus");
        for (var i = 0; i < this.Width; i++){
            var header = this.Array2D[0][i];
            console.log("header: ", header);
            var attrMap = this.MapRep.HeaderMap[header];
            var attrArray = new Array();
            for (attr in attrMap) {
                if (attrMap.hasOwnProperty(attr)) {
                    attrArray.push(attr);
                };
            };
            var coordinates = $('#' + header).offset();
            console.log ("header : ", header, "coordinates: ", coordinates);
            var leftPos = (coordinates.left - 2).toString();
            var topPos = 
                (coordinates.top + $('#' + header).height() + 6).toString();
            MakeMenu(header, attrArray, leftPos, topPos);

            $('#' + header).bind('click', function(event) {
                    if (openMenuId !== "") {
                        $(openMenuId).hide();
                    };
                    $('#' + event.target.id + 'Menu').show();
                    openMenuId = '#' + event.target.id + 'Menu';
                });
        };
        console.log("drop down menus created");
        $('#Table').show();
    };
}

var openMenuId = "";
var csvselect = undefined;

document.getElementById("fileInput").addEventListener('change', function (e) {
        var file = fileInput.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
            console.log("document loaded");
            $('#upload').css("display", "none");
            csvselect = new CsvSelect((new String(reader.result)));
            console.log("CsvSelect object created");
            $('#selectRows').on('click', function(event){
                    csvselect.MapRep.DisplaySelected();
                });
            $('#selectRows').css("display", "block");
            csvselect.Display();
        
        };
        
        reader.readAsText(file);        
    });


