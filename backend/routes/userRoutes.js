import express from 'express'
import { forgotPassword,  login,loginAdmin, protect, register, resetPassword, restrictToAdmin, restrictToUser, updatePassword } from '../controllers/authController.js';
import { createUser, updateUserStatusByAdmin,deleteUser, getAllUsers, getMe, getUserById, resizeUserPhoto, updateMe, updateUser, uploadUserPhoto, getWishlist, applyCoupon } from '../controllers/userController.js';

const router = express.Router();








router.route('/register').post(register)
router.post('/login',login)

router.post('/forgetPassword',forgotPassword)
router.patch('/resetPassword/:token',resetPassword)
router.route('/updateMyPassword').patch(protect,updatePassword)


router.use(protect)
router.route('/me').get(restrictToUser,getMe,getUserById)
router.route('/updateMe').patch(restrictToUser,uploadUserPhoto,resizeUserPhoto,updateMe)
router.route('/:id/applycoupon').post(restrictToUser,applyCoupon)
router.route('/wishlist').get(getWishlist)



router.use(restrictToAdmin)
router.route('/adminonly').post(loginAdmin)
router.route('/').get(getAllUsers).post(createUser)
router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser)
router.route('/updateStatus/:id').patch(updateUserStatusByAdmin)

export default router