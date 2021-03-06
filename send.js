function send(win, x, y)
{
  var TYPE = "human1";
  var user = "NULL";
  var winstatus = "l";
  var dimension = "";
  var time = "unknown";
  var data = "";
  var messup = "NONE";
  if(win == true)
  {
    winstatus = "w";
  }
  dimension = grid.count.x + "x" + grid.count.y;
  for(var i=0;i<grid.count.x;++i)
  {
    for(var j =0;j<grid.count.y;++j)
    {
      // 3dig groups: mine (y/n), open(y/n), flag(y/n)
      if(mineStatus(i,j))
        data += "y";
      else
        data += "n";

      if(gridStatus[j*grid.count.x+i][0] == true)
        data += "y";
      else
        data += "n";

      if(gridStatus[j*grid.count.x+i][1] == true)
        data += "y";
      else
        data += "n";
    }
  }
  if(!win)
  {
    messup = x + "," + y;
  }

  var output = username + "|" + winstatus + "|" + dimension + "|" + time + "|" + data + "|" + messup;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
//      document.getElementById("response").innerHTML = xhttp.responseText;
      console.log("send success " + xhttp.responseText);
    }
  };
  xhttp.open("POST", "accept.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("type=" + TYPE + "&data=" + output);
}
function sendUsername(usern)
{
  var TYPE = "setup";
  
  var otherdata = usern + "|" + grid.count.x + "|" + grid.count.y + "|" + minecount;
  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
//      document.getElementById("response").innerHTML = xhttp.responseText;
      console.log("userset: " + xhttp.responseText);
    }
  };
  xhttp.open("POST", "accept.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("type=" + TYPE + "&data=" + otherdata);
}
function makeMines(x,y,free)
{
  var TYPE = "makeMines";
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
//      document.getElementById("response").innerHTML = xhttp.responseText;
      console.log("mines Generated!: " + xhttp.responseText);
      minesGenerated = true;
      suspend = false;
      phpClick(x, y, true);
    }
  };
  suspend = true;
  xhttp.open("POST", "accept.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("type=" + TYPE + "&data=" + x + "|" + y + "|" + free);
}
function sendMark(x,y)
{
  var TYPE = "sendmark";
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
//      document.getElementById("response").innerHTML = xhttp.responseText;
      console.log("marked! " + xhttp.responseText);
      if(aiExists)
        startAI();
    }
  };
  xhttp.open("POST", "accept.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("type=" + TYPE + "&data=" + x + "|" + y);
}
function phpClick(x,y,first)
{
  var TYPE = "click";
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
//      document.getElementById("response").innerHTML = xhttp.responseText;
      console.log("click result:" + xhttp.responseText);
      var key = xhttp.responseText.slice(0,3);
      if(key == "min")
      {
        //clickOn(x,y,true);
        var alldata = JSON.parse(xhttp.responseText.slice(3));
        lose(x,y,alldata);
        suspend = true;
      }
      else
      {
        //clickOn(x,y,false);
        var newdata = JSON.parse(xhttp.responseText.slice(3));
        for(var i=0;i<newdata.length;++i)
        {
          clearBox(newdata[i][0], newdata[i][1], newdata[i][2]);
        }
        suspend = false;
      }
      if(isWin())
        win();
      if(aiExists)
        startAI();
    }
  };
  suspend = true;
  xhttp.open("POST", "accept.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("type=" + TYPE + "&data=" + x + "|" + y);
}
function keepAlive()
{
  var TYPE = "keepalive";
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
//      document.getElementById("response").innerHTML = xhttp.responseText;
      setTimeout(keepAlive, 3000);
    }
  };
  xhttp.open("POST", "accept.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("type=" + TYPE + "&data=" + sessId);
}
