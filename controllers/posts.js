const Post = require("../models/post")
const postRouter = require("express").Router()
const multer = require("multer")
const uploadsDest = "uploads/"

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadsDest)
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + "-" + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter })
const type = upload.single("img")

postRouter.get("/", async (request, response) => {
    const posts = await Post.find({})
    response.json(posts)
})

postRouter.get("/:id", async (request, response) => {
    const posts = await Post.findById(request.params.id)

    if(posts) {
        response.json(posts)
    } else {
        response.status(404).end()
    }
})

postRouter.post("/", type, async (request, response) => {
    console.log(request.file)
    const body = request.body

    const newPost = new Post({
        title: body.title,
        desc: body.desc,
        date: new Date().toISOString(),
        readTime: body.readTime,
        img: request.file.path
    })

    if (body.title === undefined || body.title === "") {
        return response.status(400).json({
            error: "post title is empty!",
        })
    }

    if (body.desc === undefined || body.desc === "") {
        return response.status(400).json({
            error: "post description is empty!",
        })
    }

    const savedPost = await newPost.save()
    response.json(savedPost)
})

postRouter.delete("/:id", async (request, response) => {
    await Post.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

postRouter.put("/:id", type, async (request, response) => {
    const body = request.body
    const id = request.params.id

    const updatedPost = {
        title: body.title,
        desc: body.desc,
        date: new Date().toISOString(),
        readTime: body.readTime,
        img: request.file.path
    }

    const savedpost = await Post.findByIdAndUpdate(id, updatedPost, { new: true })
    response.json(savedpost)
})

module.exports = postRouter