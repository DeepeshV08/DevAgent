import userModel from '../models/userModel.js';
import * as userService from '../service/userService.js';
import { validationResult } from 'express-validator';
import redisClient from '../service/redis.service.js';


export const createUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const user = await userService.createUser(req.body);

        const token = await user.generateJWT();

        res.status(201).json({
            message:  "User registered successfully",
            user,
            token
        });

    } catch (err) {
        res.status(400).send({
            message: err.message
        });
    }
};

export const loginController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try{
        const {email , password} = req.body

        const user = await userModel.findOne({email}).select("+password")

        if(!user){
            res.status(401).json({
                errors: "Invalid credentials."
            })
        }
        const isMatched = await user.isValidPassword(password)

        if(!isMatched){
            return res.status(401).json(
                {errors: "Invalid Credentials"}
            )
        }
        const token = await user.generateJWT()

        res.status(200).json({
            message:"User logged in successfully...",
            user,
            token
        })

    }catch(err){
        return res.status(400).send({
            errors: err.message
        })
    }
}

export const profileController = async (req, res) => {

    res.status(200).json({
        user: req.user
    })
}


export const logoutController = async (req, res) => {
    try{
        
    }catch(err){
        res.status(400).send({err:err.message})
    }
}