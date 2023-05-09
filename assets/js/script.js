var sendMessageForm = document.getElementById('sendMessageForm');
var newRoomForm = document.getElementById('newRoomForm');
var changeNameForm = document.getElementById('changeNameForm');
var content = document.getElementById('content');
var divSalas = document.getElementById('rooms');
var roomTitle = document.getElementById('roomTitle');
var spanUserName = document.getElementById('spanUserName');
var conn;
var conn_status = false;

window.onload = initizile;

function initizile() {
    mostrarSalas();
    showUserName();
}

function showUserName() {
    var userName = localStorage.getItem('chat_username');
    spanUserName.innerHTML = userName;
    console.log('Now your username is: ' + userName);
}

newRoomForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var roomName = document.getElementById('roomName').value;
    var userName = document.getElementById('userNameOnRoomForm').value;
    criarSala(roomName);
    saveUserName(userName);
    document.getElementById('roomName').value = '';
    document.getElementById('newRoomForm').style.display = 'none';
    localStorage.setItem('chat_current_room', roomName);
    console.log('Available Rooms: ' + localStorage.getItem('chat_rooms'))
    console.log('Current Room: ' + localStorage.getItem('chat_current_room'))
    connect();
});

changeNameForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var userName = document.getElementById('userName').value;
    saveUserName(userName);
    document.getElementById('userName').value = '';
    document.getElementById('changeNameForm').style.display = 'none';
});

sendMessageForm.addEventListener('submit', function (e) {
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
//     document.getElementById("dados").innerHTML = "Full Height: " + content.scrollHeight.toFixed() + "<br>Horizontally: " + content.scrollLeft.toFixed() + "<br>Vertically: " + content.scrollTop.toFixed();
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
    showUserName();
}

function connect() {
    var room = localStorage.getItem('chat_current_room') ? localStorage.getItem('chat_current_room') : 'room';
    if (conn_status) {
        conn.close();
        conn_status = false;
        content.innerHTML = '';
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
    mostrarSalas();
    mostrarNomeSala(room);
}

function mostrarSalas() {
    var roomsArmazenadas = localStorage.getItem('chat_rooms');
    if (roomsArmazenadas) {
        roomsArmazenadas = JSON.parse(roomsArmazenadas);
        divSalas.innerHTML = '';
        for (var i = 0; i < roomsArmazenadas.length; i++) {
            var p = document.createElement('p');
            p.setAttribute('class', 'each_room');
            p.setAttribute('onclick', 'activateRoom("' + roomsArmazenadas[i] + '")');
            p.textContent = roomsArmazenadas[i];
            divSalas.appendChild(p);
        }
    }
}

function mostrarNomeSala(room) {
    roomTitle.innerHTML = room;
}

//Printar Mensagens na Tela
function showMessages(data) {
    if (data.name == 'Caetano') {
        var img_src = "assets/img/user.png";
    } else if (data.name == 'bruno') {
        var img_src = "assets/img/user2.png";
    }

    var roomsArmazenadas = localStorage.getItem('chat_rooms')

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

    content.appendChild(div);
    content.scrollTop = content.scrollHeight;

}

function showNewRoomForm() {
    if (!localStorage.getItem('chat_username')) {
        document.getElementById('userNameOnRoomForm').style.display = 'inline-block'
    }
    document.getElementById('newRoomForm').style.display = 'inline-block';
}

function showChangeNameForm() {
    document.getElementById('changeNameForm').style.display = 'block';
}

function activateRoom(room) {
    localStorage.setItem('chat_current_room', room);
    console.log('Available Rooms: ' + localStorage.getItem('chat_rooms'))
    console.log('Current Room: ' + localStorage.getItem('chat_current_room'))
    connect();
}