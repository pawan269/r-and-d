<?php
session_start();
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Chat Application</title>
        <script type="text/javascript" language="javascript">
            var sess_id = '<?php echo session_id(); ?>';
            var timer = 0;
        </script>
        <link type="image/x-icon" href="assets/favicon.ico" rel="shortcut icon">        
        <link href="assets/main.css" rel="stylesheet">
        <script src="assets/socket.io.js"></script>
        <script src="assets/jquery.min.js"></script>
        <script src="assets/main.js"></script>
    </head>
    <body>
        <div class="container">
            <div class="userlist" id="userlist"></div>
            <div class="chatwindow" id="content"></div>
            <div class="row">
                <div class='lbl'>Your Name : </div> 
                <input type="text" name="username" id="username" class="txt">
                <input type="button" value="Set Name" onclick="setName();" class='btn'>
                <div id="istyping" class="cls-istyping"></div>
            </div>
            <div class="row">
                <div class='lbl'>Send Message : </div>
                <input type="text" id="input" onkeypress="setTyping(1, event);
                        timer = 5;" onkeyup="setTyping(0, event);" class="txt"/> <input type="button" value="Send" onclick="sendMessage();" class='btn'>
            </div>
        </div>
    </body>
</html>