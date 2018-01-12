$(document).ready(function(){

  $('.main_header .zmdi-menu').click(function(){
    $('.menu-flap').animate({marginLeft: '0' });
    $('.menu-flap-screen').css({display: 'block'});
    $('.menu-flap-screen').animate({opacity: '1'});
  });

  $('.menu-flap-screen').click(function(){
    $('.menu-flap').animate({marginLeft: '-70%' });
    $('.menu-flap-screen').animate({opacity: '0'}, function(){
      $('.menu-flap-screen').css({display: 'none'});
    });
    $('.create-new-group').animate({opacity: '0', function(){
      $('.create-new-group').css({display: 'none'});
    }});
  });

  $('.menu-flap-screen, .menu-flap').on( "swipeleft", function(){
    $('.menu-flap').animate({marginLeft: '-70%' });
    $('.menu-flap-screen').animate({opacity: '0'}, function(){
      $('.menu-flap-screen').css({display: 'none'});
    });
  } );

  $('.home-add-button').click(function(){

    if ( $('.home-add-button').hasClass('add-button-active') ){
      $('.add-button-active').addClass('home-add-button');
      $('.add-button-active').css({transform: 'rotate(0deg)'});
      $('.home-add-button').removeClass('add-button-active');
      $('.home-add-contact, .home-add-group').hide();
    } else {
      $('.home-add-button').addClass('add-button-active');
      $('.home-add-button').css({transform: 'rotate(45deg)'});
      $('.home-add-contact, .home-add-group').show();
    }

  });

  $('.home-add-group').click(function(){
    $('.menu-flap-screen').css({display: 'block'});
    $('.menu-flap-screen').animate({opacity: '1'});
    $('.create-new-group').css({display: 'block'});
    $('.create-new-group').animate({opacity: '1'});
  });

  $('.chat-back').click(function(){
    $('.dashboard').animate({marginLeft: '0vw'});
    $('.chat-screen').animate({marginLeft: '100vw'});
  });

  $('.user_nav img').click(function(){
    $('.chat-screen').animate({marginLeft: '-100vw'});
    $('.edit_room').animate({marginLeft: '0vw'});
  });

  $('.setting-back').click(function(){
    $('.chat-screen').animate({marginLeft: '0vw'});
    $('.edit_room').animate({marginLeft: '100vw'});
  });

});
