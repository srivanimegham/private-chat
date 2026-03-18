const socket = io()

const params = new URLSearchParams(window.location.search)
const room = params.get("room")

let names = room.split("-")
document.getElementById("roomTitle").innerText =
names[0] + " - " + names[1] + " Chat"

let name = prompt("Enter your name")
let password = prompt("Enter room password")

socket.emit("joinRoom",{
room:room,
name:name,
password:password
})

socket.on("wrongPassword",()=>{
alert("Wrong Password")
location.reload()
})

let lastDate = ""

socket.on("oldMessages",(data)=>{
data.forEach(showMessage)
})

socket.on("message",(data)=>{
showMessage(data)
})

function showMessage(data){

let messagesDiv = document.getElementById("messages")

// 🔥 DATE LABEL LOGIC
if(data.date !== lastDate){

let dateDiv = document.createElement("div")
dateDiv.classList.add("dateLabel")

let today = new Date().toLocaleDateString("en-IN")
let yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-IN")

if(data.date === today){
dateDiv.innerText = "Today"
}
else if(data.date === yesterday){
dateDiv.innerText = "Yesterday"
}
else{
dateDiv.innerText = data.date
}

messagesDiv.appendChild(dateDiv)
lastDate = data.date
}

// message box
let div = document.createElement("div")
div.classList.add("msg")

if(data.name===name){
div.classList.add("myMsg")
}else{
div.classList.add("friendMsg")
}

let content=""

if(data.image){
content = `
<img src="${data.image}" class="chatImage"
onclick="openFull('${data.image}')">
<br>
<a href="${data.image}" download>Download</a>
`
}else{
content = data.msg
}

div.innerHTML=`
<b>${data.name}</b><br>
${content}
<div class="time">${data.time}</div>
`

messagesDiv.appendChild(div)

messagesDiv.scrollTop = messagesDiv.scrollHeight
}

function sendMessage(){

let text=document.getElementById("message").value
if(text==="") return

socket.emit("chatMessage",{
room:room,
name:name,
msg:text
})

document.getElementById("message").value=""
}

function openImage(){
document.getElementById("imageInput").click()
}

document.getElementById("imageInput").addEventListener("change",function(){

let file=this.files[0]
let reader=new FileReader()

reader.onload=function(){

socket.emit("chatMessage",{
room:room,
name:name,
image:reader.result
})

}

reader.readAsDataURL(file)

})

function openFull(src){
let w=window.open("")
w.document.write(`<img src="${src}" style="width:100%">`)
}
