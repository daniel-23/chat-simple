const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");



// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const BOT_NAME = "BOT";
const PERSON_NAME = "Sajad";



///Mis constantes
const chatWith = get('.chatWith');
const typing = get('.typing');
const chatStatus = get('.chatStatus');
const chatId = window.location.pathname.substr(6);
let authUser;
let typingTimer = false;

window.onload = function() {
    axios.get('/auth/user').then(resp => {
        authUser = resp.data;
    }).then( () => {
        axios.get(`/chat/${chatId}/users`).then(resp => {
            let results = resp.data.filter(user => user.id != authUser.id );
            if (results.length > 0) {
                chatWith.innerHTML = results[0].name;
            }
        });

        axios.get(`/chat/${chatId}/messages`).then(resp => {
            resp.data.forEach( msj => {
                let side = 'left';
                if (msj.user_id == authUser.id) {
                    side = 'right';
                }

                appendMessage(
                    msj.user.name,
                    PERSON_IMG,
                    side,
                    msj.content,
                    formatDate(new Date(msj.created_at))
                );





            });
        });
    }).then(() => {
        Echo.join(`chat.${chatId}`)
            .listen('MessageSent', (e) => {
                var date = formatDate(new Date(e.message.created_at));
                
                appendMessage(
                    e.message.user.name,
                    PERSON_IMG,
                    "left",
                    e.message.content,
                    date
                );
                
            })
            .here( users => {
                let results = users.filter(user => user.id != authUser.id );
                if (results.length > 0) {
                    chatStatus.className = 'chatStatus online';
                }
                
            })
            .joining(user =>{
                if (user.id != authUser.id) {
                    chatStatus.className = 'chatStatus online';
                }

            })
            .leaving(user =>{
                if (user.id != authUser.id) {
                    chatStatus.className = 'chatStatus offline';
                }

            })
            .listenForWhisper('typing', e => {
                console.log(e);
                if (e > 0) {
                    typing.style.display = 'block';
                }
                if (typingTimer) {
                    clearTimeout(typingTimer);
                }
                typingTimer = setTimeout(() => {
                    typing.style.display = 'none';
                    typingTimer = false;
                }, 3000);
            });


    });

        
}

msgerForm.addEventListener("submit", event => {
    event.preventDefault();

    const msgText = msgerInput.value;
    if (!msgText) return;
    axios.post('/messages',{
        content: msgText,
        chat_id: chatId,
    }).then(resp => {
        var date = formatDate(new Date(resp.data.created_at));
        appendMessage(
            resp.data.user.name,
            PERSON_IMG,
            "right",
            resp.data.content,
            date
        );
    }).catch( console.log );

    //appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
    msgerInput.value = "";

    //botResponse();
    /*********Codigo del envio**********/

});

function appendMessage(name, img, side, text, date) {
    //   Simple solution for small apps
    const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${date}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    //msgerChat.scrollTop += 500;
    scrollToBottom();
}

        
// Utils
function get(selector, root = document) {
    return root.querySelector(selector);
}

function formatDate(date) {
    const d = date.getDate();
    const mo = date.getMonth() + 1;
    const y = date.getFullYear();

    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();

    return `${d}/${mo}/${y} ${h.slice(-2)}:${m.slice(-2)}`;
}

function scrollToBottom() {
    msgerChat.scrollTop = msgerChat.scrollHeight;
}

function sendTypingEvent() {
    typingTimer = true;
    Echo.join(`chat.${chatId}`)
        .whisper('typing', msgerInput.value.length);
}