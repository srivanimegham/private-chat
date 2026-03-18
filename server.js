const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(__dirname))

let rooms = {}

io.on("connection",(socket)=>{

socket.on("joinRoom",(data)=>{

let {room,name,password} = data

if(!rooms[room]){
rooms[room] = {
password: password,
messages:[]
}
}

if(rooms[room].password !== password){
socket.emit("wrongPassword")
return
}

socket.join(room)

socket.emit("oldMessages",rooms[room].messages)

})

socket.on("chatMessage",(data)=>{

let now = new Date()

let message = {
name:data.name,
msg:data.msg,
image:data.image,
time: now.toLocaleTimeString("en-IN", {
timeZone: "Asia/Kolkata",
hour: "2-digit",
minute: "2-digit"
}),
date: now.toLocaleDateString("en-IN", {
timeZone: "Asia/Kolkata",
year: "numeric",
month: "short",
day: "numeric"
})
}

rooms[data.room].messages.push(message)

io.to(data.room).emit("message",message)

})

})

const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
console.log("Server running on port " + PORT)
})
