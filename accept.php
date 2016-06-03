<?php

$filename = "store.txt";

if(isset($_POST['type']))
{
  echo $_POST['type'];
  if($_POST['type'] == "human1")
  {
    $content = file_get_contents($filename);
    $content = trim($content);
    $content .= "\n" . $_POST['data'];
    file_put_contents($filename, $content);
    echo "ya";
  }
}

?>
