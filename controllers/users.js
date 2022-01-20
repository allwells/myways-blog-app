const bcrypt = require("bcrypt")
const User = require("../models/user")
const usersRouter = require("express").Router()

usersRouter.get("/", async (request, response) => {
    const user = await User.find({})
    response.json(user)
})

usersRouter.get("/:id", async (request, response) => {
    const user = await User.findById(request.params.id)
    if(user) {
        response.json(user)
    } else {
        response.status(404).end()
    }
})

usersRouter.post("/", async (request, response) => {
    const body = request.body
    const SALT_ROUNDS = Buffer.allocUnsafe(10)
    const passwordHash = bcrypt.hash(body.password, SALT_ROUNDS)

    const newUser = new User({
        username: body.username,
        email: body.email,
        passwordHash,
    })

    const savedUser = await newUser.save()
    response.json(savedUser)
})

usersRouter.delete("/:id", async (request, response) => {
    await User.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = usersRouter
