var session_id = "";
// Clever check for cookie
// Source: http://stackoverflow.com/questions/10730362/get-cookie-by-name
console.log(document.cookie);
var value = "; " + document.cookie;
var parts = value.split("; " + "id" + "=");
if (parts.length == 2){
    var session_id = parts.pop().split(";").shift();
}
// If no cookie detected...
if(!session_id){
    console.log("No cookie :(");
    $(document).keypress(function(e) {
        if(e.which == 13){ // 13: enter
            session_id = $("#input").val();
            reqObject = {"id": session_id};

            window.location = "index.html?id=" + session_id;
            return false;
        }
    });
}else{
    console.log("Cookie found! Yum.");
    window.location = "index.html?id=" + session_id;
}
// Generate a new session with unique ID
// Unique ID generaton in JS source: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function generate(){
    var session = "";
    'xxxxxxxxxx'.replace(/x/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        session += v.toString(16); // Hexadecimal encoding
    });
    // Redirect
    window.location = "index.html?id=" + session;
}
