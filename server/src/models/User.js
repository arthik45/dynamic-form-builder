import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8
    },
    role: {
        type: String,
        enum: ["admin"],
        default: "admin"
    }
},
    {
        timestamps:true
    }
)
const User = mongoose.model("User", userSchema);
export default User;