var messageSendingForm = document.getElementById('messageSendingForm');
var newRoomForm = document.getElementById('newRoomForm');
var changeNameForm = document.getElementById('changeNameForm');
var talkingDiv = document.getElementById('talkingDiv');
var roomsDiv = document.getElementById('roomsDiv');
var roomTitleDiv = document.getElementById('roomTitleDiv');
var userNameSpan = document.getElementById('userNameSpan');
var currentRoom = localStorage.getItem('chat_current_room');
var conn;
var conn_status = false;
var storedRooms = localStorage.getItem('chat_rooms');
var storedUserName = localStorage.getItem('chat_username');

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
    console.log('Now your username is: ' + userName ?? storedUserName);
}

newRoomForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var roomName = document.getElementById('roomName').value;
    var userName = document.getElementById('userNameOnRoomForm').value;
    criarSala(roomName);
    if (userName) {
        saveUserName(userName);
    }
    document.getElementById('roomName').value = '';
    newRoomForm.style.display = 'none';
    document.getElementById('newRoom').style.display = 'inline-block';
    localStorage.setItem('chat_current_room', roomName);
    console.log('Available Rooms: ' + localStorage.getItem('chat_rooms'))
    console.log('Current Room: ' + localStorage.getItem('chat_current_room'))
    connect();
});

changeNameForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    var userName = document.getElementById('userNameInput').value;
    await saveUserName(userName);
    document.getElementById('userNameInput').value = '';
    changeNameForm.style.display = 'none';
    document.getElementById('userNameSpan').style.display = 'block';
    document.getElementById('editUserName').style.display = 'block';
});

messageSendingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = localStorage.getItem('chat_username');
    var room = localStorage.getItem('chat_current_room');
    var message = document.getElementById('message').value;

    if (name && message) {

        $msgTime = getRightTime();
        var data = {
            'name': name, 'message': message, 'msgTime': $msgTime
        };

        conn.publish(room, data);
    }
    document.getElementById('message').value = '';
    document.getElementById('message').focus();
    console.log('Available Rooms: ' + localStorage.getItem('chat_rooms'))
    console.log('Current Room: ' + localStorage.getItem('chat_current_room'))
});

function getRightTime() {
    var msgTime = new Date();
    var dia = msgTime.getDate();               // 1-31
    var dia_sem = msgTime.getDay();            // 0-6 (zero=sunday)
    var mes = msgTime.getMonth();              // 0-11 (zero=january)
    var ano2 = msgTime.getYear();                      // 2 digits
    var ano4 = msgTime.getFullYear();          // 4 digits
    var hora = msgTime.getHours();             // 0-23
    var min = msgTime.getMinutes();            // 0-59
    var seg = msgTime.getSeconds();            // 0-59
    var mseg = msgTime.getMilliseconds();      // 0-999
    var tz = msgTime.getTimezoneOffset();      // in minutes

    var str_data = (mes + 1) + '/' + dia + '/' + ano4;
    var str_hora = hora + ':' + min + ':' + seg;

    return str_data + ' ' + str_hora;
}

// function mostrarDados() {
//     document.getElementById("dados").innerHTML = "Full Height: " + talkingDiv.scrollHeight.toFixed() + "<br>Horizontally: " + talkingDiv.scrollLeft.toFixed() + "<br>Vertically: " + talkingDiv.scrollTop.toFixed();
// }

function criarSala(room) {
    var rooms = localStorage.getItem('chat_rooms');
    if (rooms) {
        var arraySalas = JSON.parse(rooms);
        if (arraySalas.indexOf(room) == -1) {
            arraySalas.push(room);
            var arraySalasJson = JSON.stringify(arraySalas);
            localStorage.setItem('chat_rooms', arraySalasJson);
        } else {
            console.log("The room " + room + " already exists!");
        }
    } else {
        var arraySalas = [room];
        var arraySalasJson = JSON.stringify(arraySalas);
        localStorage.setItem('chat_rooms', arraySalasJson);
    }
    tornarSalaAtual(room);
}

function tornarSalaAtual(room) {
    localStorage.setItem('chat_current_room', room);
    console.log('Now the current room is: ' + room);
}

function saveUserName(userName) {
    localStorage.setItem('chat_username', userName);
    showUserName(userName);
}

function connect() {
    var room = localStorage.getItem('chat_current_room') ? localStorage.getItem('chat_current_room') : 'room';
    if (conn_status) {
        conn.close();
        conn_status = false;
        talkingDiv.innerHTML = '';
    }
    console.log('Connecting to ' + room);
    conn = new ab.Session('ws://chat.localhost:8080', function () {
        conn_status = true;
        tornarSalaAtual(room);
        conn.subscribe(room, function (topic, data) {
            console.log('Conected to ' + room);
            console.log('Messages of ' + room + ': ' + data);
            if (typeof data === 'string') {
                data = JSON.parse(data);

                for (var i = 0; i < data.length; i++) {
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
    var storedRooms = localStorage.getItem('chat_rooms');
    if (storedRooms) {
        storedRooms = JSON.parse(storedRooms);
        roomsDiv.innerHTML = '';
        for (var i = 0; i < storedRooms.length; i++) {
            var p = document.createElement('p');
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
    var img_src = "assets/img/user.png";

    var storedRooms = localStorage.getItem('chat_rooms')

    var div = document.createElement('div');
    div.setAttribute('class', 'me');

    var img = document.createElement('img');
    img.setAttribute('src', img_src);

    var div_txt = document.createElement('div');
    div_txt.setAttribute('class', 'text');

    var span = document.createElement('span');
    span.setAttribute('class', 'msgTime');
    span.textContent = data.msgTime;

    var h5 = document.createElement('h5');
    h5.textContent = data.name;
    h5.appendChild(span);

    var p = document.createElement('p');
    p.textContent = data.message;

    div_txt.appendChild(h5);
    div_txt.appendChild(p);

    div.appendChild(img);
    div.appendChild(div_txt);

    talkingDiv.appendChild(div);
    talkingDiv.scrollTop = talkingDiv.scrollHeight;
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
    talkingDiv.scrollTop = talkingDiv.scrollHeight;
    console.log('Available Rooms: ' + localStorage.getItem('chat_rooms'))
    console.log('Current Room: ' + localStorage.getItem('chat_current_room'))
    connect();
}