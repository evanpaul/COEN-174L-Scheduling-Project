<!DOCTYPE html>
<?php
    include 'data.php';
?>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" type="text/css" href="styles.css">
        <title> SCU Degree Audit </title>
    </head>

    <body>
        <?php
            if(isset($_GET["id"])){
                $id = $_GET["id"];
                $class_list = get_session($id)["classes"];
            }
        ?>
        <h1>SCU Degree Audit</h1>
        <?php
            echo "<h1> Session: " . $id . "</h1>";
        ?>
        <div style="width: 100%;">
            <div style="float:left; width: 54%" id="left_side">
                <h4>Enter a class:</h4>
                <form>
                    <input type="text" name="entered_class" />
                    <input type="submit" value="Submit" onclick="findreq()"/>
                </form>

                <h2>Entered Courses:</h2>
                <ul style="list-style-type:none" id="class_list">
                    <?php
                        foreach($class_list as $class){
                            echo "<li>". $class . "</li>";
                        }
                    ?>
                </ul>
            </div>

            <div style="float:right; width: 45%" id="right_side">
                <h2>Major Requirements</h2>
                    <table class="class_table">
                        <tr>
                            <td>ENGR 1/110</td>
                            <td>COEN 10</td>
                            <td>COEN 11</td>
                            <td>COEN 12</td>
                            <td>COEN 19</td>
                        </tr>
                        <tr>
                            <td>COEN 20</td>
                            <td>COEN 21</td>
                            <td>COEN 70</td>
                            <td>COEN 122</td>
                            <td>COEN 146</td>
                        </tr>
                        <tr>
                            <td>COEN 171</td>
                            <td>COEN 174</td>
                            <td>COEN 175</td>
                            <td>COEN 177</td>
                            <td>COEN 179</td>
                        </tr>
                        <tr>
                            <td>COEN 194</td>
                            <td>COEN 195</td>
                            <td>COEN 196</td>
                            <td>ELEN 50</td>
                            <td>ELEN 153</td>
                        </tr>
                        <tr>
                            <td>ENGL 181</td>
                            <td>MATH 11</td>
                            <td>MATH 12</td>
                            <td>MATH 13</td>
                            <td>MATH 14</td>
                        </tr>
                        <tr>
                            <td>PHYS 31</td>
                            <td>PHYS 32</td>
                            <td>PHYS 33</td>
                            <td>CHEM 11</td>
                            <td>AMTH 106</td>
                        </tr>
                        <tr>
                            <td>AMTH 108</td>
                            <td>MATH 53/166/AMTH 118</td>
                        </tr>
                    </table>
                <h2>CORE</h2>
                    <table class="class_table">
                        <tr>
                            <td>CTW 1</td>
                            <td>CTW 2</td>
                            <td>C&I 1</td>
                            <td>C&I 2</td>
                            <td>RTC 1</td>
                        </tr>
                        <tr>
                            <td>RTC 2</td>
                            <td>RTC 3</td>
                            <td>ETHICS</td>
                            <td>DIVERSITY ENG.</td>
                            <td>NAT. SCIENCE</td>
                        </tr>
                        <tr>
                            <td>SOC. SCIENCE</td>
                            <td>ELSJ</td>
                        </tr>
                    </table>
                <h2>Educational Enrich.</h2>
            </div>
        </div>

    </body>
</html>
