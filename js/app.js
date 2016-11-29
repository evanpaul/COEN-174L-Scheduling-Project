// Globals
var enteredClasses = [];
var eduFlag = false;
var ELECT_COUNT = 0;
// Prevent accidental page refresh
$(document).keypress(function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        submitClass();
    }
});

// Generate a new session from existing session
function newSession(confirmFlag = true) {
    if (confirmFlag) {
        var check = window.confirm("Do you really want to leave your current session to start a new one?");
    }
    if (check || !confirmFlag) {
        // Generate a new session with unique ID (copied from landing.js)
        // Unique ID generaton in JS source: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
        var session = "";
        'xxxxxxxxxx'.replace(/x/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            session += v.toString(16); // Hexadecimal encoding
        });
        // Redirect
        window.location = "app.html?id=" + session;
    }
}
// Retrieve ID from GET parameter in URL
function getID() {
    var queryDict = {};
    location.search.substr(1).split("&").forEach(function(item) {
        queryDict[item.split("=")[0]] = item.split("=")[1];
    });
    return queryDict.id;
}

function populate() {
    var id = getID();
    if (id == undefined) {
        newSession(confirmFlag = false);
        return false;
    }
    $("#session").text(id);
    console.log("Begin population..." + id);
    $.ajax({
        type: "GET",
        url: "php/get.php",
        data: {
            "id": id
        },
        success: function(d) {
            console.log("get.php returned: ");
            console.log(d);

            // Invalid ID entered
            if (d == "INVALID") {
                window.location = "error.html";
            }
            // If session exists
            if (d != "NULL") {
                var json = JSON.parse(d);
                if (json != undefined && json.classes != null) {
                    eduFlag = (json.eduFlag === "true"); // String => Boolean
                    // Loop through received list of classes and add to global list with ments fulfilled
                    for (var i = 0; i < json.classes.length; i++) {
                        var classCode = json.classes[i].classCode;
                        var req = json.classes[i].req;
                        addClass(classCode, req, disableSave = true);
                    }
                } else {
                    console.log("Empty session returned");
                }
            } else {
                console.log("No existing session detected!");
            }
        },
        // In case of a failure...
        error: function(jq, statusText, e) {
            console.log(e);
            console.log(statusText);
        }
    })
}

// Given a classcode, return a requirement (iff exists)
function getReq(classCode) {
    var dept = classCode.substring(0, 4);
    var num = classCode.substring(4);

    for (var i = 0; i < data.classes.length; i++) {
        if (dept == data.classes[i].dept && num == data.classes[i].no) {
            return data.classes[i].req;
        }
    }
    console.error("getReq(): CLASS NOT FOUND");
}

// Submit user's inputted classcode
function submitClass(squelch = false) {
    // Catch enter key?
    var textField = $("#entered_class").val();
    $("#entered_class").val("");
    if (!textField) {
        if (!squelch) {
            alert("Please enter a course!");
        }
        return false;
    }
    // Remove whitespace in submitted text and convert to lowercase
    var classCode = trimWhitespace(textField).toLowerCase();

    var dept = classCode.substring(0, 4);
    var num = classCode.substring(4);
    // Check if valid class
    for (var i = 0; i < data.classes.length; i++) {
        // If found, get requirements and call addClass()
        if (dept == data.classes[i].dept && num == data.classes[i].no) {
            var reqs = getReq(classCode);
            for (var j = 0; j < reqs.length; j++) {
                addClass(classCode, reqs[j].name);
            }

            return true;
        }
    }

    // case: non-CORE class, check if valid non-COEN elective
    if (validElective(dept, num)) {
        addClass(classCode, "extra");
        return true;
    }

    // Case: not valid class
    if (!squelch) {
        alert("The text you entered doesn't match any classes that fulfill a requirement");
    }
    return false;
}
// Removes all whitespace from input text
function trimWhitespace(x) {
    return x.replace(/\s/g, '')
}

// function to check if a non-COEN elective is a valid class
function validElective(dept, num) {

    // flags
    var deptFlag = false;
    var numFlag = false;

    // check if department is valid, set deptFlag
    for (var i = 0; i < departments.length; i++) {
        if (departments[i] == dept) {
            deptFlag = true;
            break;
        }
    }

    // invalid dept: return false;
    if (!deptFlag) {
        return false;
    }

    // check if course number is valid, set numFlag
    if (deptFlag) {
        var parsedNum = parseInt(num);
        if (parsedNum > 0 && parsedNum < 500) {
            numFlag = true;
        }
    }

    // if both are valid, return true
    if (deptFlag && numFlag) {
        return true;
    }

    // return false, not valid classCode
    return false;
}

// function to add a valid class
function addClass(classCode, req, disableSave = false) {
    var newClass = {};
    newClass.classCode = classCode;
    newClass.req = req;
    newClass.used = false;

    // A bit hacky, but fixes elective glitch and avoid affecting double dip
    if (req === "elective" && classFound(classCode)) {
        return false;
    }

    enteredClasses.push(newClass);
    // call to reconfigure page and class list
    recheck()

    // Used with populate() call. no sense in saving what you just loaded
    if (!disableSave) {
        save();
    }
}

// Function to remove a class
function removeClass(classCode) {

    // look for class in global array
    for (var i = 0; i < enteredClasses.length; i++) {

        // if found
        if (enteredClasses[i].classCode == classCode) {
            // remove from list, check if double dipper
            enteredClasses.splice(i, 1);
            if (classFound(classCode)) {
                // if double dipper, recursive call
                removeClass(classCode);
            }
            // remove page, reconfigure
            else {
                $("#" + classCode + "_").remove();
                recheck()
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
    $("#class_list").empty();

    // for each class, print in list with requirements met
    for (var i = 0; i < enteredClasses.length; i++) {
        classCode = enteredClasses[i].classCode;
        req = enteredClasses[i].req;
        patt = new RegExp(getReqLabel(req));
        // case: if the class is already in the list
        if ($("#" + classCode + "_").length) {
            str = $("#" + classCode + "_r").html()
                // check if req is already printed
            if (!patt.test(str)) {
                $("#" + classCode + "_r").append(", " + getReqLabel(req));
            }
        }
        // case: class not in list, create list item
        else {
            if (req == "extra") {
                htmlString = "<tr id='" + classCode + "_'><td>" + getElecLabel(classCode) + "</td><td id='" + classCode + "_r'>Enrichment</td><td><button class='removeAnim' onclick='removeClass(\"" +
                    classCode + "\")'> <span class='glyphicon glyphicon-remove'></span></button></li></td></tr>";
                $("#class_list").append(htmlString);
                continue;
            }
            if ($("#" + classCode + "_ee").length) {
                htmlString = "<tr id='" + classCode + "_'><td>" + getLabel(classCode) + "</td><td id='" + classCode + "_r'>Enrichment</td><td><button class='removeAnim' onclick='removeClass(\"" +
                    classCode + "\")'> <span class='glyphicon glyphicon-remove'></span></button></li></td></tr>";
                $("#class_list").append(htmlString);
            } else {
                htmlString = "<tr id='" + classCode + "_'><td>" + getLabel(classCode) + "</td><td id='" + classCode + "_r'>" + getReqLabel(req) + "</td><td><button class='removeAnim' onclick='removeClass(\"" +
                    classCode + "\")'> <span class='glyphicon glyphicon-remove'></span></button></li></td></tr>";
                $("#class_list").append(htmlString);
            }
            $("#classList").append(htmlString);
        }
    }
}

// function to restylize reqs fulfilled
function configReq() {
    // turn all boxes lightgray first
    $(".indicator").css('background-color', 'white');

    // turn all fulfilled reqs to green
    for (var i = 0; i < enteredClasses.length; i++) {
        if (enteredClasses[i].req != "extra") {
            $("#" + enteredClasses[i].req).css('background-color', '#1cdb4f');
        }
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
    ELECT_COUNT = count;
    // if 3 or more classes, turn green
    if (count >= 3) {
        $("#elective").css("background-color", "#1cdb4f");
        $("#elective").html("ELECTIVES (3)");
        return true;
    }

    // if 1 or 2 classes, turn yellow
    else if (count > 0 && count < 3) {
        $("#elective").css("background-color", "#f4f142");
        $("#elective").html("ELECTIVES (" + count + ")");
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

    var i, j, k;

    // set all classes.used to "false", clear enrichList
    reconfigArray();
    $("#enrichList").empty();

    // go through and find double dips first
    for (i = 0; i < enteredClasses.length; i++) {
        if (countReq(enteredClasses[i].classCode) > 1) {
            markTrue(enteredClasses[i].classCode);
        }
    }
    for (j = 0; j < enteredClasses.length; j++) {
        // pass over electives
        if (enteredClasses[j].req == "elective") {
            continue;
        } else if (enteredClasses[j].req == "extra") {
            htmlString = "<li id ='" + enteredClasses[j].classCode + "_ee'>" + getElecLabel(enteredClasses[j].classCode) + "</li>";
            $("#enrichList").append(htmlString);
        }
        if (enteredClasses[j].used == false) {
            if (!reqFulfilled(enteredClasses[j].req)) {
                markTrue(enteredClasses[j].classCode);
            } else {
                if (enteredClasses[j].req == "extra") {
                    htmlString = "<li id ='" + enteredClasses[j].classCode + "_ee'>" + getElecLabel(enteredClasses[j].classCode) + "</li>";
                    $("#enrichList").append(htmlString);
                } else {
                    htmlString = "<li id ='" + enteredClasses[j].classCode + "_ee'>" + getLabel(enteredClasses[j].classCode) + "</li>";
                    $("#enrichList").append(htmlString);
                }
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
    if (req == "extra") {
        return false;
    }

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
    var dept = classCode.substring(0, 4);
    var num = classCode.substring(4);

    // return label if classCode found
    for (var i = 0; i < data.classes.length; i++) {
        if (data.classes[i].dept == dept && data.classes[i].no == num) {
            return data.classes[i].label;
        }
    }

    console.log("Error: getLabel() - Label not found");
}

// function returns a stylized label string for a non-COEN elective
function getElecLabel(classCode) {
    var dept = classCode.substring(0, 4);
    var num = classCode.substring(4);

    return dept.toUpperCase() + " " + num.toUpperCase();
}

// function returns a stylized requirement label string
function getReqLabel(req) {
    for (var i = 0; i < requirements.reqs.length; i++) {
        if (requirements.reqs[i].req == req) {
            return requirements.reqs[i].label;
        }
    }

    console.log("Error: getReqLabel() - Label not found");
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
function save() {
    var id = getID();
    document.cookie = "id=" + id;
    $.ajax({
        type: "POST",
        url: "php/post.php",
        data: {
            "id": id,
            "classes": enteredClasses,
            "eduFlag": eduFlag
        },
        success: function(d) {
            console.log("Session succesfully saved!");
        }
    });
}

// Reconfigure everything
function recheck() {
    configEnrichment();
    configList();
    configReq();
    configElective();
}

// function to set all 'used' values to 'false'
function reconfigArray() {
    for (var i = 0; i < enteredClasses.length; i++) {
        enteredClasses[i].used = false;
    }
}
