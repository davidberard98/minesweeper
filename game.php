<?php
$gridx = 0;
$gridy = 0;
$minecount = 0;
$gridStatus = Array();
// click, mark, mine

function restart()
{
  if(isset($_SESSION['size']))
    unset($_SESSION['size']);
  if(isset($_SESSION['minecount']))
    unset($_SESSION['minecount']);
  if(isset($_SESSION['gridStatus']))
    unset($_SESSION['gridStatus']);
}

function setup($rawdata, $newuser)
{
  $parsed = explode("|", $rawdata);
  //if($newuser)
    $_SESSION['username'] = filterData($parsed[0]);
  $_SESSION['size'] = array(intval($parsed[1]), intval($parsed[2]));
  $_SESSION['minecount'] = intval($parsed[3]);
  $_SESSION['gridStatus'] = array();
  for($i=0;$i<$_SESSION['size'][0]*$_SESSION['size'][1];++$i)
  {
    $_SESSION['gridStatus'][] = array(false,false,false);
  }
  echo "SETUP!";
}

function load()
{
  global $gridx, $gridy, $minecount, $gridStatus;
  $gridx = $_SESSION['size'][0];
  $gridy = $_SESSION['size'][1];
  $minecount = $_SESSION['minecount'];
  $gridStatus = $_SESSION['gridStatus'];
}

function makeMines($data)
{
  $parsed = explode("|", $data);
  if(count($parsed) == 3)
    generateMines(intval($parsed[0]), intval($parsed[1]), intval($parsed[2]));
}

function clickOn($data)
{
  global $gridx, $gridy, $gridStatus;
  $data = explode("|", $data);

  $xval = intval($data[0]);
  $yval = intval($data[1]);

  $lost = false;
  if($gridStatus[$gridx*$yval + $xval][2] == true)
    $lost = true;

  $notes = "";

  if($lost)
  {
    finish(false,$xval,$yval);
    echo "min" . json_encode($gridStatus);
  }
  else
  {
    click($xval, $yval, $notes);
    if(count($notes) == 0)
      echo ":( no notes";
    if(isWin())
      finish(true);
    else
      echo "oka" . json_encode($notes);
  }

}

function mark($data)
{
  global $gridStatus, $gridx;

  $data = explode("|", $data);
  $xval = intval($data[0]);
  $yval = intval($data[1]);
  $gridStatus[$xval + $yval*$gridx][1] = true;
}

function click($xval, $yval, &$notes)
{
  global $gridx, $gridy, $gridStatus;

  if($gridStatus[$yval*$gridx+$xval][0] == false && $gridStatus[$yval*$gridx+$xval][1] == false)
  {
    $gridStatus[$yval*$gridx+$xval][0] = true;
//    var imgData = ctx.getImageData(grid.pos.x+grid.size*x+1, grid.pos.y+grid.size*y+1, grid.size-1, grid.size-1);
    $mineCounter = 0;
    for($i=-1;$i<=1;++$i)
    {
      for($j=-1;$j<=1;++$j)
      {
        if($xval+$i >= 0 && $xval+$i < $gridx && $yval+$j >= 0 && $yval+$j < $gridy && $gridStatus[($xval+$i)+ ($yval+$j)*$gridx][2] == true)
          ++$mineCounter;
      }
    }
/*    for(var i = 0;i<imgData.data.length;++i)
    {
      if(i%4 != 3)
        imgData.data[i] = 153;
    }
    ctx.putImageData(imgData, grid.pos.x+grid.size*x+1, grid.pos.y+grid.size*y+1);

    numbers[$gridx*y+x] = mineCount;
    if(mineCount > 0)
    {
      var numberColor = [0, "#0000ff", "#33aa33", "#ff0000", "#0000aa", "#ff8800", "#00ffff", "#aa0000", "#000000"];
      ctx.font=(floor(grid.size*2/3)) + "px sans-serif";
      ctx.strokeStyle=numberColor[mineCount];
      ctx.strokeText(mineCount, grid.pos.x+grid.size*x+5, grid.pos.y+grid.size*y-5+grid.size);
    }*/
    //$notes[] = array(($yval*$gridx+$xval), $mineCounter);
    $notes[] = array($xval, $yval, $mineCounter);
    if($mineCounter == 0)
    {
      for($i = 0;$i<9;++$i)
      {
        if($xval+$i%3-1 >= 0 && $xval+$i%3-1<$gridx && $yval+floor($i/3)-1 >= 0 && $yval+floor($i/3)-1 < $gridy)
          click($xval+$i%3-1, $yval+floor($i/3)-1, $notes);
      }
    }

  }
}

function isWin()
{
  global $gridx, $gridy, $gridStatus;
  $foundProb = false;
  for($i=0;$i<$gridx;++$i)
  {
    for($j=0;$j<$gridy;++$j)
    {
      $num = $j*$gridx + $i;
      if($gridStatus[$num][0] == false && $gridStatus[$num][2] == false)
      {
        $foundProb = true;
        break;
      }
    }
    if($foundProb)
      break;
  }
  return !$foundProb;
}

function finish($isWin, $x, $y)
{
  if($isWin == true) // win!
  {
    echo "win";
    save(true);
  }
  else // lose lol
  {
    save(false, $x,$y);
//    echo "min";
  }
  restart();
}


function generateMines($startx,$starty,$free)
{
  global $gridx, $gridy, $minecount, $gridStatus;
  //if(count($mines) == 0)
  if(true)
  {
    if($gridx*$gridy < $minecount + 1)
    {
      return false;
    }
    if($gridx*$gridy < ($free*2+1)*($free*2+1)+$minecount)
    {
      generateMines($startx, $starty, $free-1);
    }
    else
    {
      $possibleValues = Array();
      for($i=0;$i<$gridx*$gridy;++$i)
        $possibleValues[] = $i;
      $max = $gridx*$gridy-1;
      $randomValues = Array();
      for($i=0;$i<$minecount;++$i)
      {
        $r = rand(0,$max);
        $store = $possibleValues[$r];
        $possibleValues[$r] = $possibleValues[$max];
        $possibleValues[$max] = $store;
        $rrow = floor($store/$gridx);
        $rcol = $store%$gridx;
        if(($rcol >= $startx - $free && $rcol <= $startx + $free) && ($rrow >= $starty - $free && $rrow <= $starty + $free))
        {
          --$i;
        }
        else
        {
          //$mineCheat .= $store . " ";
          $randomValues[] = $store;
//          $mines[] = Array($store%$gridx, floor($store/$gridx));
          $_SESSION['gridStatus'][$store][2] = true;
          $gridStatus = $_SESSION['gridStatus'];
        }
        $max -= 1;
      }
    }
  }
  //echo $mineCheat . " " . $minecount;
}

function save($status, $x, $y)
{
  global $gridx, $gridy, $gridStatus;
  $alldata = "";
  $wvar;
  if($status == true) // win
    $wvar = "w";
  else
    $wvar = "l";
  $dimension = $gridx . "," . $gridy;
  $time = "unknown";
  $data = "";
  for($i=0;$i<count($gridStatus);++$i)
  {
    for($j = 0;$j<3;++$j)
    {
      if($gridStatus[$i][($j+1)%3] == false)
        $data .= "n";
      else
        $data .= "y";
    }
  }

  $messup = "NONE";
  if($status == false)
    $messup = $x . "," . "$y";

  $output = $_SESSION['username'] . "|" . $wvar . "|" . $dimension . "|" . $time . "|" . $data . "|" . $messup;
  $filename = "store.txt";

        $content = file_get_contents($filename);
        $content = trim($content);
        $content .= "\n" . $output;
        file_put_contents($filename, $content);
}

?>
