function getBordering()
{
  var output = [];
  for(var i=0;i<grid.count.x*grid.count.y)
  {
    output.push(new Array());
  }
  for(var i=0;i<grid.count.x;++i)
  {
    for(var j=0;j<grid.count.y;++j)
    {
      // req: open, at least one bordering is not open
      var unopened = [];
      for(var k=0;k<9;++k)
      {
        var xval = (k%3-1+i);
        var yval = Math.floor(k/3)-1+j;
        if(xval >= 0 && xval < grid.count.x && yval >= 0 && yval < grid.count.y && xval+grid.count.x*yval && xval != i && yval != j)
        {
          unopened.push(yval*grid.count.x+xval);
        }
      }
      if(unopened.length > 0)
        output[i+j*grid.count.x] = unopened;
    }
  }
  return output;
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
