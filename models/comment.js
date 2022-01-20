const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
})

commentSchema.plugin(uniqueValidator)

commentSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Comment", commentSchema)
