var form1 = document.getElementById('form1');
var content = document.getElementById('content');
var divSalas = document.getElementById('salas');
var conn;
var conn_status = false;
window.onload = connect;

form1.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = localStorage.getItem('chat_usuario') ? localStorage.getItem('chat_usuario') : document.getElementById('name').value;
    var room = document.getElementById('room').value;
    var message = document.getElementById('message').value;
    localStorage.setItem('chat_sala_atual', room);
    localStorage.setItem('chat_usuario', name);
    //criarSala(room);

    if (name && message) {
        var data = {'name': name, 'message': message};

        conn.publish(room, data);
    }
    console.log('Salas existentes: ' + localStorage.getItem('chat_salas'))
    console.log('A sala atual eh: ' + localStorage.getItem('chat_sala_atual'))
});


form2.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = localStorage.getItem('chat_usuario') ? localStorage.getItem('chat_usuario') : document.getElementById('name').value;
    var room = localStorage.getItem('chat_sala_atual');
    var message = document.getElementById('mensagem').value;

    if (name && message) {
        var data = {'name': name, 'message': message};

        conn.publish(room, data);
    }
    document.getElementById('mensagem').value = '';
    document.getElementById('mensagem').focus();
    console.log("Altua atual da div: " + content.scrollHeight);
    console.log('Salas existentes: ' + localStorage.getItem('chat_salas'))
    console.log('A sala atual eh: ' + localStorage.getItem('chat_sala_atual'))
});

// function mostrarDados() {
//     document.getElementById("dados").innerHTML = "Full Height: " + content.scrollHeight.toFixed() + "<br>Horizontally: " + content.scrollLeft.toFixed() + "<br>Vertically: " + content.scrollTop.toFixed();
// }

function criarSala(sala) {
    var salas = localStorage.getItem('chat_salas');
    if (salas) {
        var arraySalas = JSON.parse(salas);
        if (arraySalas.indexOf(sala) == -1) {
            arraySalas.push(sala);
            var arraySalasJson = JSON.stringify(arraySalas);
            localStorage.setItem('chat_salas', arraySalasJson);
        } else {
            console.log("A sala " + sala + " já existe!");
        }
    } else {
        var arraySalas = [sala];
        var arraySalasJson = JSON.stringify(arraySalas);
        localStorage.setItem('chat_salas', arraySalasJson);
    }
    tornarSalaAtual(sala);
}

function tornarSalaAtual(sala) {
    localStorage.setItem('chat_sala_atual', sala);
    console.log('Agora a sala atual é a ' + sala);
}

function connect() {
    var room = document.getElementById('room').value;
    if (conn_status) {
        conn.close();
        conn_status = false;
        content.innerHTML = '';
    }
    console.log('Se conectando a ' + room);
    conn = new ab.Session('ws://chat.localhost:8080', function () {
        conn_status = true;
        tornarSalaAtual(room);
        conn.subscribe(room, function (topic, data) {
            console.log('Conectado a ' + room);
            console.log('Mensagens da sala ' + room + ': ' + data);
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

}

function mostrarSalas(data) {
    var salasArmazenadas = localStorage.getItem('chat_salas');
    salasArmazenadas = JSON.parse(salasArmazenadas);
    for (var i = 0; i < salasArmazenadas.length; i++) {
        var p = document.createElement('p');
        p.setAttribute('class', 'cada_sala');
        p.textContent = salasArmazenadas[i];
        divSalas.appendChild(p);
    }
}

//Printar Mensagens na Tela
function showMessages(data) {
    if (data.name == 'rafa') {
        var img_src = "assets/imgs/user.png";
    } else if (data.name == 'bruno') {
        var img_src = "assets/imgs/user2.png";
    }

    var salasArmazenadas = localStorage.getItem('chat_salas')

    var div = document.createElement('div');
    div.setAttribute('class', 'me');

    var img = document.createElement('img');
    img.setAttribute('src', img_src);

    var div_txt = document.createElement('div');
    div_txt.setAttribute('class', 'text');

    var h5 = document.createElement('h5');
    h5.textContent = data.name;

    var p = document.createElement('p');
    p.textContent = data.message;

    div_txt.appendChild(h5);
    div_txt.appendChild(p);

    div.appendChild(img);
    div.appendChild(div_txt);

    content.appendChild(div);
    content.scrollTop = content.scrollHeight - 705;

}