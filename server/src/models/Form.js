import mongoose from "mongoose";
const fieldSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        trim: true
    },
    label: {
        type: String,
        required: true,
        trim:true
    },
    type: {
        type: String,
        required: true,
        enum: [
            "TEXT",
            "EMAIL",
            "NUMBER",
            "PHONE",
            "TEXTAREA",
            "DATE",
            "SELECT",
            "RADIO",
            "CHECKBOX"
        ]
    },
    placeholder: {
        type: String,
        default:""
    },
     defaultValue: {
        type: mongoose.Schema.Types.Mixed,
        default: ""
    },
    required: {
        type: Boolean,
        default:false
    },
    options: {
        type: [String],
        default: []
    },

    minLength: Number,
    maxLength: Number,
    min: Number,
    max: Number

}, { _id: true })

const formSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        default: ""
    },
    fields: {
        type: [fieldSchema],
        default: []
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft"
        
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
},{
        timestamps:true
    }

)
const Form = mongoose.model("Form", formSchema);

export default Form;