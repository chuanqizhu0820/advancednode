let express = require('express');
let app = express();

app.set('view engine', 'pug')
app.set('views', './pages')

app.get('/', (req, res)=>{
    res.render('homepage', {message: "this is page to learn advanced node"})
})

app.listen(3000);