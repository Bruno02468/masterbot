/* Masterbot by get52 and completely revamped by Bruno02468.
 * Run it using the run script on the GitHub repo to avoid need for updates.
 */

//Configuration variables

var threshold = 50; //Time in seconds between sending messages (default: 50)
var countdown = 60; //Time in seconds before the bot starts sending messages (default: 60)
var nick      = "Masterbot"; //Bot's nickname (default: Masterbot)
var masters   = ["Bruno02468", "get52", "sammich", "Randomguy"]; //Bot's main controllers, they are the only ones who can toggle the bot

//End of configuration variables


//Adding the contains utility functions

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

String.prototype.contains = function(obj) {
    return (this.indexOf(obj) > -1);
}

//Defining some variables

var logging = false;
var disabled = false;
var messages = [];

//Booting up

if (!logging) {
    CLIENT.submit("/nick " + nick);
    CLIENT.submit("Masterbot by get52 and Bruno02468 now running.");
    logging = true;
}
 
//Start countdown
 
setTimeout(function(){logging = false; submit();}, countdown * 1000);
 
//Begin logging process and listen for commands

CLIENT.on('message', function(data) {
    var text = data.message;
    
    if (data.message[0] !== "$") {
        text = data.message.slice(1);
    }
    var nick = data.nick;
    
    if (text.contains("!toggle")) {
        if (masters.contains(nick)) {
            disabled = !disabled;
            logging = !logging;
            if (disabled) {
                CLIENT.submit("Masterbot has been disabled.");
            } else {
                CLIENT.submit("Masterbot has been enabled.");
            }
        } else {
            CLIENT.submit("You do not have permission to do this, " + nick + ".");
        }
    } else if (text.contains("!masterbot")) {
        if (!disabled) {
            var sendtext = messages[Math.floor(Math.random() * messages.length)];
            CLIENT.submit(sendtext);
        } else {
            CLIENT.submit("I'm currently disabled, try again later.");
        }
    } else if (text.contains("!masters")) {
        var msg = "My masters are: ";
        for (var i = 0; i <= masters.length - 2; i++) {
            msg += masters[i] + ", ";
        }
        msg += "and " + masters[masters.length - 1] + ".";
        CLIENT.submit(msg);
    } else if (logging) {
        postAndGet(text);
        console.log("Logged to server: <" + text + ">");
    }
});

//Function that saves the message externally and updates the array

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
    setInterval(function(){ submitAgain();}, threshold * 1000);
}
 
function submitAgain() {
    if (!disabled) {
        var sendtext = messages[Math.floor(Math.random() * messages.length)];
        CLIENT.submit(sendtext);
    }
}
