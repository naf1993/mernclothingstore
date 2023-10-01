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
    clientID:'1058309738065-oo5qnjd3808k3i8tqeg8in7cb26qhab3.apps.googleusercontent.com',
    clientSecret:'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',
    callbackURL:'http://localhost:5000/google/callback',
    passReqToCallback:true
},
function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
}

))

export default passportStrategy
