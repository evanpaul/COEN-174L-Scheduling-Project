<?php

include 'data.php';

if(isset($_POST['id']) && $_POST['classes']){
    $json = ['id' => $_POST['id'], 'classes' => $_POST['classes']];
    $json_string = json_encode($json);
    save_session($json_string);
}

?>
