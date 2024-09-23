import passport from 'passport'
import passportGoogle from 'passport-google-oauth20'

const GoogleStrategy = passportGoogle.Strategy
passport.serializeUser(function(user,done){
    done(null,user)
})
passport.deserializeUser(function(user,done){
    done(null,user)
})

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback:true
},
function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
}

))

export default passportStrategy
