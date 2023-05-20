<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Chat with WebSocket</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel="stylesheet" type="text/css" href="assets/css/style.css?v=1">
</head>
<div id="container">
    <div id="leftColumn">
        <div id="logoDiv">
            <img id="logoImg" src="assets/img/chat.png"/>
        </div>
        <form id="newRoomForm" style="display: none">
            <input type="text" id="roomName" name="roomName" required="required" placeholder="Room Name">
            <input type="text" id="userNameOnRoomForm" name="userName" placeholder="User Name" style="display: none">
            <button class="defaultBtn" style="display: none" id="btnCreateRoom">Create Room</button>
        </form>
        <button class="defaultBtn" onclick="showNewRoomForm()" id="newRoom">New Room</button>
        <div id="roomsDiv">

        </div>
        <div id="userNameDiv">
            <img id="userAvatar" src="assets/img/user.png"/>
            <div id="userName">
                <form id="changeNameForm" style="display: none">
                    <input type="text" id="userNameInput" name="userName" placeholder="User Name">
                    <button class="defaultBtn" id="btnCreateRoom" style="display: none">Save User Name</button>
                </form>
                <span id="userNameSpan"></span>
                <span id="editUserName" onclick="showChangeNameForm()">Edit Name</span>
            </div>
        </div>
    </div>

    <div id="rightColumn">
        <div id="roomTitleDiv">
        </div>

        <div id="talkingDiv">
        </div>

        <div id="messageInputDiv">
            <form id="messageSendingForm">
                <input type="text" class="messageInput" autocomplete="false" id="message"/>
            </form>
        </div>
    </div>

</div>
<script src="assets/js/autobahn.js"></script>
<script src="assets/js/script.js"></script>
</body>
</html>