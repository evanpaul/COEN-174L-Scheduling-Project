<?php

include 'data.php';

if(isset($_POST['id']) && $_POST['classes'] && $_POST['eduFlag']){
    $json = ['id' => $_POST['id'], 'classes' => $_POST['classes'], 'eduFlag' => $_POST['eduFlag']];
    $json_string = json_encode($json);
    save_session($json_string);
}

?>
