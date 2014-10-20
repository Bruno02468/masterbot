/*MasterBot v1.4.[bigint]
 
Designed by Get52, Bruno02468 and Randomguy_
 
Notes:

- Use the run script on the GitHub repo please
- use "disabled = true;" to turn off the bot
- Changing your nick during usage may result in bot shutdown
- /me commands still need some work

~~~ PLEASE EDIT THE HELP VARIABLE ACCORDINGLY IN CASE YOU CHANGE COMMANDS
     ~ Bruno

*/

//Defining Variables
var logging = false;
var disabled = false;
var masters = ["Bruno02468", "get52", "sammich", "Randomguy_"]; //bot's main controllers
var canSend = false;
var score = 0;
var help = "I am Masterbot, original code by get52, revamped and messed with by Bruno02468 and Randomguy_!\n";
   help += "Commands:\n";
   help += " !random: send a random message from the growing database filled with stuff you all send.\n";
   help += "  !roll: roll a random 5-digit number.\n";
   help += "  !coinflip: self-explanatory, I believe.\n";
   help += "  !masters: lists who can control the bot.\n";
   help += "That's it, don't spam me or you're getting banned. :3";

//Configurating input
var lag = prompt("Enter the delay between logging and sending", "0") * 1000;
if (lag === null) {
    lag = 0;
}
var botnick = prompt("What is my name?", "Masterbot");
if (botnick !== null) {
    CLIENT.submit("/nick " + botnick.toLowerCase());
}
CLIENT.submit("/style default");
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
};

String.prototype.contains = function(obj) {
    return (this.toLowerCase().indexOf(obj) > -1);
};

//Begin logging process and listen for commands

CLIENT.on('message', function(data) {

    var str = $('#messages').children().slice(-1)[0];
    var r = str.outerHTML.search(/message (personal-message|general-message|error-message)/g);
    var t = str.outerHTML.indexOf("message action-message");
    var u = str.outerHTML.indexOf("message spoken-message");

    var text = data.message.trim();
    var nick = localStorage["chat-nick"];
    var name = data.nick;

    if (nick != (name || botnick) && r == -1 && text.search(/(!masterbot|!masters|!toggle|!random|!roll|!coinflip)/gi) == -1) {
        if (text.length <= 175) {
            var mseg;
            if (t != -1) {
                mseg = "/me " + text;
            } else if (u != -1) {
                mseg = "/speak " + text;
            } else {
                mseg = text;
            }
            saveOut(mseg);
            //console.log('"' + text + '" has been logged');
        }
        /*else {
                    console.log("that was too long4me. Not logged (length > 200)");
                } */
    }
    if (!antiSpam) {
        if (text.contains("!toggle")) {
            if (masters.contains(name) || name == nick) {
                reverseVars();
                if (!disabled)
                    CLIENT.submit("Masterbot has been enabled.");
            } else {
                CLIENT.submit("You do not have permission to toggle me.");
            }
            spamFilters();

        } else if (text.contains("!masters")) {
            var msg = "My masters are: ";
            for (var i = 0; i < masters.length - 2; i++) {
                msg += masters[i] + ", ";
            }
            msg += "and " + masters[masters.length - 1] + ".";
            CLIENT.submit(msg);
            spamFilters();
        } else if (canSend) {
            if (text.contains("!random") && messages.length > 0) {
                sendRandom();
                
            } else if (text.contains("!roll")) {
                var rand = Math.floor(Math.random() * 90000) + 10000;
                CLIENT.submit("They see " + name + " rollin' " + rand + ", they hatin'!");
                spamFilters();

            } else if (text.contains("!coinflip")) {
                var yes = (Math.random() < 0.5);
                if (yes) {
                    CLIENT.submit("Heads");
                } else {
                    CLIENT.submit("Tails");
                }
                spamFilters();

            } else if (text.contains("!help")) {
                CLIENT.submit(help);
                spamFilters();

            }
        }
    }
});

function reverseVars() {
    disabled = !disabled;
    logging = !logging;
}

//Only saves externally, prints nothing

function saveOut(message) {
    $.ajax({
        url: "http://bruno02468.com/spooks_bot/push.php?password=kekweed&message=" + encodeURIComponent(message),
        type: 'GET',
        success: function() {
            
        }
    });
}

//Fetches a random message from my server and sends it

function sendRandom() {
    var request = null;
    request = new XMLHttpRequest();
    request.open("GET", "http://bruno02468.com/spooks_bot/random_message.php", false);
    request.send(null);
    var msg = request.responseText;
    CLIENT.submit(msg);
    console.log("function called and responde text was " + msg);
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

console.log("Masterbot is now running.");
CLIENT.submit("/echo Masterbot is now running.");
