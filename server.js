const https = require("https")
const app = require("./app")
const config = require("./utils/config")
const logger = require("./utils/logger")

const server = https.createServer(app)

server.listen(config.PORT, () => {
    logger.info(`Server running on PORT ${config.PORT}`)
})