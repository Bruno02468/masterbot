/*MasterBot v1.[bigint]
 
    By Get52, Bruno02468 and Randomguy_
    - /me commands still need some work
    - PLEASE EDIT THE HELP VARIABLE ACCORDINGLY IN CASE YOU CHANGE COMMANDS ~ Bruno

*/


var disabled = false;
var masters = ["Bruno02468", "sammich", "Randomguy_", "Mr. Guy"]; //bot's main controllers

var help = "I am Masterbot, original code by get52, completely revamped by Bruno02468 and Randomguy_!\n";
    help += "Commands:\n";
    help += "  !random: Send a random message from the database filled with all logged messages.\n";
    help += "  !checkem: Roll a random 5-digit number.\n";
    help += "  !coinflip: Self-explanatory, I believe.\n";
    help += "  !ask: Ask me a yes/no question\n";
    help += "  !count: See the number of questions in the database.\n";

var antiSpam = false;
function spamFilters() { // increment spam score
    score++;
    antiSpam = true;
    setTimeout(function() {
        antiSpam = false;
    }, 650);
}

var score = 0;
setInterval(function() { // decrement spam score
    if (score > 0) {
        score--;
    }
}, 8000);

setInterval(function() { // clear the screen every hour
    CLIENT.submit("/clear");
}, 3600000);

function send(text) {
    CLIENT.submit(text);
    spamFilters();
}


String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

var botnick = "Masterbottle"; 
var prm = prompt("What should my name be?", "Masterbottle");

if (prm !== null) {
    botnick = prm;
    CLIENT.submit("/nick " + botnick);
}

CLIENT.submit("/style default");
CLIENT.submit("/flair $Montserrat|#808080" + botnick);


//Begin logging process and listen for commands

CLIENT.on('message', function(data) {
    var r = $('#messages').children().slice(-1)[0].outerHTML.search(/message (personal-message|general-message|error-message|note-message|system-message)/g);
    var text = data.message.trim();
    if (data.nick !== undefined)
    var name = data.nick.toLowerCase();
    
    if (name != botnick && r == -1 && text.search(/(!(masterbot|masters|toggle|random|checkem|coinflip|ask|help|count)|masterbot is now running\.)/gi) == -1 && text.length <= 175) {
        if (!text.contains("message action-message") && !text.contains("message spoken-message")) {
            var mseg = text;
            $.ajax({
                url : "http://bruno02468.com/spooks_bot/push.php?p=spooky&m=" + encodeURIComponent(mseg),
                type : 'GET',
                success : function(data) { console.log("Succesfully pushed to server!"); }
            });
        }
    }
    
    if (name != botnick && !antiSpam && score < 6) {
        if (text.contains("!toggle")) {
            toggle(name);
        } else if (!disabled) {
            if (text.contains("!masters")) {
                listMasters();
            } else if (text.contains("!random") || text.slice(-1) == "?") {
                sendRandom();
            } else if (text.contains("!checkem")) {
                checkem(name);
            } else if (text.contains("!coinflip")) {
                coinflip();
            } else if (text.contains("!ask")) {
                ask(name);
            } else if (text.contains("!help")) {
                send(help);
            } else if (text.contains("watch?v=")) {
                getTitles(text);
            } else if (text.contains("!count")) {
                getCount();
            }
        }
    }
});

CLIENT.submit("/echo Masterbot is now running.");



// COMMAND FUNCTIONS

function sendRandom() { // fetches a random message from the server and sends it
    $.ajax({
        url : "http://bruno02468.com/spooks_bot/random.php",
        type : 'GET',
        success : function(data) { send(data); }
    });
}

function getCount() { // fetches the count of messages in the db and sends it
    $.ajax({
        url : "http://bruno02468.com/spooks_bot/count.php",
        type : 'GET',
        success : function(data) { send("So far, there are " + data + " messages in the database."); }
    });
}

function getTitle(url) { // sends the title for a given YouTube URL
    var video_id = url.split('v=')[1];
    video_id = video_id.substring(0, video_id.indexOf('v=') + 12);
    var ampersandPosition = video_id.indexOf('&');
    if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
    }
    title = "Couldn't get title :-/";
    
    $.ajax({
        url : "http://bruno02468.com/spooks_bot/youtube.php?id=" + video_id,
        type : 'GET',
        success : function(data) { send("Title: " + data); }
    });
}

function getTitles(message) { // will work on that later
    message = message.substring(message.indexOf("http"));
    getTitle(message);
}

function ask(name) { //answers questions
    switch (Math.floor(Math.random()*3)) {
        case (0):
            send("No, " + name + ".");
            break;
        case (1):
            send("Yes, " + name + ".");
            break;
        case (2):
            send("Maybe, " + name + ".");
            break;
        default: //Also covers unexpected results
            send("I don't know, " + name + ".");
            break;
    }
}

function coinflip() {
    if (Math.random() < 0.5) {
        send("Heads");
    } else {
        send("Tails");
    }
}

function checkem(name) { // roll
    var rand = Math.floor(Math.random() * 90000) + 10000;
    send("They see " + name + " rollin' " + rand + ", they hatin'!");
}

function listMasters() { // lists masters
    var msg = "My masters are ";
    for (var i = 0; i < masters.length - 1; i++) {
        msg += masters[i] + ", ";
    }
    msg += "and " + masters[masters.length - 1] + ".";
    send(msg);
}

function toggle(name) {
    if (masters.contains(name)) {
        disabled = !disabled;
        if (!disabled) {
            send("Masterbot has been enabled.");
        }
    } else {
        CLIENT.submit("/pm " + name + "|You do not have permission to toggle me. Stop it.");
    }
}
