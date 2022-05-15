require('dotenv').config()

const express = require ('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const credentials = require('./Middleware/credentials')
const verifyJWT = require('./Middleware/verifyJWT')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error)=> console.error(error));
db.once('open', ()=>console.log('Sucessfully connected to database'))

app.use(credentials.credentials)
app.use(cors(corsOptions))
app.use(express.urlencoded({extended:false}))
app.use(express.json()) //Govori serveru da samo prihaca json format unutar zahtjeva (GET/POST..)
app.use(cookieParser())
app.use('/uploads/accommodation',express.static('uploads/accommodation'))

const authRouter = require("./routes/authRoutes")
const userDataRouter = require("./routes/userRoute")
const accommodationDataRouter = require('./routes/accommodationRoutes')
const accommodationByUserDataRouter = require('./routes/accommodationByUserRoutes')
const accommodationTypeRouter = require('./routes/accommodationTypeRouter')

app.use('/auth',authRouter)
app.use('/users', userDataRouter)
app.use('/accommodation',accommodationDataRouter);
app.use('/accommodation/byuser',accommodationByUserDataRouter);
app.use('/types/accommodation',accommodationTypeRouter);

//app.use(verifyJWT.verifyJWT)


app.listen(3001, () => console.log("Server started"))