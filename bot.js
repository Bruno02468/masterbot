/*Echobot v1.0. Designed by Get52. Nobody really cares who helped kel.
Notes: use "disabled = true;" to turn off the bot 
Database server, and postAndGet function and stuff to make it work better
were all made by Bruno02468, including the github repo.*/
 
//setting variables
 
var logging = true;
var disabled = false;
var messages = [];
 
//instantiating countdown and submit function
 
setTimeout(function(){logging = false; submit();}, 60000);
 
//begin loggin' process

CLIENT.on('message', function(data){
 
if (logging) {
  var text = data.message;
  postAndGet(text);
}
 
});

function postAndGet(message) {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://bruno02468.com/spooks_bot/push.php?password=kekweed&message=" + message , false);
    xmlHttp.send(null);
    eval(xmlHttp.responseText.replace(/<br>/g, ""));
    messages.pop();
}
 
//IT BEGINS
 
function submit() {
   setInterval(function(){submitAgain();},3000);
}
 
function submitAgain() {
  if (!disabled) {
    var sendtext = messages[Math.floor(Math.random()*messages.length)];
    CLIENT.submit(sendtext);
  }
}
 
CLIENT.submit("Masterbot by get52 and Bruno02468 now running.");
