<?php
/* $string = file_get_contents("http://ths.kth.se/api/acf/v2/options");
//$homepage = file_get_contents('http://ths.kth.se/api/acf/v2/options');
$myJSON = json_decode($string, true);

print $myJSON;
*/

/*$string = file_get_contents("http://ths.kth.se/api/acf/v2/options");
// $string = file_get_contents("/storage/content/63/101063/ths.kth.se/public_html/wp-content/plugins/ths-api/facebook_mockup.json");
$myJSON = json_decode($string, false);
//print $myJSON["0"];
print_r($myJSON); */

/*$json = json_decode(file_get_contents("http://ths.kth.se/api/acf/v2/options"), true);

echo $json; */
header('Content-Type: application/json');
echo file_get_contents('https://cdn.thskth.se/api/wp/v2/restaurant?_embed&slug=nymble-restaurant&lang=en');

?>
