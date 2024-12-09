import express from 'express'
import { forgotPassword,  login,loginAdmin, protect, register, resetPassword, restrictToAdmin, restrictToUser, updatePassword } from '../controllers/authController.js';
import { createUser, updateUserStatusByAdmin,deleteUser,addToFavourites, getAllUsers, getMe, getUserById, resizeUserPhoto, updateMe, updateUser, uploadUserPhoto, getFavourites, applyCoupon, removeFromFavourites, addInteractions } from '../controllers/userController.js';
import { sessionMiddleware } from '../middleware/sessionMiddleware.js';


const router = express.Router();


router.route('/register').post(register)
router.post('/login',login)
router.route('/addinteraction').post(sessionMiddleware,addInteractions)

router.post('/forgetPassword',forgotPassword)
router.patch('/resetPassword/:token',resetPassword)
router.route('/updateMyPassword').patch(protect,updatePassword)
router.route('/addtofavourites').post(protect,addToFavourites)
router.route('/getFavourites').get(protect,getFavourites )
router.route('/removefromfavourites/:productId').delete(protect,removeFromFavourites)


router.use(protect)
router.route('/me').get(protect,getMe)
router.route('/updateMe').patch(restrictToUser,uploadUserPhoto,resizeUserPhoto,updateMe)
router.route('/:id/applycoupon').post(restrictToUser,applyCoupon)




router.use(restrictToAdmin)
router.route('/adminonly').post(loginAdmin)
router.route('/').get(getAllUsers).post(createUser)
router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser)
router.route('/updateStatus/:id').patch(updateUserStatusByAdmin)

export default router