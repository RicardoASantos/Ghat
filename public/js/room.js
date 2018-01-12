// set-up a connection between the client and the server
var socket = io.connect();

socket.emit("subscribe", { room: "global" });

socket.on("roomChanged", function(data) {
    console.log("roomChanged", data);
});

var messageinput = document.getElementById('message'),
      users = document.getElementById('user'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');
      input = document.getElementById('input');

var $messageForm = $('#messageForm');
var $message = $('#message');
var $chat = $('#output');
var $username = $('#user');
var $users = $('#users');

// Emit events
$messageForm.submit(function(e){
  e.preventDefault();
  socket.emit('send group message' , $message.val());
  $message.val('');
  socket.emit('new user to group' , $username.val());
});

//Write message Front-End
function displayMsg(data){
  feedback.innerHTML = '';
  $chat.append('<div class="card">' +data.user+ ': ' +data.msg+ '</div>');
}

//New message
socket.on('new group message', function(data){
  displayMsg(data);
  var messageBody = document.getElementById('chat-window');
  messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
});
