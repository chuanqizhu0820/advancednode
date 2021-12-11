let express = require('express')
let session = require('express-session')
let passport = require('passport')
let LocalStrategy = require('passport-local')
let mongoose = require('mongoose');
let ObjectId = require('mongodb').ObjectId;
let User = require('./models/user');
require('dotenv').config()
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

mongoose.connect(process.env.URI)
.then((result)=>{

        passport.serializeUser((user, done)=>{
            done(null, user._id)
        });
        passport.deserializeUser((userId, done)=>{
            User.findOne(
                {_id: new ObjectId(userId)}, 
                (err, doc)=>{
                done(null, doc);
            })
        });

        passport.use(new LocalStrategy(
        (username, password, done)=>{
            User.findOne({username:username}, (err, user)=>{
                console.log('User '+ username +' attempted to log in.');
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
        ))
        // console.log(passport);

        app.get('/', (req, res)=>{
        // console.log(req.session)
        res.render('homepage', {message: "this is page to learn advanced node"})
        });

        // app.get('/add-user', (req, res)=>{
        //     const user = new User({
        //         username: "chuanqizhu",
        //         password:"1991"
        //     });
        //     user.save().then((result)=>res.send(result));
        // })

        app.post('/login', 
        passport.authenticate('local', {failureRedirect: '/'}),
        (req,res)=>{
         res.render('profile', {name: req.user.username});
        })

        app.get('/logout', (req, res)=>{
            req.logout();
            res.redirect('/');
        })


        app.get('/profile', (req, res, next)=>{
            if(req.isAuthenticated()){
                next();
            }else{
                res.render('homepage')
            }
        },(req, res)=>{
            res.render('profile', {name: req.user.username});
        })

        app.listen(3000, ()=>{
            console.log('your app is listening to the port 3000')
        });
    }).catch((err)=>{
        console.log(err);
    })
