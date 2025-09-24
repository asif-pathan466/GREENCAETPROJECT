import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("database connected")
    )
    await mongoose.connect(`${process.env.MONGODB_URI}/greencart`)
    } catch (error) {
        console.log('database is not connected',error.message)
    }
}

export default connectDB