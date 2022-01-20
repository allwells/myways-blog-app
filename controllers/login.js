const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const loginRouter = require("express").Router()

loginRouter.post("/", async (request, response) => {
    const body = request.body

    const user = await User.findOne({ email: body.email })
    const passwordCorrect = (user !== null)
        ? await bcrypt.compare(body.password, user.passwordHash)
        : false

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: "Invalid email or password!"
        })
    }

    const userForToken = {
        email: user.email,
        id: user._id,
    }

    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60*5 }
    )

    response
        .status(200)
        .send({ token, username: user.username, email: user.email })
})

module.exports = loginRouter
