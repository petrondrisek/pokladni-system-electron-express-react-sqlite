const http = require('http')
const app = require('./backend/app')

const server = http.createServer(app)

server.listen(8000, () => console.log('Server running on port 8000'))