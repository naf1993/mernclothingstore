import express from "express";
import passport from "passport";
const router = express.Router();



router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

const clientUrl = 'http://localhost:3000'


// router.get(
//   '/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: '/',
//     session: false,
//   }),
//   (req, res) => {
//     const token = req.user.generateJWT();
//     res.cookie('x-auth-cookie', token);
//     res.redirect(clientUrl);
//   },
// );

router.get('/auth/google/callback', passport.authenticate('google',{
  failureRedirect: '/',
session: false,
}), (req, res) => {
  const token = req.user.generateJWT();
  console.log(token)
  res.cookie('x-auth-cookie', token);
  res.redirect(clientUrl);
 
});


// router.get('/auth/logout/google',(req,res)=>{
//   req.logout(function(err){
//     if(err){
//       console.log(err)
//     }
//     else{
//       res.redirect(clientUrl)
//     }
//   })
// })

router.get('/auth/logout/google',(req,res)=>{
  req.logout();
    res.redirect(clientUrl);
})




router.get('/auth/logout/email',function(req,res){
  res.cookie('token','none',{
    expires:new Date(Date.now() + 1 * 1000),
    httpOnly:true
  })
  res.status(200).json({success:true,message:'User logged out succesfully'})
})

export default router;
