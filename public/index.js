//  ________  ________  ________  ___  ________  _________  ________      
// |\   ____\|\   ____\|\   __  \|\  \|\   __  \|\___   ___\\   ____\     
// \ \  \___|\ \  \___|\ \  \|\  \ \  \ \  \|\  \|___ \  \_\ \  \___|_    
//  \ \_____  \ \  \    \ \   _  _\ \  \ \   ____\   \ \  \ \ \_____  \   
//   \|____|\  \ \  \____\ \  \\  \\ \  \ \  \___|    \ \  \ \|____|\  \  
//     ____\_\  \ \_______\ \__\\ _\\ \__\ \__\        \ \__\  ____\_\  \ 
//    |\_________\|_______|\|__|\|__|\|__|\|__|         \|__| |\_________\
//    \|_________|                                            \|_________|

$(() => {
  const socket = io();
  const ENTER_KEY_CODE = 13;
  const EVENT_CHAT_MESSAGE = 'chat-message'
  const EVENT_NOTIFICATION = 'notification'

  const scrollToMessagesBottom = () => {
    $(window).scrollTop($("#form").offset().top);
  };
  
  // sets the hidden text-sizer's content to be the same as the textarea to size textarea
  // use text not html, so user can only input text or html text
  // and chat bubbles will render html
  const autoSizeTextArea = () => {
    $('#textsizer').text($('#textarea').val() + '\n');
  };

  // on input in textarea, auto size the text-sizer
  // this div will size the textarea and grow as the input does
  $(() => {
    autoSizeTextArea(); // size for initial content
    $('#textarea').on('input', autoSizeTextArea);
  });

  // sendbutton click: get the textarea input and emit a new chat message, update UI
  $('#sendbutton').click((e) => {
    e.preventDefault(); // prevents page reloading
    const input = $('#textarea').val();
    socket.emit(EVENT_CHAT_MESSAGE, input);
    $('#textarea').val('');
    autoSizeTextArea();
  });

  // logo click: open ssa site in new tab
  $('#logo').click((e) => {
    window.open('https://sierraspaceagency.com/', '_blank');
  });

  // Enter key down: just prevent default so we don't get a /n
  $('#textarea').keydown((e) => {
    const keycode = e.keyCode ? e.keyCode : e.which
    if (keycode === ENTER_KEY_CODE) e.preventDefault();
  });

  // Enter key up: now send the message - call sendbutton click handler
  $('#textarea').keyup((e) => {
    const keycode = e.keyCode ? e.keyCode : e.which
    if (keycode === ENTER_KEY_CODE) {
      e.preventDefault();
      $('#sendbutton').click();
    }
  });

  // New chat message: wrap a li in a div and render html/text content for msg
  // scroll the messages to the bottom
  socket.on(EVENT_CHAT_MESSAGE, (msg) => {
    const li = $('<div>').append($('<li>').addClass('chat-message').html(msg));
    $('#messages').append($(li));
    scrollToMessagesBottom();
  });

  // New notification: append a notification li w/ the msg text & scroll
  socket.on(EVENT_NOTIFICATION, (msg) => {
    const li = $('<div>').append($('<li>').addClass('notification').text(msg));
    $('#messages').append($(li));
    scrollToMessagesBottom();
  });
});