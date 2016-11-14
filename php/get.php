<?php

include 'data.php';

if(isset($_GET['id'])){
    $pattern = '/^[0-9a-z]{10}$/';
    $id = $_GET['id'];
    // Check if given ID conforms to our regex
    if(preg_match($pattern, $id)){
        $session = get_session($id);
        if($session){ // Check if session is null... if an error appears here then be more explicit with NULL check
            json_encode(get_session($id));
        }else{
            echo "NULL";
        }
    }else{
        echo "INVALID";
    }
}

?>
