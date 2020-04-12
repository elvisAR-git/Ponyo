const express  = require("express")
const bodyParser = require('body-parser');
const app = express()
var PORT = 4545

const homeRoutes = require('./routes/home.js')
const db = require("./api/routes/db.js")

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.text())
app.use('/api/', db)
app.use('/',homeRoutes)


app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`)
})