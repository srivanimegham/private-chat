const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const path = require("path")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(__dirname))

let rooms = {}

io.on("connection",(socket)=>{

socket.on("joinRoom",(data)=>{

let {room,name,password} = data

// room create
if(!rooms[room]){

rooms[room] = {
password: password,
messages:[]
}

}

// password check
if(rooms[room].password !== password){

socket.emit("wrongPassword")
return

}

socket.join(room)

// old messages send
socket.emit("oldMessages",rooms[room].messages)

})

socket.on("chatMessage",(data)=>{

let message = {
name:data.name,
msg:data.msg,
image:data.image,
time:new Date().toLocaleTimeString([],{
hour:'2-digit',
minute:'2-digit'
})
}

// save message
rooms[data.room].messages.push(message)

// send to room
io.to(data.room).emit("message",message)

})

})

const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
console.log("Server running on port " + PORT)
})
