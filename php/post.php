<?php

include 'data.php';

if(isset($_POST['id'])){
    $json = ['id' => $_POST['id'], 'classes' => $_POST['classes'], 'eduFlag' => $_POST['eduFlag']];
    $json_string = json_encode($json);
    save_session($json_string);
}

?>
