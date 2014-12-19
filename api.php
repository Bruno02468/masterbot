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
            die("Variable " . $str . " is needed for this request.");
        } else {
            return $_GET[$str];
        }
    }
    
    // Checking for malformed requests
    
    $action = req("action");
    
    if ($action == "log") {
        $msg = req("msg");
        
    }
    
    
    
?>
