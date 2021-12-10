let express = require('express')
let session = require('express-session')
let passport = require('passport')
let LocalStrategy = require('passport-local')
// let client = require('mongodb').MongoClient;
let mongoose = require('mongoose');
let ObjectId = require('mongodb').ObjectId;
let User = require('./models/user');
let app = express();

app.set('view engine', 'pug')
app.set('views', './pages')

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

let uri = "mongodb+srv://dbUser:dbUserpw1234@cluster0.qjxut.mongodb.net/node?retryWrites=true&w=majority";

mongoose.connect(uri).then((result)=>{

        app.listen(3000, ()=>{
            console.log('your app is listening to the port 3000')
        });

        app.get('/add-user', (req, res)=>{
            const user = new User({
                username: "chuanqizhu",
                password:"1991"
            });
            user.save().then((result)=>res.send(result));
        })

        passport.serializeUser((user, done)=>{
            console.log(user._id);
            done(null, user._id)
        });
        passport.deserializeUser((userId, done)=>{
            User.findOne(
                {_id: new ObjectId(userId)}, 
                (err, doc)=>{
                done(null, doc);
            })
        });

        let findUserDoc = new LocalStrategy(
        (username, password, done)=>{
            User.findOne({username:username}, (err, user)=>{
                console.log('User '+ username +' attempted to log in. His is password is '+password);
                if (err){
                    return done(err)
                }else if (!user){
                    return done(null, false)
                }else if (user.password!==password){
                    return done(null, false)
                }else{
                    return done(null,user)
                }
            })
        }
        )

        passport.use(findUserDoc);

        app.get('/', (req, res)=>{
        // console.log(req.session)
        res.render('homepage', {message: "this is page to learn advanced node"})});

        app.post('/login', 
        passport.authenticate('local', {failureRedirect: '/'}),
        (req,res)=>{
         console.log(req.user);
        })

        // console.log(passport);
    })
