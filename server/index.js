const express  = require("express")

const app = express()
var PORT = 4545

const homeRoutes = require('./routes/home.js')
app.use('/',homeRoutes)


app.listen(4545,()=>{
    console.log(`Server running at port ${PORT}`)
})