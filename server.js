const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(__dirname))

let rooms = {}
let users = {}

io.on("connection",(socket)=>{

// JOIN ROOM
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

// save user
users[socket.id] = {room,name}

// send old messages
socket.emit("oldMessages",rooms[room].messages)

// online status
io.to(room).emit("status","online")

})

// MESSAGE
socket.on("chatMessage",(data)=>{

let now = new Date()

let message = {
name:data.name,
msg:data.msg,
image:data.image,
time: now.toLocaleTimeString("en-IN",{
hour:'2-digit',
minute:'2-digit',
hour12:true,
timeZone:"Asia/Kolkata"
}),
date: now.toISOString()
}

// save
rooms[data.room].messages.push(message)

// send
io.to(data.room).emit("message",message)

})

// TYPING
socket.on("typing",(room)=>{
socket.to(room).emit("typing","typing...")
})

// SEEN
socket.on("seen",(room)=>{
socket.to(room).emit("seen")
})

// DISCONNECT
socket.on("disconnect",()=>{

let user = users[socket.id]

if(user){
io.to(user.room).emit("status","offline")
delete users[socket.id]
}

})

})

const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
console.log("Server running on port " + PORT)
})
