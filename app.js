require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy
const session = require('express-session')

const app = express();

//Session Config
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:true,
}))

//Passport initialize
app.use(passport.initialize());
app.use(passport.session());

//Passport Config
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    console.log('profile', profile.emails[0].value)
    return done(null, profile);
}));

// Serialize and Deserialize User
passport.serializeUser((user, done) => { 
    done(null,user)
})

passport.deserializeUser((user, done) => {
    done(null,user)
})

app.get('/', (req, res) => {
    res.send('<a href="auth/google">Login With Google</a>')
})

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile')
    }
)

app.get('/profile', (req, res) => {

    if (!req.isAuthenticated) {
        return res.redirect('/')
    }
    res.send(`<h1>${req.user.emails[0].value}</h1>`)
})


app.post('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        res.redirect('/')
    })
})

app.listen('3000', () => {
    console.log('App is running on port 3000')
})
