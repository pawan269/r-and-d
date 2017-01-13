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
        </style>
        <script src="socket.io.js"></script>
        <script src="jquery.min.js"></script>
        <script>
//                var chat_server = new WebSocket("ws://10.2.42.98:2609");
            var chat_server = new WebSocket("ws://localhost:2609");

            chat_server.onopen = function(event) {
                $("#input").focus();
            };

            chat_server.onmessage = function(event) {
                var _packet = JSON.parse(event.data);
                switch (_packet.type) {
                    case 'chat' :
                        addMessage(_packet.username, _packet.message);
                        break;
                    case 'userlist' :
                        addUserList(_packet.users, _packet.IDs);
                        break;
                }

                $("#input").focus();
                scroll();
            }

            function sendMessage() {
                var _packet = {
                    'type': 'chat',
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
            function addUserList(users, IDs) {
                $("#userlist").html('');
                for (var i = 0; i < users.length; i++) {
                    $("#userlist").append('<div class="userlistrow" onclick="selectUser(\'' + IDs[i] + '\', \'' + users[i] + '\')">' + users[i] + '</div>');
//                    console.log(users[i]);
                }
            }
            function selectUser(sessionid, user) {
                if (user == $("#username").val()) {
                    alert('you can not chat with you!');
                } else {
                    $("#content").html('chat with ' + user);
                }
            }
        </script>
    </head>
    <body>
        <div class="userlist" id="userlist"></div>
        <div class="chatwindow" id="content"></div>
        <div class="row">
            <span>Your Name : </span> 
            <input type="text" name="username" id="username"/>
        </div>
        <div class="row">
            <span>Send Message : </span>
            <input type="text" id="input"/> <input type="button" value="send" onclick="sendMessage();">
        </div>
    </body>
</html>