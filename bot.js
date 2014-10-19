/*Echobot v1.0. Designed by Get52. Nobody really cares who helped kel.
Notes: use "disabled = true;" to turn off the bot 
Database server, and postAndGet function and stuff to make it work better
were all made by Bruno02468, including the github repo.*/
 
//setting variables

var logging = false;
var disabled = false;
var messages = [];

if (!logging) {
  CLIENT.submit("/nick Masterbot");
  CLIENT.submit("Masterbot by get52 and Bruno02468 now running.");
  loggin = true;
}
 
//instantiating countdown and submit function
 
setTimeout(function(){logging = false; submit();}, 60000);
 
//begin loggin' process

CLIENT.on('message', function(data){
  if (logging) {
     var text;
     if (data.message[0] !== "$") {
        text = data.message.slice(1);
     } else {
        text = data.message;
     }
     postAndGet(text);
     console.log("logged: <" + text + ">");
  }
});

function postAndGet(message) {
    if (message !== "Masterbot by get52 and Bruno02468 now running.") {
      var xmlHttp = null;
      xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", "http://bruno02468.com/spooks_bot/push.php?password=kekweed&message=" + encodeURIComponent(message) , false);
      xmlHttp.send(null);
      eval(xmlHttp.responseText.replace(/<br>/g, ""));
      messages.pop();
    }
}
 
//IT BEGINS
 
function submit() {
   setInterval(function(){ submitAgain();}, 15000);
}
 
function submitAgain() {
  if (!disabled) {
    var sendtext = messages[Math.floor(Math.random() * messages.length)];
    CLIENT.submit(sendtext);
  }
}
