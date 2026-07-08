import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: [true, "email must be unique"],
        required: true,
        trim: true,
        lowercase: true,
        minLength: [6, "Email must be at least 6 characters long"],
        maxLength: [50, "Email must not be longer than 50 Characters"]
    },
    password:{
        type:String,
        select: false
    }
})

userSchema.statics.hashPassword = async function (password){
    return await bcrypt.hash(password, 10)
}
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateJWT = function(){
    return jwt.sign({email: this.email} ,process.env.JWT_SECRET, {expiresIn: '3d'})
}

const userModel = mongoose.model("user", userSchema)

export default userModel