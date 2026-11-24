import mongoose from "mongoose"
const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("data base is connected")
        
    } catch (error) {
        console.log("mongoDb connection failed", error)
        throw error
        
    }
}
export default connectdb;