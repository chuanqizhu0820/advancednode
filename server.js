let express = require('express');
const session = require('express-session')
let app = express();

app.set('view engine', 'pug')
app.set('views', './pages')

app.use(session({
  secret: 'keyboard-cat',
  resave: true,
  saveUninitialized: true,
}))

app.get('/', (req, res)=>{
    console.log(req.session)
    res.render('homepage', {message: "this is page to learn advanced node"})
})

app.listen(3000);