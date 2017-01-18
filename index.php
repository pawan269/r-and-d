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
        <div id="popup_box">
            <h2 id="chat-title"></h2>
            <a id="popupBoxClose" href="javascript: void(0);" onclick="$('#popup_box').fadeOut('slow');">Close</a>
            <div id="121chatwindow"></div>
        </div>        
        <div class="userlist" id="userlist"></div>
        <div class="chatwindow" id="content"></div>
        <div class="row">
            <span>Your Name : </span> 
            <input type="text" name="username" id="username"/> <input type="button" value="Set Name" onclick="setName();">
            <span id="istyping" class="cls-istyping"></span>
        </div>
        <div class="row">
            <span>Send Message : </span>
            <input type="text" id="input" onkeypress="setTyping(1);
                    timer = 5;" onkeyup="setTyping(0);"/> <input type="button" value="Send" onclick="sendMessage();">
        </div>
    </body>
</html>