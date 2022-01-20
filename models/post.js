const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    readTime: String,
    img: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
})

postSchema.virtual("url").get(function(){
    return "/post/" + this._id
})

postSchema.plugin(uniqueValidator)

postSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Post", postSchema)
