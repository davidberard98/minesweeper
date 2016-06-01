var canv;
var ctx;

function initialize(x,y)
{
  //alert("init");
  canv = document.getElementById("can");
  canv.style.width = "600px";
  canv.style.height = "300px";
  ctx = canv.getContext("2d");
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0,0,150,75);


  var begin = document.createElement("div");
  var end = document.createElement("div");
  begin.innerHTML = "<br /><br /><br /><br /><br />";
  end.innerHTML = "<br /><br /><br /><br /><br />";
  document.body.insertBefore(begin, canv);
  document.body.appendChild(end);
  
  

}

function reactToClick(event)
{
  alert(event.clientX + " " + event.clientY + " vs " + can.offsetLeft + " " + can.offsetTop);
}

window.onload = initialize;	
document.addEventListener("click", reactToClick, false);