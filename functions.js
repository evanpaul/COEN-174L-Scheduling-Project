var enteredClasses = [];

function addClass (classcode, req) {

  var newClass = {"classcode" : classcode, "req" : req};
  enteredClasses.push(newClass);
  console.log($("#"+req));
  $("#"+req).css("background-color", "#00FF00");
}

function removeClass(classcode) {
  var i;
  var checkreq;
  for (i = 0; i < enteredClasses.length; i++) {
    if (enteredClasses[i].classcode == classcode) {
      checkreq = enteredClasses[i].req;
      //delete enteredClasses[i]; //!
      enteredClasses.splice(i, 1);
      if (!reqFound(checkreq)) {
        $("#"+checkreq).css("background-color", "lightgray");
      }
    }
  }
}


function reqFound(req) {

  var i;
  console.log("HEY",enteredClasses);
  for (i = 0; i < enteredClasses.length; i+=1) {
    console.log(enteredClasses[i].req);
    if (enteredClasses[i].req == req) {
      return true;
    }
  }
  return false;

}

function classFound(classcode) {

  var i;
  for (i = 0; i < enteredClasses.length; i+=1) {
    if (enteredClasses[i].classcode == classcode) {
      return true;
    }
  }
  return false;
}
