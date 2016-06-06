<?php
$gridx = 0;
$gridy = 0;
$minecount = 0;
$mines = Array();
$gridStatus = Array();
// mine, click, mark

function setup($rawdata)
{
  $parsed = explode("|", $rawdata);
  $_SESSION['username'] = filterData($parsed[0]);
  $_SESSION['size'] = array(intval($parsed[1]), intval($parsed[2]));
  $_SESSION['minecount'] = intval($parsed[3]);
  $_SESSION['mines'] = array();
}

function load()
{
  global $gridx, $gridy, $minecount, $mines;
  $gridx = $_SESSION['username'][0];
  $gridy = $_SESSION['username'][1];
  $minecount = $_SESSION['minecount'];
  $mines = $_SESSION['mines'];
}

function makeMines($data)
{
  $parsed = explode("|", $data);
  if(count($parsed) == 3)
    generateMines(intval($parsed[0]), intval($parsed[1]), intval($parsed[2]));
}

function generateMines($startx,$starty,$free)
{
  global $gridx, $gridy, $minecount, $mines, $gridStatus;

  if(count($mines) == 0)
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
      for($i=0;i<$gridx*$gridy;++$i)
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
          $randomValues[] = $store;
          $mines[] = Array($store%$gridx, floor($store/$gridx));
        }
        $max -= 1;
      }
    }
  }
}

?>
