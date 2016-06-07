<?php
session_start();
if(isset($_SESSION['id']))
{
  // clear everything
  session_unset();
  
}
  $_SESSION['id'] = hash("sha1", microtime(false));
  $id = $_SESSION['id'];
  $_SESSION['last'] = time();
?>
<!DOCTYPE html>
<html>
<head>
<script type="text/javascript" src="code.js"></script>
<script type="text/javascript" src="ai.js"></script>
<script type="text/javascript" src="send.js"></script>
<script type="text/javascript">sessId = "<?php echo $id; ?>";aiExists=true;</script>
</head>
<body>
<div id="notes" style="height:120px;width:100%;"></div><br />
<canvas id="can"></canvas>
</body>
</html>
