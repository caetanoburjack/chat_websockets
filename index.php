<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Chat</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel="stylesheet" type="text/css" href="assets/css/style.css">
    <style>
        .divInputMessage {
            width: 100%;
            height: 0px;
            background: #232F48;
            z-index: 9999;
        }
    </style>
</head>
<body>
<div class="container" style="display: flex; flex-direction: row">
    <div class="colunaEsquerda">
        <img src="assets/img/chat.png" alt="Chat" title="Chat"/>
        <div class="salas" id="salas">

        </div>
        <form id="form1">
            <input type="text" id="room" name="room" placeholder="Sala" onfocusout="connect()">
            <input type="text" id="name" placeholder="Nome">
            <input type="text" id="message">
            <button id="btn1">Entrar na Sala</button>
        </form>
    </div>
    <div class="colunaDireita"
         style="display: flex; flex-direction: column; ">
        <div id="content"
             style="background: pink;display: flex; flex-direction: column; overflow-x: auto;">

        </div>
        <div class="divInputMessage">
            <form id="form2">
                <input type="text" id="mensagem"/>
                <button type="submit">Enviar</button>
            </form>
        </div>

    </div>
</div>

<script src="assets/js/autobahn.js"></script>
<script src="assets/js/script.js"></script>
</body>
</html>