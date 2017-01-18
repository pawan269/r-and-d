<?php
session_start();
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Chat Application</title>
        <style>
            .chatwindow {
                padding:5px; 
                background:#ddd; 
                border-radius:5px; 
                overflow-y: scroll;
                border:1px solid #CCC; 
                margin-top:10px; 
                height: 500px;
                width: 60%;
                float: right;
            }
            .userlist {
                margin-top:10px; 
                height: 500px;
                width: 20%;
                border: 1px solid #dbdbdb;
                float: left;
            }
            .row{
                width: 60%;
                height: 20px;
                margin: 10px;
                clear: both;
                float: right;
            }
            .userlistrow {
                height: 30px;
                padding: 1px;
                margin: 1px;
                background-color: #f2f2f2;
                border: 1px solid #dbdbdb;
                cursor: pointer;
            }
            /* popup_box DIV-Styles*/
            #popup_box { 
                display:none; /* Hide the DIV */
                position:fixed;  
                _position:absolute; /* hack for internet explorer 6 */  
                height:300px;  
                width:600px;  
                background:#FFFFFF;  
                left: 300px;
                top: 150px;
                z-index:100; /* Layering ( on-top of others), if you have lots of layers: I just maximized, you can change it yourself */
                margin-left: 15px;  

                /* additional features, can be omitted */
                border:2px solid #ff0000;      
                padding:15px;  
                font-size:15px;  
                -moz-box-shadow: 0 0 5px #ff0000;
                -webkit-box-shadow: 0 0 5px #ff0000;
                box-shadow: 0 0 5px #ff0000;

            }

            #container {
                background: #d2d2d2; /*Sample*/
                width:100%;
                height:100%;
            }

            a{  
                cursor: pointer;  
                text-decoration:none;  
            } 

            /* This is for the positioning of the Close Link */
            #popupBoxClose {
                font-size:20px;  
                line-height:15px;  
                right:5px;  
                top:5px;  
                position:absolute;  
                color:#6fa5e2;  
                font-weight:500;      
            }            
        </style>
        <script src="socket.io.js"></script>
        <script src="jquery.min.js"></script>
        <script>
//                var chat_server = new WebSocket("ws://10.2.42.98:2609");
            var chat_server = new WebSocket("ws://localhost:2609");

            chat_server.onopen = function(event) {
                var _packet = {
                    'type': 'useronline',
                    'ID': '<?php echo session_id(); ?>',
                    'username': $("#username").val(),
                    'message': ''
                };
                chat_server.send(JSON.stringify(_packet));
                $("#input").focus();
            };

            chat_server.onmessage = function(event) {
                var _packet = JSON.parse(event.data);
                switch (_packet.type) {
                    case 'groupchat' :
                        addMessage(_packet.username, _packet.message);
                        break;
                    case 'userlist' :
                        addUserList(_packet.users);
                        break;
                    case 'useronline' :
                        addUserList(_packet.users);
                        break;
                }

                $("#input").focus();
                scroll();
            }

            function sendMessage() {
                var _packet = {
                    'type': 'groupchat',
                    'ID': '<?php echo session_id(); ?>',
                    'username': $("#username").val(),
                    'message': $("#input").val()
                };
                chat_server.send(JSON.stringify(_packet));
                $("#input").val('');
                $("#input").focus();
                scroll();
            }

            function scroll() {
                var elem = document.getElementById('content');
                elem.scrollTop = elem.scrollHeight;
            }

            function addMessage(username, message) {
                $("#content").append('<ul><li><b>' + username + '</b>: ' + message + '</li></ul>');
            }

            function addUserList(users) {
//                console.log(users);
                $("#userlist").html('');
                for (var i = 0; i < users.length; i++) {
                    $("#userlist").append('<div class="userlistrow" onclick="selectUser(\'' + users[i]['userid'] + '\', \'' + users[i]['username'] + '\')">' + users[i]['username'] + '</div>');
//                    console.log(users[i]);
                }
            }

            function selectUser(sessionid, user) {
                if (sessionid == '<?php echo session_id(); ?>') {
                    alert('you can not chat with youself!');
                } else {
                    $('#popup_box').fadeIn("slow");
                    $("#chat-title").html("Chat with " + user);
                    var _packet = {
                        'type': 'init121chat',
                        'ID': '<?php echo session_id(); ?>',
                        'username': $("#username").val(),
                        'message': '<?php echo session_id(); ?>' + '-' + sessionid
                    }
                    chat_server.send(JSON.stringify(_packet));
                }
            }

            function setName() {
                var _packet = {
                    'type': 'setname',
                    'ID': '<?php echo session_id(); ?>',
                    'username': $("#username").val(),
                    'message': ''
                };
                chat_server.send(JSON.stringify(_packet));
            }

        </script>
    </head>
    <body>
        <div id="popup_box">    <!-- OUR PopupBox DIV-->
            <h2 id="chat-title"></h2>
            <a id="popupBoxClose" href="javascript: void(0);" onclick="$('#popup_box').fadeOut('slow');">Close</a>
            <div id="121chatwindow"></div>
        </div>        
        <div class="userlist" id="userlist"></div>
        <div class="chatwindow" id="content"></div>
        <div class="row">
            <span>Your Name : </span> 
            <input type="text" name="username" id="username"/> <input type="button" value="Set Name" onclick="setName();">
        </div>
        <div class="row">
            <span>Send Message : </span>
            <input type="text" id="input"/> <input type="button" value="Send" onclick="sendMessage();">
        </div>
    </body>
</html>