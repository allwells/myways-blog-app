const Post = require("../models/post")
const Comment = require("../models/comment")
const commentRouter = require("express").Router()

commentRouter.get("/:id/comment", async (request, response) => {
    const Comments = await Comment.find({})
    response.json(Comments)
})

commentRouter.get("/:id", async (request, response) => {
    const Comments = await Comment.findById(request.params.id)

    if(Comments) {
        response.json(Comments)
    } else {
        response.status(404).end()
    }
})

commentRouter.post("/post/:id/comment", async (req, res) => {
    const comment = new Comment({ text: req.body.text })
    const post = await Post.findById(req.params.id)
    const savedPost = post.comments.push(comment)

    savedPost.save(function(err, results){
        if(err) {console.log(err)}
        res.render("post_details", { title: "Post details", comments:
        results.comments })
    } )
})

commentRouter.delete("/:id", async (request, response) => {
    await Comment.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

commentRouter.put("/:id/comment", async (request, response) => {
    const body = request.body
    const id = request.params.id

    const updatedComment = {
        title: body.title,
        desc: body.desc,
        date: new Date().toISOString(),
        readTime: body.readTime,
        img: request.file.path
    }

    const savedComment = await Comment.findByIdAndUpdate(id, updatedComment, { new: true })
    response.json(savedComment)
})

module.exports = commentRouter