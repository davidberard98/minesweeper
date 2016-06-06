<?php

$filename = "store.txt";

$note = "";

function filterData($data)
{
  for($i=0;$i<strlen($data);++$i)
  {
    $num = ord($data[$i]);
    if(!(($num >= 48 && $num <= 57) || ($num >=65 && $num <= 122) || $num == 46))
    {
      $num .= "!";
      $end = "";
      if(strlen($data) > $i+1)
        $end = substr($data, $i+1);
      $data = substr($data, 0, $i) . $end;
      --$i;
    }
  }
  return $data;
}

if(isset($_POST['type']))
{
  session_start();
  include("game.php");
  if(isset($_SESSION['last']) && time() - intval($_SESSION['last']) <= 10)
  {
    if($_POST['type'] == "human1")
    {
      $thisUser = $_POST['data'];
      $thisUser = explode('|',$thisUser);
      $thisUser = $thisUser[0];
      if(isset($_SESSION['username']) && $_SESSION['username'] == $thisUser && $thisUser != "")
      {
        $content = file_get_contents($filename);
        $content = trim($content);
        $content .= "\n" . $_POST['data'];
        file_put_contents($filename, $content);
      }
    }
    else if($_POST['type'] == "makeMines")
    {
      if(isset($_SESSION['data']))
      {
        load();
        makeMines($_SESSION['data']);
      }
    }
    else if($_POST['type'] == "setup")
    {
//      echo "SETTING USER TO " . filterData($_POST['data']) . " where id=" . $_SESSION['id'] . ".";
      if(isset($_SESSION['id']) && !isset($_SESSION['username']))
        setup($_POST['data']);
    }
    else if($_POST['type'] == "keepalive")
    {
      if($_POST['data'] == $_SESSION['id'])
        $_SESSION['last'] = time();
    }
  }
  else
    session_unset();
}
echo $note;

?>
