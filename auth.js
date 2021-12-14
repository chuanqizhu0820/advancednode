const passport = require('passport');
let LocalStrategy = require('passport-local');
let GitHubStrategy = require('passport-github2').Strategy;
let bcrypt = require('bcrypt');
const User = require('./models/user');
let ObjectId = require('mongodb').ObjectId;

module.exports = function(){

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
        }else if (!bcrypt.compareSync(password, user.password)){
            return done(null, false)
        }else{
            return done(null,user)
        }
    })
}
))

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ username: profile.username }, function (err, user) {
        if (err){
            return done(err);
        }else if(!user){
            const user = new User({
                username: profile.username,
                password: accessToken
            })
            user.save().then(user=>{
                return done(null, user);
            })
        }else{
            return done(null, user);
        }
    });
  }
));

}