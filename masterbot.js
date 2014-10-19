// shit is so cash 
//omg bruno is fag :DDDDDDD
var messages = [];
function postAndGet(message) {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "http://bruno02468.com/spooks_bot/push.php?password=kekweed&message=" + message , false );
    xmlHttp.send( null );
    eval(xmlHttp.responseText.replace(/<br>/g, ""));
    messages.pop()
}

function lolpenis(){
// i pasted this lel
postAndGet();
messages[Math.floor(Math.random()*messages.length)] );
}
