let express = require('express');
let app = express();
app.listen(3000);

app.set('view engine', 'pug')
app.set('views', './pages')

app.get('/', (req, res)=>{
    res.render('homepage')
})