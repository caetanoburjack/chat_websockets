<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Chat</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel="stylesheet" type="text/css" href="assets/css/style.css">
</head>
<body>
<div class="container">
    <div class="leftColumn">
        <img src="assets/img/chat.png" alt="Chat" title="Chat"/>
        <button class="defaultBtn" onclick="showNewRoomForm()" id="newRoom">New Room</button>
        <form id="newRoomForm" style="display: none">
            <input type="text" id="roomName" name="roomName" placeholder="Room Name">
            <input type="text" id="userNameOnRoomForm" name="userName" placeholder="User Name" style="display: none">
            <button class="defaultBtn" id="btnCreateRoom">Create Room</button>
        </form>

        <div class="rooms" id="rooms"></div>
        <form id="changeNameForm" style="display: none">
            <input type="text" id="userName" name="userName" placeholder="User Name">
            <button class="defaultBtn" id="btnCreateRoom">Save User Name</button>
        </form>
        <div id="divUserName">
            <span id="spanUserName"></span>
            <button class="defaultBtn" onclick="showChangeNameForm()" id="changeName">Change User
                Name
            </button>
        </div>
    </div>

    <div class="rightColumn">
        <div id="roomTitle"></div>
        <div id="content"></div>
        <div class="divInputMessage">
            <form id="sendMessageForm">
                <input type="text" class="inputMessage" autocomplete="false" id="message"/>
            </form>
        </div>
    </div>

</div>

<script src="assets/js/autobahn.js"></script>
<script src="assets/js/script.js"></script>

</body>
</html>