
import passportGoogle from 'passport-google-oauth20'
import User from '../../models/userModel'
const GoogleStrategy = passportGoogle.Strategy

export default function passportStrategy(){
    passport.use(new GoogleStrategy({
        clientID:'1058309738065-oo5qnjd3808k3i8tqeg8in7cb26qhab3.apps.googleusercontent.com',
        clientSecret:'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',
        callbackURL:'http://localhost:5000/google/callback',
    },
    async (accessToken,refreshToken,profile,done)=>{
        console.log(profile)
    }))
    passport.serializeUser((user, done) => {
        done(null, user.id)
      })
    
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
      })
}

