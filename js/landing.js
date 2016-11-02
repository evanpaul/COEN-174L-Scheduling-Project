var session_id = "";
// Clever check for cookie
// Source: http://stackoverflow.com/questions/10730362/get-cookie-by-name
var value = "; " + document.cookie;
var parts = value.split("; " + "id" + "=");
if (parts.length == 2){
    var session_id = parts.pop().split(";").shift();
}
// If no cookie detected...
if(!session_id){
    $(document).keypress(function(e) {
        if(e.which == 13){ // 13 => enter
            session_id = $("#input").val();
            if(!session_id.match(/^[0-9a-z]{10}$/)){
                alert("The session ID you entered is not valid!");
                $("#input").val("");
            }else{
                reqObject = {"id": session_id};
                window.location = "index.html?id=" + session_id;
            }
            return false; // Prevents default behavior
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
