let express = require('express')
let app = express();
let server = require('http').createServer(app)
let io = require('socket.io')(server);
let session = require('express-session')
let passport = require('passport')
let mongoose = require('mongoose');
require('dotenv').config();

const routes = require('./routes');
const auth = require('./auth');

app.set('view engine', 'pug')
app.set('views', './pages')

app.use(express.static('public'));
app.use(express.urlencoded({
  extended: true
}))
app.use(session({
  secret: 'keyboard-cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(process.env.URI)
.then((result)=>{
    auth();
    routes(app, server);
    let currentUser = 0;
    io.on('connection', (socket)=>{
        console.log('A user is connected!');
        ++currentUser;
        io.emit('user count', currentUser);

        socket.on('disconnect', ()=>{
            currentUser--;
            io.emit('user count', currentUser);
        })
    })

    }).catch((err)=>{
        console.log(err);
    })
