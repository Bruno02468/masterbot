/*MasterBot v1.3.[bigint]
 
Designed by Get52, Bruno02468 and Randomguy_
 
Notes:

- Use the run script on the GitHub repo please
- use "disabled = true;" to turn off the bot
- Changing your nick during usage may result in bot shutdown
- /me commands still need some work
 
Updates:

- Perfect for keks!
- That's it.
 
*/

//Defining Variables
var logging = false;
var disabled = false;
var masters = ["Bruno02468", "get52", "sammich", "Randomguy_"]; //bot's main controllers
var messages = [];
var canSend = false;
var score = 0;

//Configurating input

var lag = prompt("Enter the delay between logging and sending", "60") * 1000;
var botnick = prompt("What is my name?", "Masterbot");
if (botnick !== null) {
    CLIENT.submit("/nick " + botnick);
}
setTimeout(function() {
    canSend = true;
    console.log(">> Sending has now been enabled.");
}, lag);

//Adding the .contains utility functions

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

//Begin logging process and listen for commands

var k = 0;
CLIENT.on('message', function(data) {

    var str = $('#messages').children().slice(-1)[0];
    var r = str.outerHTML.search(/message (personal-message|general-message|error-message)/g);
    var t = str.outerHTML.indexOf("message action-message");
    var u = str.outerHTML.indexOf("message spoken-message");

    var text = data.message.trim();
    var nick = localStorage["chat-nick"];
    var name = data.nick

    if (nick != name && r == -1 && !text.contains("!masterbot" || "!masters" || "!toggle")) {
        if (text.length <= 175) {
            if (t != -1) {
                messages[k] = "/me " + text;
            } else if (u != -1) {
                messages[k] = "/speak " + text;
            } else {
                messages[k] = text;
                console.log('"' + text + '" has been logged');
            }
            postAndGet(messages[k]);
            k++;
        } else {
            console.log("that was too long4me. Not logged (length > 200)");
        }
    }
    if (text.contains("!toggle")) {
        if (masters.contains(nick)) {
            reverseVars();
            if (!disabled)
                CLIENT.submit("Masterbot has been enabled.");
            spamFilters();
        } else {
            CLIENT.submit("You do not have permission to toggle me.");
            spamFilters();
        }
    } else if (text.contains("!masterbot") && canSend && !antiSpam) {
        var random = Math.floor(Math.random() * Object.keys(messages).length);
        var sendtext = messages[random];
        CLIENT.submit(sendtext);
        spamFilters();
    } else if (text.contains("!masters")) {
        var msg = "My masters are: ";
        for (var i = 0; i < masters.length - 2; i++) {
            msg += masters[i] + ", ";
        }
        msg += "and " + masters[masters.length - 1] + ".";
        CLIENT.submit(msg);
        spamFilters();
    }
});

function reverseVars() {
    disabled = !disabled;
    logging = !logging;
}

//External saving

function postAndGet(message) {
    $.ajax({
        url: "http://bruno02468.com/spooks_bot/push.php?password=kekweed&message=" + encodeURIComponent(message),
        type: 'GET',
        success: function(text) {
            eval(text.replace(/<br>/g, ""));
        }
    });
}

//Antispam functions

var antiSpam = false;

function spamFilters() {
    score++;
    antiSpam = true;
    setTimeout(function() {
        antiSpam = false;
    }, 650);
}

setInterval(function() {
    if (score > 0) {
        score--;
    }
}, 8000);

console.log("I am running.");
