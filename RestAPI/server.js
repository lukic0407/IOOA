require('dotenv').config()

const express = require ('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const credentials = require('./Middleware/credentials')
const verifyJWT = require('./Middleware/verifyJWT')
//const multer = require('multer');
//var upload = multer();

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error)=> console.error(error));
db.once('open', ()=>console.log('Sucessfully connected to database'))

app.use(credentials.credentials)
app.use(cors(corsOptions))
app.use(express.urlencoded({extended:false}))
app.use(express.json()) //Govori serveru da samo prihaca json format unutar zahtjeva (GET/POST..)
app.use(cookieParser())
//app.use(upload.array());
app.use('/uploads/accommodation',express.static('uploads/accommodation'))

const authRouter = require("./routes/authRoutes")
const userDataRouter = require("./routes/userRoute")
const accommodationDataRouter = require('./routes/accommodationRoutes')
const accommodationByUserDataRouter = require('./routes/accommodationByUserRoutes')
const accommodationTypeRouter = require('./routes/accommodationTypeRoutes')
const chatRouter = require('./routes/chatRoutes')
const messageRouter = require('./routes/messageRoutes')

app.use('/auth',authRouter)
app.use('/user', userDataRouter)
app.use('/accommodation',accommodationDataRouter);
app.use('/accommodation/byuser',accommodationByUserDataRouter);
app.use('/types/accommodation',accommodationTypeRouter);
app.use('/chat/', chatRouter);
app.use('/message/', messageRouter);

//app.use(verifyJWT.verifyJWT)


const server = app.listen(3001, () => console.log("Server started"))

const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{corsOptions}
})

io.on("connection",(socket) =>{
    socket.on('setup', (userData)=>{
        socket.join(userData);
        socket.emit('connected');
    })

    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log('User joinded room:' + room);
    })

    socket.on('typing',(room)=>socket.in(room).emit('typing'))
    socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'))

    socket.on('new message',(newMessageRecived)=>{
        var chat = newMessageRecived.chat;
        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user => {
            if (user._id == newMessageRecived.sender._id) return;
            socket.in(user._id).emit('message received', newMessageRecived);
        });
    })
})