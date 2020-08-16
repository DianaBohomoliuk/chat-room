export function connectSocket () {
  let socket = new WebSocket('ws://localhost:9009');
  let members = document.querySelector('.members');
  let number = document.querySelector('.number');
  let numberOnline = document.querySelector('.number_online');
  let userName = document.querySelector('.input-username');
  let regstrBtn = document.querySelector('.btn-registrate');
  let chatForm = document.querySelector('.chatForm');
  let userForm = document.querySelector('.userForm');
  let missedName = document.querySelector('.name-missed');
  let takenName = document.querySelector('.name-taken');
  let messageContent = document.querySelector('.message-place');
  let btnSend = document.querySelector('.btn-send');
  let chat = document.querySelector('.messages');


  let currentName;
  let membersOnline =[];
  chatForm.style.display = 'none';

    regstrBtn.addEventListener('click', e =>{
      e.preventDefault();
      if(userName.value.trim() == '' || userName.value.trim() == undefined){
        takenName.style.display = 'none';
        missedName.style.display = 'block';
      } else if(membersOnline.includes(userName.value)) {
        missedName.style.display = 'none';
        takenName.style.display = 'block';
        } else{
        currentName = userName.value.trim();
        membersList(currentName);
        userForm.style.display = 'none';
        chatForm.style.display = 'flex';
        messageContent.focus();
        membersOnline.push(currentName);
        number.innerHTML = membersOnline.length;
        // if (window.matchMedia("(min-width: 768px)").matches){
        //   document.write('cewffe')
        //   numberOnline.style.display = 'none';
        // }
        // const mess = JSON.stringify({
        //   type: 'user',
        //   text: userName.value
        //   });
        // socket.send(mess);
        console.log(membersOnline);

      }
    })

   function membersList(name){
      let member = document.createElement('li');
      member.innerHTML = name;
      member.className = 'member'
      members.append(member)
    };


  import 'message'
  }


