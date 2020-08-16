function sendMessage(e){
    let content = messageContent.value;
    if(!content.length || content.trim() == ''){
      e.preventDefault();
    } else{
      // const mess = JSON.stringify({ type: 'message', text: content.val(), user: currentName });
      // socket.send(mess);
      let myMessage = document.createElement('div');
      myMessage.className = 'message message_my';
      let date = new Date().toTimeString().substr(0, 8);
      myMessage.innerHTML = '<div class="message_my_content">'+'<div class="message-info">' + '<span class="nameInMessage">Me </span>'+ '<span class="time">'+ date+ '</span>' +'</div>' +'<div class="message_text_my">'+content+ '</div>' +'</div>' ;
      chat.append(myMessage);
      myMessage.scrollIntoView({block:'center'});
      messageContent.value = '';
      // addMessage(currentName, content)
    }
  }


  // socket.onmessage = e => {
  //   const mess = JSON.parse(e.data);
  //     switch(mess.type){
  //       case 'users':
  //         membersList(mess.text);
  //       case 'message':
  //         let otherMessage = document.createElement('div');
  //         otherMessage.className = 'message message_other';
  //         let date = new Date().toTimeString().substr(0, 8);
  //         otherMessage.innerHTML = '<div class="message_other_content">'+'<div class="message-info">' + '<span class="nameInMessage">'+ mess.user+ '</span>'+ '<span class="time">'+ date+ '</span>' +'</div>' +'<div class="message_text_other">'+mess.text+ '</div>' +'</div>' ;
  //         chat.append(otherMessage)
  //     }
  // }
  btnSend.addEventListener('click', e => sendMessage(e))