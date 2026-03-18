const socket = io()

const params = new URLSearchParams(window.location.search)
const room = params.get("room")

let names = room.split("-")
document.getElementById("roomTitle").innerText =
names[0] + " - " + names[1] + " Chat"

let name = prompt("Enter your name")
let password = prompt("Enter room password")

socket.emit("joinRoom",{room,name,password})

socket.on("wrongPassword",()=>{
alert("Wrong Password")
location.reload()
})

let lastDate = ""

// OLD
socket.on("oldMessages",(data)=>{
data.forEach(showMessage)
})

// NEW
socket.on("message",(data)=>{
showMessage(data)
})

// STATUS
socket.on("status",(msg)=>{
document.getElementById("status").innerText = msg
})

// TYPING
socket.on("typing",(msg)=>{
document.getElementById("typing").innerText = msg
setTimeout(()=>{
document.getElementById("typing").innerText=""
},2000)
})

// ✅ SEEN (BLUE TICKS)
socket.on("seen",()=>{
let ticks = document.querySelectorAll(".tick")

ticks.forEach(t=>{
t.innerText = "✓✓"
t.classList.add("seen")
})
})

function showMessage(data){

let messagesDiv = document.getElementById("messages")

// DATE
let msgDate = new Date(data.date)
let today = new Date()
let yesterday = new Date()

yesterday.setDate(today.getDate() - 1)

msgDate.setHours(0,0,0,0)
today.setHours(0,0,0,0)
yesterday.setHours(0,0,0,0)

let displayDate=""

if(msgDate.getTime() === today.getTime()){
displayDate="Today"
}
else if(msgDate.getTime() === yesterday.getTime()){
displayDate="Yesterday"
}
else{
displayDate=msgDate.toLocaleDateString()
}

if(displayDate !== lastDate){
let dateDiv = document.createElement("div")
dateDiv.classList.add("dateLabel")
dateDiv.innerText = displayDate
messagesDiv.appendChild(dateDiv)
lastDate = displayDate
}

// MSG BOX
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
<img src="${data.image}" class="chatImage" onclick="openFull('${data.image}')">
<br>
<a href="${data.image}" download>Download</a>
`
}else{
content = data.msg
}

div.innerHTML=`
<b>${data.name}</b><br>
${content}
<div class="time">${data.time} <span class="tick">✓</span></div>
`

messagesDiv.appendChild(div)

messagesDiv.scrollTop = messagesDiv.scrollHeight
}

// SEND
function sendMessage(){
let text=document.getElementById("message").value
if(text==="") return

socket.emit("chatMessage",{room,name,msg:text})

// trigger seen
setTimeout(()=>{
socket.emit("seen",room)
},1000)

document.getElementById("message").value=""
}

// TYPING SEND
document.getElementById("message").addEventListener("input",()=>{
socket.emit("typing",room)
})

// IMAGE
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
