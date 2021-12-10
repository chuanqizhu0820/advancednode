let express = require('express')
let session = require('express-session')
let passport = require('passport')
let client = require('mongodb').MongoClient;
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
}))
app.use(passport.initialize())
app.use(passport.session())

let uri = "mongodb+srv://dbUser:dbUserpw@cluster0.f1gxa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

client.connect(uri, (err, db)=>{
    if(err){
        console.log(err);
    }else{
        app.listen(3000, ()=>{
            console.log('your app is listening to the port 3000')
        });

        app.get('/', (req, res)=>{
        // console.log(req.session)
        res.render('homepage', {message: "this is page to learn advanced node"})});

        app.post('/login', (req,res)=>{
         console.log(req.body)
        })
    }
})
