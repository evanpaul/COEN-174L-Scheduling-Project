// Globals
var enteredClasses = [];
var eduFlag = false;
// Prevent accidental page refresh
$(document).keypress(function(event){
    if(event.keyCode == 13){
        event.preventDefault();
        submitClass();
    }
});

// Generate a new session from existing session
function newSession(confirmFlag=true){
    if(confirmFlag){
        var check = window.confirm("Do you really want to leave your current session to start a new one?");
    }
    if(check || !confirmFlag) {
        // Generate a new session with unique ID (copied from landing.js)
        // Unique ID generaton in JS source: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
        var session = "";
        'xxxxxxxxxx'.replace(/x/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            session += v.toString(16); // Hexadecimal encoding
        });
        // Redirect
        window.location = "index.html?id=" + session;
    }
}
// Retrieve ID from GET parameter in URL
function getID(){
    var queryDict = {};
    location.search.substr(1).split("&").forEach(function(item){
        queryDict[item.split("=")[0]] = item.split("=")[1];
    });
    return queryDict["id"];
}
function populate(){
    var id = getID();
    if(id == undefined){
        newSession(confirmFlag=false);
        return false;
    }
    $("#session").text(id);
    console.log("Begin population..." + id);
    $.ajax({
        type:"GET",
        url: "php/get.php",
        data: {"id": id},
        success: function(d){
            console.log("get.php returned: ");
            console.log(d);

            // Invalid ID entered
            if(d == "INVALID"){
                window.location = "error.html";
            }
            // If session exists
            if(d != "NULL"){
                var json = JSON.parse(d);
                if(json != undefined && json.classes != null){
                    eduFlag = (json.eduFlag === "true"); // String => Boolean
                    // Loop through received list of classes and add to global list with requirements fulfilled
                    for (var i = 0; i < json.classes.length; i++){
                        var classCode = json.classes[i].classCode;
                        var req = json.classes[i].req;
                        addClass(classCode, req, disableSave=true);
                    }
                }else{
                    console.log("Empty session returned");
                }
            }else{
                console.log("No existing session detected!");
            }
        },
        // In case of a failure...
        error: function(jq, statusText, e){
            console.log(e);
            console.log(statusText);
        }
    })
}
// Given a classcode, return a requirement (iff exists)
function getReq(classCode){
    var dept = classCode.substring(0,4);
    var num = classCode.substring(4);

    for(var i = 0; i < data.classes.length; i++){
        if(dept == data.classes[i].dept && num == data.classes[i].no){
            return data.classes[i].req;
        }
    }
    console.error("getReq(): CLASS NOT FOUND");
}

// Submit user's inputted classcode
function submitClass() {
  // Catch enter key?
  var textField = $("#entered_class").val();
  $("#entered_class").val("");
  if(!textField) {
      alert("Please enter a course!");
      return false;
  }
  // Remove whitespace in submitted text and convert to lowercase
  var classCode = trimWhitespace(textField).toLowerCase();

  var dept = classCode.substring(0,4);
  var num = classCode.substring(4);
  // Check if valid class
  for(var i = 0; i < data.classes.length; i++) {
    // If found, get requirements and call addClass()
    if(dept == data.classes[i].dept && num == data.classes[i].no) {
        var reqs = getReq(classCode);
        for (var j = 0; j < reqs.length; j++) {
          addClass(classCode, reqs[j].name);
        }

        return true;
    }
  }
  // Case: not valid class
  alert("The text you entered doesn't match any classes that fulfill a requirement");
  return false;
}
// Removes all whitespace from input text
function trimWhitespace(x) {
    return x.replace(/\s/g,'')
}

function addClass(classCode, req, disableSave=false) {
  var newClass = {};
  newClass.classCode = classCode;
  newClass.req = req;
  newClass.used = false;
  enteredClasses.push(newClass);

  // call to reconfigure page and class list
  configEnrichment();
  configList();
  configReq();
  configElective();

  // Used with populate() call. no sense in saving what you just loaded
  if(!disableSave){
      save();
  }
}

// Function to remove a class
function removeClass(classCode) {

  // look for class in global array
  for (var i = 0; i < enteredClasses.length; i++) {

    // if found
    if (enteredClasses[i].classCode == classCode) {
        console.log("Found class");
      // remove from list, check if double dipper
      enteredClasses.splice(i, 1);
      if (classFound(classCode)) {
          console.log("Double dipper");
        // if double dipper, recursive call
        removeClass(classCode);
      }
      // remove page, reconfigure
      else {
        $("#"+classCode+"_").remove();
        configEnrichment();
        configList();
        configReq();
        configElective();
      }
      save();
    }
  }
}

// function to reprint the list of entered classes
// and the requirements they fulfill on the page
function configList() {

  var classCode;
  var patt;
  var res;
  var str, htmlString;

  // clear classList and restart
  $("#classList").empty();

  // for each class, print in list with requirements met
  for (var i = 0; i < enteredClasses.length; i++) {
    classCode = enteredClasses[i].classCode;
    req = enteredClasses[i].req;
    console.log(classCode, req);
    patt = new RegExp(req);
    // case: if the class is already in the list
    if ($("#"+classCode+"_").length) {
      str = $("#"+classCode+"_r").html()
      // check if req is already printed
      if (!patt.test(str)) {
        $("#"+classCode+"_r").append(", "+req);
      }
    }
    // case: class not in list, create list item
    else {
      if ($("#"+classCode+"_ee").length) {
        var htmlString = "<tr id='"+classCode+"_'><td>"+getLabel(classCode)+"</td><td id='"+classCode+"_r'>Enrichment</td><td><button onclick='removeClass(\""
        +classCode+"\")'> <span class='glyphicon glyphicon-remove'></span></button></li></td></tr>";
        $("#class_list").append(htmlString);
      }
      else {
          var htmlString = "<tr id='"+classCode+"_'><td>"+getLabel(classCode)+"</td><td id='"+classCode+"_r'>"+enteredClasses[i].req+"</td><td><button onclick='removeClass(\""
          +classCode+"\")'> <span class='glyphicon glyphicon-remove'></span></button></li></td></tr>";
          $("#class_list").append(htmlString);
      }
      $("#classList").append(htmlString);
    }
  }
}

// function to restylize reqs fulfilled
function configReq() {
    console.log("configReq");
  // turn all boxes lightgray first
  $(".indicator").css('background-color', 'white');

  // turn all fulfilled reqs to green
  for (var i = 0; i < enteredClasses.length; i++) {
    $("#"+enteredClasses[i].req).css('background-color', '#1cdb4f');
  }
}

// function to determine COEN elective status
function configElective() {

  var count = 0;
  for (var i = 0; i < enteredClasses.length; i++) {
    if (enteredClasses[i].req == "elective") {
      count++;
    }
  }

  // if 3 or more classes, turn green
  if (count >= 3) {
    $("#elective").css("background-color", "#1cdb4f");
    $("#elective").html("ELECTIVES (3)");
    return true;
  }

  // if 1 or 2 classes, turn yellow
  else if (count > 0 && count < 3) {
    $("#elective").css("background-color", "#f4f142");
    $("#elective").html("ELECTIVES ("+count+")");
  }

  // no classes
  else {
    $("#elective").css("background-color", "white");
    $("#elective").html("ELECTIVES (0)");
  }
}

// function to reconfigure Educational Enrichment options list
// classes that aren't being used towards a req fit here
function configEnrichment() {

  var i, j;

  // set all classes.used to "false", clear enrichList
  reconfigArray();
  $("#enrichList").empty();


  // go through and find double dips first
  for (i = 0; i < enteredClasses.length; i++) {
    if (countReq(enteredClasses[i].classCode) > 1) {
      markTrue(enteredClasses[i].classCode);
    }
  }
  console.table(enteredClasses);
  for (j = 0; j < enteredClasses.length; j++) {
    console.log(j, enteredClasses[j]);
    // pass over electives
    if (enteredClasses[j].req == "elective") {
      continue;
    }
    if (enteredClasses[j].used == false) {
        if (!reqFulfilled(enteredClasses[j].req)) {
          markTrue(enteredClasses[j].classCode);
        }
        else {
          htmlString = "<li id ='"+enteredClasses[j].classCode+"_ee'>" + getLabel(enteredClasses[j].classCode) + "</li>";
          $("#enrichList").append(htmlString);
        }
    }
  }
}

// function to make class as used in global array
function markTrue(classCode) {
  for (var i = 0; i < enteredClasses.length; i++) {
    if (enteredClasses[i].classCode == classCode) {
      enteredClasses[i].used = true;
    }
  }
}

// function returns whether a req is being fulfilled by a class
function reqFulfilled(req) {
  for (var i = 0; i < enteredClasses.length; i++) {
    if (enteredClasses[i].req == req && enteredClasses[i].used == true) {
      return true;
    }
  }
  return false;
}

// function returns the number of reqs a class fulfills
function countReq(classCode) {
  var count = 0;
  for (var i = 0; i < enteredClasses.length; i++) {
    if (enteredClasses[i].classCode == classCode) {
      count++;
    }
  }
  return count;
}

// function returns the 'label' attribute from the data object
function getLabel(classCode) {
  var dept = classCode.substring(0,4);
  var num = classCode.substring(4);

  // return label if classCode found
  for (var i = 0; i < data.classes.length; i++) {
    if (data.classes[i].dept == dept && data.classes[i].no == num) {
      return data.classes[i].label;
    }
  }

  console.log("Error: countReq() - Label not found");
}

// Is the requirement present in the global list?
function reqFound(req) {
  var i;
  for (i = 0; i < enteredClasses.length; i++) {
    if (enteredClasses[i].req == req) {
      return true;
    }
  }
  return false;

}
// Is the class present in the global list?
function classFound(classCode) {
  var i;
  for (i = 0; i < enteredClasses.length; i++) {
    if (enteredClasses[i].classCode == classCode) {
        return true;
    }
  }
  return false;
}

// POST classes to JSON file via AJAX
function save(){
    var id = getID();
    document.cookie = "id="+id;
    $.ajax({
        type:"POST",
        url: "php/post.php",
        data: {"id": id, "classes": enteredClasses, "eduFlag": eduFlag},
        success: function(d){
            console.log("Session succesfully saved!");
        }
    });
}

// function to set all 'used' values to 'false'
function reconfigArray() {
  for (var i = 0; i < enteredClasses.length; i++) {
    enteredClasses[i].used = false;
  }
}
