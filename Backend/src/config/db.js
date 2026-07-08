import mongoose from "mongoose";

const connectToDb = () => {
     mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connect to database")
    })
}

export default connectToDb