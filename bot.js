/*MasterBot v1.4 [bigint]
 
By Get52, Bruno02468 and Randomguy_

- /me commands still need some work
- PLEASE EDIT THE HELP VARIABLE ACCORDINGLY IN CASE YOU CHANGE COMMANDS ~ Bruno

*/

//Instantiating Bot
var disabled = false;
var masters = ["Bruno02468", "get52", "sammich", "Randomguy_"]; //bot's main controllers
var help = "I am Masterbot, original code by get52, revamped and messed with by Bruno02468 and Randomguy_!\n";
help += "Commands:\n";
help += "  !random: send a random message from the database filled with all logged messages.\n";
help += "  !checkem: roll a random 5-digit number.\n";
help += "  !coinflip: self-explanatory, I believe.\n";
help += "  !ask: Ask me a question!\n";
var antiSpam = false;
function spamFilters() {
    score++;
    antiSpam = true;
    setTimeout(function() {
        antiSpam = false;
    }, 650);
}
var score = 0;
setInterval(function() {
    if (score > 0) {
        score--;
    }
}, 8000);
function sendRandom() {//fetches a random message from the server and sends it
    $.ajax({
    url : "http://bruno02468.com/spooks_bot/random_message.php",
    type : 'GET',
    success : function(data) {              
        CLIENT.submit(data);
    },
    error : function(request,error)
    {
        alert("Request: "+JSON.stringify(request));
    }
});
}

var botnick = prompt("What is my name?", "Masterbot").toLowerCase();
if (botnick !== null)
CLIENT.submit("/nick " + botnick.toLowerCase());
CLIENT.submit("/style default");

//Begin logging process and listen for commands
CLIENT.on('message', function(data) {
    var str = $('#messages').children().slice(-1)[0];
    var r = str.outerHTML.search(/message (personal-message|general-message|error-message|note-message|system-message)/g);
    var t = str.outerHTML.indexOf("message action-message");
    var u = str.outerHTML.indexOf("message spoken-message");
    var text = data.message.trim();
    var nick = localStorage["chat-nick"];
    var name = data.nick;
    if (nick != botnick && r == -1 && text.search(/!(masterbot|masters|toggle|random|checkem|coinflip|ask|help)/gi) == -1 && text.length <= 175) {
            var mseg;
      if (t != -1) {
                mseg = "/me " + text;
            } else if (u != -1) {
                mseg = "/speak " + text;
            } else {
                mseg = text;
            }
         $.ajax({
    url : "http://bruno02468.com/spooks_bot/push.php?password=kekweed&message=" + encodeURIComponent(mseg),
    type : 'GET',
    success : function(data) {              
        console.log("Succesfully pushed to server");
    },
    error : function(request,error)
    {
        alert("Request: " + JSON.stringify(request));
    }
    });
    }
    if (name != botnick){
    if (!antiSpam && score < 6) {
        if (text.indexOf("!toggle") > -1) {
            if (masters.contains(name)) {
                disabled = !disabled;
                if (!disabled)
                    CLIENT.submit("Masterbot has been enabled.");
            } else {
                CLIENT.submit("You do not have permission to toggle me.");
            }
            spamFilters();
        } else if (!disabled) {
            if (text.indexOf("!masters") > -1) {
                var msg = "";
                for (var i = 0; i < masters.length - 2; i++)
                    msg += masters[i] + ", ";
                msg += masters[masters.length - 1];
                CLIENT.submit(msg);
                spamFilters();
            } else if (text.indexOf("!random") > -1) {
                sendRandom();
            } else if (text.indexOf("!checkem") > -1) {
                var rand = Math.floor(Math.random() * 90000) + 10000;
                CLIENT.submit("They see " + name + " rollin' " + rand + ", they hatin'!");
                spamFilters();

            } else if (text.indexOf("!coinflip") > -1) {
                if (Math.random() < 0.5)
                    CLIENT.submit("Heads");
                else
                    CLIENT.submit("Tails");
                spamFilters();
            } else if (text.indexOf("!ask") > -1) {
                switch (Math.floor(Math.random()*3)) {
                    case (0):
                        CLIENT.submit("No");
                        break;
                    case (1):
                        CLIENT.submit("Yes");
                        break;
                    case (2):
                        CLIENT.submit("Maybe");
                        break;
                    default: //Also covers unexpected results
                        CLIENT.submit("I don't know.");
                        break;
                }
                spamFilters();
            } else if (text.indexOf("!help") > -1) {
                CLIENT.submit(help);
                spamFilters();
            }
        }
    }
    }
});

// Displaying task completion status
console.log("Masterbot is now running.");
CLIENT.submit("/echo Masterbot is now running."); 
