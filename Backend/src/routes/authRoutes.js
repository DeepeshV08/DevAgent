import express from 'express'
import { createUserController, loginController, logoutController, profileController} from '../controllers/authController.js'
import { body } from 'express-validator'
import { authUser } from '../middlewares/authMiddleware.js'


const authRouter = express.Router()


authRouter.post('/register', body('email').isEmail().withMessage("Email must be valid email address"),
body('password').isLength({min: 3}).withMessage("Password must be atleast 3 characters long") , 
createUserController)

authRouter.post('/login', body('email').isEmail().withMessage("Email must be valid email address"),
body('password').isLength({min: 3}).withMessage("Password must be atleast 3 characters long") , loginController)

authRouter.get('/profile', authUser ,profileController)

authRouter.get('/logout', authUser, logoutController)

// authRouter.get('/getAllUser', authUser, getAllUserController)
export default authRouter