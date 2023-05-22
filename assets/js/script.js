const messageSendingForm = document.getElementById('messageSendingForm');
const newRoomForm = document.getElementById('newRoomForm');
const changeNameForm = document.getElementById('changeNameForm');
const talkDiv = document.getElementById('talkDiv');
const roomsDiv = document.getElementById('roomsDiv');
const roomTitleDiv = document.getElementById('roomTitleDiv');
const userNameSpan = document.getElementById('userNameSpan');
let currentRoom = localStorage.getItem('chat_current_room');
let conn;
let conn_status = false;
let storedRooms = localStorage.getItem('chat_rooms');
let storedUserName = localStorage.getItem('chat_username');

window.onload = initizile;

function initizile() {
    showRooms();
    showUserName();
    if (currentRoom) {
        activateRoom(currentRoom);
    } else if (storedRooms.length > 0) {
        storedRooms = JSON.parse(storedRooms);
        activateRoom(storedRooms[0]);
    } else {
        activateRoom('room');
    }
}

function showUserName(userName = null) {
    userNameSpan.innerHTML = userName ?? storedUserName;
}

newRoomForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let roomName = document.getElementById('roomName').value;
    let userName = document.getElementById('userNameOnRoomForm').value;
    createRoom(roomName);
    if (userName) {
        saveUserName(userName);
    }
    document.getElementById('roomName').value = '';
    newRoomForm.style.display = 'none';
    document.getElementById('newRoom').style.display = 'inline-block';
    localStorage.setItem('chat_current_room', roomName);
    connect();
});

changeNameForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    let userName = document.getElementById('userNameInput').value;
    await saveUserName(userName);
    document.getElementById('userNameInput').value = '';
    changeNameForm.style.display = 'none';
    document.getElementById('userNameSpan').style.display = 'block';
    document.getElementById('editUserName').style.display = 'block';
});

messageSendingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    let name = localStorage.getItem('chat_username');
    let room = localStorage.getItem('chat_current_room');
    let message = document.getElementById('message').value;

    let $msgTime;
    if (name && message) {

        $msgTime = getRightTime();
        let data = {
            'name': name, 'message': message, 'msgTime': $msgTime
        };

        conn.publish(room, data);
    }
    document.getElementById('message').value = '';
    document.getElementById('message').focus();
});

function getRightTime() {
    let msgTime = new Date();
    let day = msgTime.getDate();               // 1-31
    let mes = msgTime.getMonth();              // 0-11 (zero=january)
    let year4 = msgTime.getFullYear();         // 4 digits
    let hour = msgTime.getHours();             // 0-23
    let min = msgTime.getMinutes();            // 0-59
    let sec = msgTime.getSeconds();            // 0-59

    let str_data = (mes + 1) + '/' + day + '/' + year4;
    let str_hour = hour + ':' + min + ':' + sec;

    return str_data + ' ' + str_hour;
}

function createRoom(room) {
    let rooms = localStorage.getItem('chat_rooms');
    if (rooms) {
        let roomsArray = JSON.parse(rooms);
        if (roomsArray.indexOf(room) === -1) {
            roomsArray.push(room);
            let roomsArrayJson = JSON.stringify(roomsArray);
            localStorage.setItem('chat_rooms', roomsArrayJson);
        }
    } else {
        let roomsArray = [room];
        let roomsArrayJson = JSON.stringify(roomsArray);
        localStorage.setItem('chat_rooms', roomsArrayJson);
    }
    makeCurrentRoom(room);
}

function makeCurrentRoom(room) {
    localStorage.setItem('chat_current_room', room);
}

function saveUserName(userName) {
    localStorage.setItem('chat_username', userName);
    showUserName(userName);
}

function connect() {
    let room = localStorage.getItem('chat_current_room') ? localStorage.getItem('chat_current_room') : 'room';
    if (conn_status) {
        conn.close();
        conn_status = false;
        talkDiv.innerHTML = '';
    }
    conn = new ab.Session('ws://localhost:8080', function () { //Using autobahn in order to start a websocket session.
        conn_status = true;
        makeCurrentRoom(room);
        conn.subscribe(room, function (topic, data) {
            if (typeof data === 'string') {
                data = JSON.parse(data);

                for (let i = 0; i < data.length; i++) {
                    showMessages(data[i]);
                }
            } else {
                showMessages(data);
            }
        });
    }, function () {
        console.warn('WebSocket connection closed');
    }, {'skipSubprotocolCheck': true});
    showRooms();
    showRoomName(room);
}

function showRooms() {
    let storedRooms = localStorage.getItem('chat_rooms');
    if (storedRooms) {
        storedRooms = JSON.parse(storedRooms);
        roomsDiv.innerHTML = '';
        for (let i = 0; i < storedRooms.length; i++) {
            let p = document.createElement('p');
            p.setAttribute('class', 'each_room');
            p.setAttribute('onclick', 'activateRoom("' + storedRooms[i] + '")');
            p.textContent = storedRooms[i];
            roomsDiv.appendChild(p);
        }
    }
}

function showRoomName(room) {
    roomTitleDiv.innerHTML = room;
}

//Printar Mensagens na Tela
function showMessages(data) {
    let img_src = "assets/img/user.png";

    let div = document.createElement('div');
    div.setAttribute('class', 'me');

    let img = document.createElement('img');
    img.setAttribute('src', img_src);

    let div_txt = document.createElement('div');
    div_txt.setAttribute('class', 'text');

    let span = document.createElement('span');
    span.setAttribute('class', 'msgTime');
    span.textContent = data.msgTime;

    let h5 = document.createElement('h5');
    h5.textContent = data.name;
    h5.appendChild(span);

    let p = document.createElement('p');
    p.textContent = data.message;

    div_txt.appendChild(h5);
    div_txt.appendChild(p);

    div.appendChild(img);
    div.appendChild(div_txt);

    talkDiv.appendChild(div);
    talkDiv.scrollTop = talkDiv.scrollHeight;
}

function showNewRoomForm() {
    if (!localStorage.getItem('chat_username')) {
        document.getElementById('userNameOnRoomForm').style.display = 'inline-block'
    }
    document.getElementById('newRoom').style.display = 'none';
    newRoomForm.style.display = 'flex';
    document.getElementById('roomName').focus();
}

function showChangeNameForm() {
    changeNameForm.style.display = 'block';
    document.getElementById('userNameSpan').style.display = 'none';
    document.getElementById('editUserName').style.display = 'none';
    document.getElementById('userNameInput').focus();
}

function activateRoom(room) {
    localStorage.setItem('chat_current_room', room);
    talkDiv.scrollTop = talkDiv.scrollHeight;
    connect();
}