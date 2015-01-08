<?php

    /*   === api.php ===
     * 
     * This is the server-side file.
     * It contains all the functions that are best left out of the JS code.
     * It should be available for request in a PHP5-able HTTP server.
     * This is currently a work-in-progress, new functions are welcome.
     * Author: Bruno02468
     */
    
    function req($str) {
        if (!isset($_GET[$str])) {
            die("GET variable \"" . $str . "\" is needed for this request.");
        } else {
            return $_GET[$str];
        }
    }
    
    // Checking for malformed requests
    
    $action = req("action");
    $logfile = "/home/bruno/Apache/masterbot.log";
    
    // Logging to server
    if ($action == "log") {
        $msg = req("msg") . "\n";
        file_put_contents($logfile, $msg, FILE_APPEND | LOCK_EX);
        die();
    }
    
    // Fetching random message
    if ($action == "random") {
        $f_contents = file($logfile);
        $line = $f_contents[array_rand($f_contents)];
        die($line);
    }
    
    // Fetching message count
    if ($action == "random") {
        $f_contents = file($logfile);
        die(count($f_contents));
    }
    
    // Fetching YouTube video title from ID
    if ($action == "youtube") {
        $id = req("id");
        $xmlInfoVideo = simplexml_load_file("https://gdata.youtube.com/feeds/api/videos/" . $id . "?v=2&fields=title");
        foreach($xmlInfoVideo->children() as $title) { $videoTitle = strtoupper((string) $title); }
        die($videoTitle);
    }
    
?>
