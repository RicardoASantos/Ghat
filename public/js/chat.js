//Make connection
var socket = io.connect();

$(document).ready(function(){

  // Query DOM
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
  var $send = $('.send-message-button');
  var $usernameMessage = $('.messageUser');


  var roomName = $('#new-group-input');
  var newGroupForm = $('#new-group-form');
  var roomZone = $('.roomZone');

  //Create new room
  newGroupForm.submit(function(a){
    a.preventDefault();
    socket.emit('new room name', roomName.val());
    console.log('Created!');
  });

  //Retrieve rooms
  socket.on('load rooms', function(docs){
    for(var i=docs.length-1; i >= 0; i--){
      displayRooms(docs[i]);
    }
  });

  function displayRooms(data){
    roomZone.append('  <a class="home-conversation"> <figure class="home-conversation-icon"> <img src="https://i.imgur.com/ji6qi2p.gif" > </figure> <div class="home-conversation-text-info">  <p class="home-conversation-name">'+data.room_name+'</p> <p class="home-conversation-time">'+data.created+'</p> <p class="room_id">'+data.room_id+'</p> </div> <figure class="home-conversation-latest-message"> <img src="http://static.comicvine.com/uploads/scale_super/6/69852/3468148-cage-gifs-monster.gif" />  </figure>  </a>')
  }

  //Connect to room
  function updateRooms() {
    $('.home-conversation').click(function(){

      var thisRoomId = $(this).find('.room_id').text();
      console.log(thisRoomId);

      var thisRoomName = $(this).find('.home-conversation-name').text();
      $('#user').val(thisRoomName);
      $('#roomName_edit').val(thisRoomName);

      socket.emit('join room', thisRoomId);
      $('.dashboard').animate({marginLeft: '-100vw'});
      $('.chat-screen').animate({marginLeft: '0'});
    });
  }

  setTimeout(updateRooms, 300);

  //Send Message to group
  $send.click(function(e){
    e.preventDefault();

    socket.emit('send group message' , $message.val());
    $message.val('');
    socket.emit('new user' , $username.val());
  });

  $messageForm.submit(function(e){
    e.preventDefault();
    socket.emit('send group  message' , $message.val());
    $message.val('');
    socket.emit('new user' , $username.val());
  });

  //Load old messages
  socket.on('load old msgs', function(docs){
    for(var i=docs.length-1; i >= 0; i--){
      displayMsg(docs[i]);
    }
  });

  //New message
  socket.on('new group message', function(data){
    displayMsg(data);
    var messageBody = document.getElementById('chat-window');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  });

  //Display user is writing message
  message.addEventListener('keypress', function(){
    socket.emit('typing', $username.val());
  });

  //Write message Front-End
  function displayMsg(data){

    function checkUser(){
      console.log($username.val());
      console.log(data.user);

      if( $username.val() === data.user){
        $chat.append('<div class="card cardMine"> <p>' +data.user+ '</p> ' +data.msg+ '</div>');
      } else {
        $chat.append('<div class="card"> <p>' +data.user+ '</p> ' +data.msg+ '</div>');
      }
    }
    checkUser();

  }

  socket.on('typing',  function(data){
    feedback.innerHTML = '<p><em>' +data+ ' is typing a message...</em></p>'
  });


  socket.on('get users', function(data){
    var html = '';
    for (var i = 0;i < data.length;i++){
      html += '<li class="list-group-item">' +data[i]+ '</li>';
    }
    $users.html(html);
  });


  //Save New Setting to Database


  $('.edit_group').click(function(){

    if ( $('.edit_group').hasClass('save_settings') ){
      $(this).text('Edit group');
      $(this).removeClass('save_settings');

      $("#roomName_edit").attr('readonly', true);

      var NewRoomName = $('#roomName_edit').val();

      $('#user').val(NewRoomName);

      var OldRoomName = $('#user').val();
      console.log(NewRoomName);

      socket.emit('edit room name', NewRoomName);
      socket.emit('old room name',  OldRoomName);

    } else {
      $(this).text('Save settings');
      $(this).addClass('save_settings');

      $("#roomName_edit").removeAttr('readonly');
    }

  });


















});
