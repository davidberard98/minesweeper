var canv;
var ctx;
var mines = []; 
var scorecount;
var grid = {pos:{x:0,y:0}, size:0, count:{x:0,y:0}, total:{x:0,y:0}};
var gridStatus = []; // open = [true,], close = [false,]; marked = [,true], unmarked = [,false]
var minecount = 0;
var hiddenColor = "#999999";
var lockout = [];
var numbers = [];
var revealedColor = "#CCCCCC";
var freeSpots = 1;
var suspend = false;
var username = "";
var sessId = "";
var minesGenerated = false;
var aiExists = false;
var hasFinished = false;

//              an x by y with n mines
function initialize(x,y,n)
{

  suspend = false;
  document.getElementById("notes").innerHTML = "";
  mines = [];
  scorecount = 0;
  grid = {pos:{x:0,y:0}, size:0, count:{x:0,y:0}, total:{x:0,y:0}};
  gridStatus = [];
  lockout = [];
  numbers = [];
  minesGenerated = false;
  hasFinished = false;

  var standardSize = 30;
  var width = 600;
  var height = 460;
  
  //alert("init");
  canv = document.getElementById("can");
  ctx = canv.getContext("2d");
  ctx.canvas.width = width;
  ctx.canvas.height = height;
  //ctx.fillStyle = "#FF0000";
  //ctx.fillRect(0,0,30,30);

  grid.count.x = x;
  grid.count.y = y;
  grid.total.x = width;
  grid.total.y = height;
  minecount = n;
  for(var i=0;i<x*y;++i)
  {
    numbers.push(-1);
    gridStatus.push(new Array(false,false));
  }

  sendUsername(username);
  // find the size
  var equalWidth = Math.floor(width/x);
  var equalHeight = Math.floor(height/y);
  if(Math.min(equalWidth, equalHeight) >= standardSize)
  {
    grid.size = standardSize;
  }
  else
  {
    grid.size = Math.min(equalWidth, equalHeight);
  }
  
  //center
  grid.pos.x = Math.floor((width-grid.size*x)/2);
  grid.pos.y = Math.floor((height-grid.size*y)/2);

  drawGrid();

  var begin = document.createElement("div");
  var end = document.createElement("div");
  scorecount = document.createElement("div");
  document.body.appendChild(scorecount);
  
}

function drawGrid()
{
  ctx.strokeStyle = "#555555";
  ctx.lineWidth = "2";
  for(var i=0;i<=grid.count.x;++i)
  {
    ctx.beginPath();
    ctx.moveTo(i*grid.size+grid.pos.x, grid.pos.y);
    ctx.lineTo(i*grid.size+grid.pos.x, grid.pos.y + grid.size*grid.count.y);
    ctx.stroke();
  }
  for(var i=0;i<=grid.count.y;++i)
  {
    ctx.beginPath();
    ctx.moveTo(grid.pos.x, i*grid.size+grid.pos.y);
    ctx.lineTo(grid.pos.x + grid.size*grid.count.x, i*grid.size+grid.pos.y);
    ctx.stroke();
  }
  var imgData = ctx.getImageData(grid.pos.x,grid.pos.y,grid.count.x*grid.size,grid.count.y*grid.size);
  for(var i=0;i<grid.count.x*grid.size;++i)
  {
    for(var j=0;j<grid.count.y*grid.size;++j)
    {
      var thispos = 4*i*grid.count.y*grid.size+4*j;
      if(imgData.data[thispos+3] == 0)
      {
        imgData.data[thispos] = 204;
        imgData.data[thispos+1] = 204;
        imgData.data[thispos+2] = 204;
        imgData.data[thispos+3] = 255;
      }
    }
  }
  ctx.putImageData(imgData, grid.pos.x, grid.pos.y);
}

//                   dimensions, start, how many free spaces min. number of mines
function generateMines(startx,starty,free)
{
  if(grid.count.x*grid.count.y < minecount + 1)
  {
    return false;
  }
  if(grid.count.x*grid.count.y < (free*2+1)*(free*2+1)+minecount)
  {
    generateMines(startx, starty, free-1);
  }
  else
  {
    var possibleValues = [];
    for(var i=0;i<grid.count.x*grid.count.y;++i)
      possibleValues.push(i);
    var max = grid.count.x*grid.count.y-1;
    var randomValues = [];
    for(var i=0;i<minecount;++i)
    {
      var r = Math.floor(Math.random()*max);
      var store = possibleValues[r];
      possibleValues[r] = possibleValues[max];
      possibleValues[max] = store;
      var rrow = Math.floor(store/grid.count.x);
      var rcol = Math.floor(store%grid.count.x);
      //console.log(rcol + " " + rrow + "(" + store + ")");
      if((rcol >= startx - free && rcol <= startx + free) && (rrow >= starty - free && rrow <= starty + free))
      {
        --i;
      }
      else
      {
        randomValues.push(r);
        mines.push(new Array(store%grid.count.x, Math.floor(store/grid.count.x)));
      }
      max -= 1;
    }
    //console.log(JSON.stringify(possibleValues));
  }
}

function mineStatus(x,y)
{
  for(var i =0;i<mines.length;++i)
  {
    if(mines[i][0] == x && mines[i][1] == y)
    {
      //console.log(x + "," + y + ":" + i)
      return true;
    }
  }
  return false
}

function clearBox(x,y,num)
{
    numbers[x+grid.count.x*y] = num;
    gridStatus[x+grid.count.x*y][0] = true;
    var imgData = ctx.getImageData(grid.pos.x+grid.size*x+1, grid.pos.y+grid.size*y+1, grid.size-1, grid.size-1);
    for(var i = 0;i<imgData.data.length;++i)
    {
      if(i%4 != 3)
        imgData.data[i] = 153;
    }
    ctx.putImageData(imgData, grid.pos.x+grid.size*x+1, grid.pos.y+grid.size*y+1);

    if(num > 0)
    {
      var numberColor = [0, "#0000ff", "#33aa33", "#ff0000", "#0000aa", "#ff8800", "#00ffff", "#aa0000", "#000000"];
      ctx.font=(Math.floor(grid.size*2/3)) + "px sans-serif";
      ctx.strokeStyle=numberColor[num];
      ctx.strokeText(num, grid.pos.x+grid.size*x+5, grid.pos.y+grid.size*y-5+grid.size);
    }
}

function clickOn(x,y,lost)
{
  if(lost == true)
  {
    //lose(x,y);
  }
  if(!lost && gridStatus[y*grid.count.x+x][0] == false && gridStatus[y*grid.count.x+x][1] == false)
  {
    gridStatus[y*grid.count.x+x][0] = true;
    var imgData = ctx.getImageData(grid.pos.x+grid.size*x+1, grid.pos.y+grid.size*y+1, grid.size-1, grid.size-1);
    var mineCount = 0;
    for(var i=-1;i<=1;++i)
    {
      for(var j=-1;j<=1;++j)
      {
        if(x+i >= 0 && x+i < grid.count.x && y+j >= 0 && y+j < grid.count.y && mineStatus(x+i, y+j))
          ++mineCount;
      }
    }
    for(var i = 0;i<imgData.data.length;++i)
    {
      if(i%4 != 3)
        imgData.data[i] = 153;
    }
    ctx.putImageData(imgData, grid.pos.x+grid.size*x+1, grid.pos.y+grid.size*y+1);

    numbers[grid.count.x*y+x] = mineCount;
    if(mineCount > 0)
    {
      var numberColor = [0, "#0000ff", "#33aa33", "#ff0000", "#0000aa", "#ff8800", "#00ffff", "#aa0000", "#000000"];
      ctx.font=(Math.floor(grid.size*2/3)) + "px sans-serif";
      ctx.strokeStyle=numberColor[mineCount];
      ctx.strokeText(mineCount, grid.pos.x+grid.size*x+5, grid.pos.y+grid.size*y-5+grid.size);
    }
    else
    {
      for(var i = 0;i<9;++i)
      {
        if(x+i%3-1 >= 0 && x+i%3-1<grid.count.x && y+Math.floor(i/3)-1 >= 0 && y+Math.floor(i/3)-1 < grid.count.y)
          clickOn(x+i%3-1, y+Math.floor(i/3)-1);
      }
    }

    if(isWin())
      win();
  }
}

function mark(x,y)
{
  var imgData = ctx.getImageData(grid.pos.x+grid.size*x+1, grid.pos.y+grid.size*y+1, grid.size-2, grid.size-2);
  if(gridStatus[grid.count.x*y+x][1] == false)
  {
    for(var i =0;i<grid.size-2;++i)
    {
      for(var j =0;j<grid.size-2;++j)
      {
        var thispos = 4*(i*(grid.size-2)+j);
        if(Math.floor((Math.floor((i+j)/2)%5)/2) == 1)
        {
          imgData.data[thispos] = 238;
          imgData.data[thispos+1] = 100;
          imgData.data[thispos+2] = 0;
        }
      }
    }
    gridStatus[grid.count.x*y+x][1] = true;
  }
  else
  {
    for(var i =0;i<imgData.data.length;++i)
    {
      if(i%4 != 3)
        imgData.data[i] = 204;
    }
    gridStatus[grid.count.x*y+x][1] = false;
  }
  ctx.putImageData(imgData, grid.pos.x+grid.size*x+1, grid.pos.y+grid.size*y+1);
}

function lose(x,y,alldata)
{
  clearBox(x,y,0);
  hasFinished = true;
  suspend = true;
  var enotes = document.getElementById("notes");
  enotes.innerHTML = "<span style='font-weight:900;color:#aa0000;font-size:1.8em;'>Sorry, You lost.</span>";
  enotes.innerHTML += "&nbsp; &nbsp; &nbsp; <a href='javascript:restart();'>PLAY AGAIN</a>";
  for(var i=0;i<alldata.length;++i)
  {
    if(alldata[i][2] == true)
    {
      ctx.font=(Math.floor(grid.size*2/3)) + "px sans-serif";
      if(i%grid.count.x == x && Math.floor(i/grid.count.x) == y)
        ctx.strokeStyle="#ff0000";
      else
        ctx.strokeStyle="#000000";
      ctx.strokeText("!", grid.pos.x+grid.size*(i%grid.count.x)+5, grid.pos.y+grid.size*Math.floor(i/grid.count.x)-10+grid.size);
    }
    
  }
//  send(false, x, y);
}

function isWin()
{
  var foundProb = false;
  var countHidden = 0;
  for(var i=0;i<grid.count.x;++i)
  {
    for(var j=0;j<grid.count.y;++j)
    {
      var num = j*grid.count.x + i;
      if(gridStatus[num][0] == false)
      {
        ++countHidden;
      }
    }
  }
  if(countHidden == minecount)
    return true;
  return false;
}

function win()
{
  hasFinished = true;
  suspend = true;
  var enotes = document.getElementById("notes");
  enotes.innerHTML = "<span style='font-weight:900;color:#007700;font-size:1.8em;'>Congrats! You win!</span>";
  enotes.innerHTML += "&nbsp; &nbsp; &nbsp; <a href='javascript:restart();'>PLAY AGAIN</a>";
  send(true, -1, -1);
}

function reactToClick(ev)
{
  if(!suspend)
  {
    ev.preventDefault();
    //console.log(ev.type);
    var posX = can.offsetLeft;
    var posY = can.offsetTop;
    var width = 300;
    var height = 150;
    var mouseX = ev.clientX + window.scrollX;
    var mouseY = ev.clientY + window.scrollY;
  
    var mineX = Math.floor((mouseX - (grid.pos.x+posX))/grid.size);
    var mineY = Math.floor((mouseY - (grid.pos.y+posY))/grid.size);
  
    if(mineX >= 0 && mineY >= 0 && mineX < grid.count.x && mineY < grid.count.y)
    {
      //console.log("Clicked on mine " + mineX + "," + mineY);
      if(ev.type == "click" && ((lockout[0] == mouseX && lockout[1] == mouseY) == false))
      {
        if(minesGenerated == false)
        {
          makeMines(mineX,mineY,freeSpots);
//          generateMines(mineX,mineY,freeSpots);
          //console.log(JSON.stringify(mines));
//          clickOn(mineX, mineY);
        }
        else
        {
          phpClick(mineX,mineY);
          //clickOn(mineX, mineY);
        }
      }
      if(ev.type == "contextmenu")
      {
        if(minesGenerated && gridStatus[mineY*grid.count.x+mineX][0] == false)
        {
          sendMark(mineX, mineY);
          mark(mineX, mineY);
        }
        lockout = [mouseX, mouseY];
      }
      
    }
  
  }
  return false;
}

function restart()
{
  console.log("restart");
  initialize(15,15,40);
}

function gofirst()
{

  if(document.getElementById("userid").value != "")
  {
    username = document.getElementById("userid").value;
    for(var i=0;i<username.length;++i)
    {
      var num = username.charCodeAt(i);
      if(!((num >= 48 && num <= 57) || (num >= 65 && num <= 122) || num == 46))
      {
        var end = "";
        if(username.length > i+1)
          end = username.slice(i+1, username.length);
        username = username.slice(0, i) + end;
        --i;
      }
    }
    setTimeout(keepAlive, 3000);
    restart();
  }

}

function start()
{
  document.getElementById("notes").innerHTML = "Enter a name/username/identifier (to be used for scores)<br />";
  document.getElementById("notes").innerHTML += "<input type='text' id='userid' /><button onclick='gofirst()'>Go!</button>";
}

window.onload = start;
document.addEventListener("click", reactToClick, false);
document.addEventListener("contextmenu", reactToClick, false);
