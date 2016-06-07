function startAI()
{
  basicCheckAll();
}

function randomfunct()
{
  alert("random function");
}

function getBordering()
{
  var output = [];
  for(var i=0;i<grid.count.x*grid.count.y;++i)
  {
    output.push(new Array());
  }
  for(var i=0;i<grid.count.x;++i)
  {
    for(var j=0;j<grid.count.y;++j)
    {
      // req: open, at least one bordering is not open
      var unopened = [];
      var opened = [];
      for(var k=0;k<9;++k)
      {
        var xval = (k%3-1+i);
        var yval = Math.floor(k/3)-1+j;
        if(xval >= 0 && xval < grid.count.x && yval >= 0 && yval < grid.count.y && xval+grid.count.x*yval && xval != i && yval != j)
        {
          unopened.push(yval*grid.count.x+xval);
        }
        else
          opened.push(yval*grid.count.x+xval);
      }
      if(unopened.length > 0)
        output[i+j*grid.count.x] = array(unopened,opened);
    }
  }
  return output;
}

function basicCheck(x,y)
{
  var bordercount = 0;
  var statuses = new Array();
  var countF = 0;
  var countOOF = 0;
  for(var i=0;i<9;++i)
  {
    if(x+(i%3)-1 >= 0 && x+(i%3)-1 < grid.count.x && y+Math.floor(i/3)-1 >= 0 && y+Math.floor(i/3)-1 < grid.count.y && i!=4)
    {
      ++bordercount;
      var val = x+(i%3)-1+grid.count.x*(y+Math.floor(i/3)-1);
      if(gridStatus[val][0] || gridStatus[val][1])
      {
        if(gridStatus[val][0]) //open
          statuses.push(1);
        if(gridStatus[val][1]) // flagged
        {
          statuses.push(2);
          ++countF;
        }
        ++countOOF;
      }
      else // closed/hidden
        statuses.push(0);
    }
    else // out of bounds
      statuses.push(-1);
  }
  console.log(x +","+y+":"+bordercount + ":"+countF + "," + countOOF + ":" + numbers[x+y*grid.count.x]);
  if(countOOF == bordercount || countOOF-countF == 0)
    return false;
//  if(countOOF == bordercount + number[x+y*grid.count.x]) // mark one mine
//  if(countOOF + numbers[x+y*grid.count.x] == bordercount) // mark one mine
//  if(bordercount-countOOF-countF == numbers[x+y*grid.count.x])
  if(bordercount-countOOF+countF == numbers[x+y*grid.count.x])
  {
    console.log("about to mark a mine!");
    var mineval = -1;
    for(var i=0;i<9;++i)
    {
      if(statuses[i] == 0)
      {
        mineval = i;
        break;
      }
    }
    var i = mineval;
    var xval = x+i%3-1;
    var yval = (y+Math.floor(i/3)-1);
    mineval = xval + grid.count.x*yval;
    sendMark(xval, yval);
    mark(xval, yval);
    return true;
  }
  if(countF == numbers[x+y*grid.count.x])
  {
    for(var i=0;i<9;++i)
    {
      var xval = x+(i%3)-1;
      var yval = (y+Math.floor(i/3)-1);
      var val = x+(i%3)-1+grid.count.x*(y+Math.floor(i/3)-1);
      if(statuses[i] ==0)
      {
        phpClick(xval, yval);
        break;
      }
    }
    return true;
  }
  
}

function basicCheckAll()
{
  var found = false;
  for(var i=0;i<grid.count.x;++i)
  {
    for(var j=0;j<grid.count.y;++j)
    {
      if(gridStatus[i+j*grid.count.x][0] == true)
      {
        found = basicCheck(i,j);
        if(found)
          break;
      }
    }
    if(found)
      break;
  }
  if(found && !hasFinished)
    setTimeout( basicCheckAll,300);
  else
  {
    console.log("stuck :(");
    return false;
  }
}

function checkFor(pieces, data)
{
  var interesting = new Array();
  for(var i=0;i<pieces.length;++i)
  {
    for(var j=0;j<data[pieces].length;++j)
    {
      var found = false;
      for(var k=0;k<interesting.length;++k)
      {
        if(interesting[k] == data[pieces][j])
        {
          found = true;
          break;
        }
      }
      if(found == false)
        interesting.push(data[pieces][j]);
    }
  }
  var power = 1;
//  power = power < ;
  for(var i = 0;i<interesting.length;++i)
  {
    i*1;
  }
}
