let express = require('express')
let session = require('express-session')
let passport = require('passport')
let mongo = require('mongodb').MongoClient;
let app = express();

app.set('view engine', 'pug')
app.set('views', './pages')

app.use(session({
  secret: 'keyboard-cat',
  resave: true,
  saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())

let uri = "mongodb+srv://dbUser:dbUserpw@cluster0.f1gxa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongo.connect(uri, (err, db)=>{
    if(err){
        console.log(err);
    }else{
        app.listen(3000);

        app.get('/', (req, res)=>{
        console.log(req.session)
        res.render('homepage', {message: "this is page to learn advanced node"})
})
    }
})

