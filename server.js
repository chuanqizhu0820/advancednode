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
const sessionMiddleWare = session({
  secret: 'keyboard-cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
});

app.use(sessionMiddleWare)

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(process.env.URI)
.then((result)=>{
    auth();
    routes(app, server);

    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

    io.use(wrap(sessionMiddleWare));
    io.use(wrap(passport.initialize()));
    io.use(wrap(passport.session()));

    io.use((socket, next) => {
    if (socket.request.user) {
        next();
    } else {
        next(new Error('unauthorized'))
    }
    });

    let currentUser = 0;

    io.on('connection', (socket)=>{

        console.log(socket.request.user);

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
