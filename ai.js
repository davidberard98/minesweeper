function getBordering()
{
  var output = [];
  for(var i=0;i<grid.count.x;++i)
  {
    for(var j=0;j<grid.count.y;++j)
    {
      // req: open, at least one bordering is not open
      var borderFound = false;
      for(var k=0;k<9;++k)
      {
        var xval = (k%3-1+i);
        var yval = Math.floor(k/3)-1+j;
        if(xval >= 0 && xval < grid.count.x && yval >= 0 && yval < grid.count.y && xval+grid.count.x*yval && xval != i && yval != j)
        {
          borderFound = true;
          break;
        }
      }
      if(gridStatus[j*grid.count.x+i][0] == true && borderFound == true)
        output.push(new Array(i,j));
    }
  }
  return output;
}

function checkFor(x,y)
{
  var mines =
  for(var i =0;i<9;++i)
  {
    xval = 
  }
}
