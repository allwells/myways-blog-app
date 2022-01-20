require("express-async-errors")
const cors = require("cors")
const csrf = require("csurf")
const helmet = require("helmet")
const morgan = require("morgan")
const express = require("express")
const mongoose = require("mongoose")
const logger = require("./utils/logger")
const config = require("./utils/config")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const middleware = require("./utils/middleware")
const postRouter = require("./controllers/posts")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")

logger.info("Connecting to database...")

mongoose
    .connect(config.MONGODB_URI)
    .then((result) => {
        logger.info("Connected!")
    })
    .catch((error) => {
        logger.error("Error connecting to database:", error.message)
    })


morgan.token("body", (request, response) => {
    return JSON.stringify(request.body)
})

const app = express()
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(csrf({ cookie: true }))
app.use(cors())
app.use("/uploads", express.static("uploads"))
app.use(express.static("build"))
app.use(express.json())
app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms :body")
)

app.use("/api/post", postRouter)
// app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app