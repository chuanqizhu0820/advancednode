const User = require('./models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

module.exports = function (app){

app.get('/', (req, res)=>{
// console.log(req.session)
res.render('homepage')
});

app.post('/login', 
passport.authenticate('local', {failureRedirect: '/'}),
(req,res)=>{
    res.render('profile', {name: req.user.username});
})

app.post('/signup', (req, res, next)=>{
    const hash = bcrypt.hashSync(req.body.password, 12);
    User.findOne({username: req.body.username}, (err, user)=>{
        if (err){
            console.log(err)
        }else if (user){
            res.redirect('/')
        }else if(!user){
            const user = new User({
                username: req.body.username,
                password: hash
            });
            user.save().then((result)=>
            {
                next();
            })
        }})
}, passport.authenticate('local', {failureRedirect: '/'}), (req, res)=>{
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

app.use((req, res)=>{
    if (res.status(404)){
        res.send('Not Found')
    }
})

app.listen(3000, ()=>{
    console.log('your app is listening to the port 3000')
});
}