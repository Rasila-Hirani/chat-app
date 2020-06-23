const express = require('express')
const http = require('http')
const path = require('path')
const socketio =require('socket.io')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const { addUser,removeUser,getUser,getUsersInRoom,getAlluser} = require('./utils/users')
const {addRoom,getAllRoom} = require('./utils/rooms')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    console.log('New websocket connection on')       

    socket.on('join',(options, callback)=>{ 
       const {error ,user} = addUser({id:socket.id, ...options})  
       if(error){                
           return callback(error)
       }
        addRoom(user.room) 
        socket.join(user.room) 

        socket.emit('message',generateMessage('Admin',' Welcome !'))
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',` ${user.username} has joined !`))

        io.to(user.room).emit('roomData',{
           room:user.room,
           users:getUsersInRoom(user.room)           
       })
        callback()
    })
    //List of available rooms
    socket.on('roomListQuery',() =>{
        socket.emit('roomList',getAllRoom())
    })
   
  
    
    socket.on('SendMessage',(message, callback)=>{    
        const user = getUser(socket.id)           
        if(user){
            io.to(user.room).emit('message',generateMessage(user.username,message,socket.id))
        }       
        callback()
    })

    socket.on('SendLocation',(coords,callback) =>{
        const user = getUser(socket.id) 
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,socket.id))
        callback()
    })
    socket.on('disconnect',()=>{
        console.log(`discoonnect socket ID :',${socket.id}`)
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage('Admin', `${user.username} has left!`))
            
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
       
    })
})
server.listen(port,()=>{
    console.log(`Server is up on port ${port} !`)
})
