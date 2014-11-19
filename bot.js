/*MasterBot v1.4 [bigint]
 
By Get52, Bruno02468 and Randomguy_
- /me commands still need some work
- PLEASE EDIT THE HELP VARIABLE ACCORDINGLY IN CASE YOU CHANGE COMMANDS ~ Bruno

*/


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
        url : "http://bruno02468.com/spooks_bot/random.php",
        type : 'GET',
        success : function(data) { CLIENT.submit(data); }
    });
}

function getTitle(url) {
    
    var video_id = url.split('v=')[1];
    var ampersandPosition = video_id.indexOf('&');
    if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
    }
    
    $.ajax({
        url : "http://bruno02468.com/spooks_bot/youtube.php?id=" + video_id,
        type : 'GET',
        success : function(data) { CLIENT.submit("Title: " + data); }
    });
    
}

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

var botnick = "Masterbot"; 
botnick = prompt("What is my name?", "Masterbot");
botnick = botnick.toLowerCase();

if (botnick !== null) {
    CLIENT.submit("/nick " + botnick);
}
CLIENT.submit("/style default");

//Begin logging process and listen for commands

CLIENT.on('message', function(data) {
    var r = $('#messages').children().slice(-1)[0].outerHTML.search(/message (personal-message|general-message|error-message|note-message|system-message)/g);
    var text = data.message.trim();
    if (data.nick !== undefined)
    var name = data.nick.toLowerCase();
    if (name == botnick)
    spamFilters();
    if (name != botnick && r == -1 && text.search(/(!(masterbot|masters|toggle|random|checkem|coinflip|ask|help)|masterbot is now running\.)/gi) == -1 && text.length <= 175) {
            
        if (!text.contains("message action-message") && !text.contains("message spoken-message")) {
        var mseg = text;
        $.ajax({
            url : "http://bruno02468.com/spooks_bot/push.php?p=spooky&m=" + encodeURIComponent(mseg),
            type : 'GET',
            success : function(data) {console.log("Succesfully pushed to server"); }
        });
        }
        
    }
    
    if (name != botnick && !antiSpam && score < 6) {
        if (text.contains("!toggle")) {
            if (masters.contains(name)) {
                disabled = !disabled;
                if (!disabled)
                    CLIENT.submit("Masterbot has been enabled.");
            } else {
                CLIENT.submit("You do not have permission to toggle me.");
            }
        } else if (!disabled) {
            if (text.contains("!masters")) {
                var msg = "";
                for (var i = 0; i < masters.length - 2; i++)
                    msg += masters[i] + ", ";
                msg += masters[masters.length - 1];
                CLIENT.submit(msg);
            } else if (text.contains("!random")) {
                sendRandom();
            } else if (text.contains("!checkem")) {
                var rand = Math.floor(Math.random() * 90000) + 10000;
                CLIENT.submit("They see " + name + " rollin' " + rand + ", they hatin'!");
            } else if (text.contains("!coinflip")) {
                if (Math.random() < 0.5)
                    CLIENT.submit("Heads");
                else
                    CLIENT.submit("Tails");
            } else if (text.contains("!ask")) {
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
            } else if (text.contains("!help")) {
                CLIENT.submit(help);
            } else if (text.contains("watch?v=")) {
                getTitle(text);
            }
        }
    }
});

CLIENT.submit("/echo Masterbot is now running.");
