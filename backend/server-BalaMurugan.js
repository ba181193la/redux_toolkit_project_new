import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import socketio  from 'socket.io';
import db from './db/index.js'
import userAuth from './routes/auth.js'
import web3Route from './routes/web3Route.js'
import { addUser, removeUser, getUser, getRoomUsers } from './helper/entity.js'
const WebSocket = require('ws');
const http = require('http');
const app=express()
const server = http.createServer(app); // Create an HTTP server
const io = socketio(server,{cors: { origin: '*' }})

app.use(cors());
db()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}))

// parse application/json
app.use(bodyParser.json())
app.use('/user',userAuth);
app.use('/web3',web3Route)

// io.on('connect',(socket) => {
  
// console.log("User connected",socket.id);

//   socket.on('join',({user,room},callback) => {
//     console.log(user,room)
//       const {response , error} = addUser({id: socket.id , user:user, room: room})

//       console.log(response)

//       if(error) {
//         callback(error)
//         return;
//       }
//       socket.join(response.room);
//       socket.emit('message', { user: 'admin' , text: `Welcome ${response.user} ` });
//       socket.broadcast.to(response.room).emit('message', { user: 'admin', text : `${response.user} has joined` })

//       io.to(response.room).emit('roomMembers', getRoomUsers(response.room))
//   })

//   socket.on('sendMessage',(message,callback) => {
    
//       const user = getUser(socket.id)

//       io.to(user.room).emit('message',{ user: user.user, text : message })

//       callback()
//   })


 

//   socket.on('disconnect',() => {
//     console.log("User disconnected");
//     const user = removeUser(socket.id);

//     if(user) {
//       io.to(user.room).emit('message',{ user: 'admin', text : `${user.user} has left` })
//     }
//   })
// })




// app.use('/',(req,res,next)=>{
//     console.log("middleware is running")
//     })
// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws) => {
//     console.log('Client connected');
  
//     ws.on('message', (message) => {
//       const text = message.toString(); 
//       console.log('Received:', text);
//       // Broadcast message to all clients
//       wss.clients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(text);
//         }
//       });
//     });
  
//     ws.on('close', () => {
//       console.log('Client disconnected');
//     });
//   });
  

server.listen('5000',()=>{
    console.log("server is running 5000");
    
})




