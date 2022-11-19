console.log("javascript connected")
const socket = io();

let username;

let textarea = document.querySelector("#typemsg");
let messageArea=document.querySelector(".messagearea");
do {
    username = prompt("enter your name :");
} while (!username);

let profile=document.querySelector("#profilesec");

let testdiv=document.createElement('div');
testdiv.innerHTML=username;
profile.appendChild(testdiv);

textarea.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        sendMessage(e.target.value);
    }
});

function sendMessage(message){
    let msg = {
        user: username,
        message: message.trim()
    };


    //appending the message
    appendMessage(msg,"outgoing");
    textarea.value='';
    scrollToBottom();

    //sending data to server
    socket.emit("outgoing",msg);

};

function appendMessage(msg,type){
    let mainDiv=document.createElement('div');
    mainDiv.classList.add(type);

    let markup=`
    <p> ${msg.user} </p>
    ${msg.message}
    `
    mainDiv.innerHTML=markup;
    messageArea.appendChild(mainDiv);
    
};


//recieving msges

socket.on("outgoing",(msg)=>{
    appendMessage(msg,"incoming");
    scrollToBottom();
})

function scrollToBottom(){
    messageArea.scrollTop=messageArea.scrollHeight;
};