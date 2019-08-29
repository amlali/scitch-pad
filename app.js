const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
 const path =require('path')
 let Rooms = [];
let app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'html');

// parse application/json
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public')); //Serves resources from public folder

const server = require('http').createServer(app);

const io = require('socket.io')(server);

app.get('/',function(req,res,next){
    res.sendfile('public/index.html')
  
})
io.on('connection', socket => {
    console.log('new socket connected');
    socket.emit('message','hi')
    socket.on('create room',(roomName)=>{
      if(Rooms.indexOf(roomName)>-1){
            socket.emit('message','room exists')
      }
      else{
        Rooms.push(roomName)
        socket.join(roomName);
      }
      
      

    }); 
    socket.on('message',e=>{
        console.log(e);
        
    })
    socket.on('join room',(roomName)=>{
        if(Rooms.indexOf(roomName)>-1){
            socket.join(roomName);
        }

        else{
            socket.emit('message','room not exists')
        }
    }); 
    socket.on('moving',(e)=>{
        console.log('moving',e);
        
        io.sockets.emit('drowing', e);
        
    }); 
    socket.on('no-drowing',()=>{
        console.log('no drowing');
        
        io.sockets.emit('no-drowing');
    })
    socket.on('canDrow',()=>{
        console.log('candrow');
        
        socket.broadcast.emit('canDrow');
    })
  });
server.listen(3001,()=>{
    console.log(`server running on port 3000`);
    

})