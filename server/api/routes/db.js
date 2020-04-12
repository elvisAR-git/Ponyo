const express = require('express')
const mongodb = require('mongodb')
const validate = require('../models/validators.js').validate
console.log(validate)

const router = express.Router()

// Get posts


router.get('/', async (req,res)=>{
    data = await loadPostCollection()
    data = await data.find({}).toArray()
    res.send(data) 
    console.log("[+] 200 ---> Database post get")
})

// add posts
router.post('/', async(req, res)=>{
    try {
        value = JSON.parse(req.body)
        const posts = await loadPostCollection()
        post = await posts.insertOne(
            {
                text: value.text,
                time: new Date()
            }
        );
        res.status(200)
        res.send(post)
        console.log("[+] 201 ---> Database",req.body,"added")
    } catch (error) {
        const posts = await loadPostCollection()
        await posts.insertOne(
            {
                text: req.body.text,
                time: new Date()
            }
        );
        res.status(201)
        res.redirect("/")
        console.log("[+] 201 ---> Database",req.body,"added")
    }
    
})

// delete posts
router.delete('/:id',async(req,res)=>{
    const posts = await loadPostCollection()
    await posts.deleteOne({
        _id: new mongodb.ObjectID(req.params.id)
    })
    res.status(200).send()
    console.log("[+] 200 ---> Database delete",req.params.id)
})

router.post('/deleteall/', async(req, res)=>{
    const posts = await loadPostCollection()
    var credentials = req.body
    console.log(credentials)
    if(credentials.username =="alanray" && credentials.password =="moraaelvis"){
        await posts.remove()
        var response = {
            'status':200
        }
        res.status(200)
        res.send(response)
        res.end()
    }else{
        res.status(400)
        res.send("Invalid credentials")
        res.end()
    }
})

// get specific posts

router.get('/:id', async(req, res)=>{
    const posts = await loadPostCollection()
    // function that tryies to fetch the post Asyncronously
    async function getPost(){
        try {
            // fallback incase of success
            post = await posts.findOne({
                _id : new mongodb.ObjectID(req.params.id)
            })
            return post
        } catch (error) {
            // fallback incase the request is not found
            return 404
        }
    }

    data = await getPost()
    if (data == 404){
        res.status(404).send()
    }else{
        res.status(200)
        res.send(data)
    }
    console.log("[+] 200 ---> Database get", req.params.id)    
})


// account management

router.post('/accounts/create/',async(req, res)=>{
    const users = await loadUserCollection()
    var typeCheck = true
    var validation = true
    
    var newUser = req.body

    var checkmap = validate(newUser)
    var err = checkmap.error
    if(err){
        typeCheck = false
    }

    // Check if this user already exisits
    if (typeCheck){
        list_users = await users.find({}).toArray()
        list_users.forEach(user => {
            if(user.username == newUser.username){
                validation = false
            }
        });
    }

    if(validation && typeCheck){
        await users.insertOne(
            newUser
        )
        console.log(validation, typeCheck)
        console.log("[+] 200 ---> Database Create user",newUser.username)
        res.status(201).send(newUser)
    }
    if(!typeCheck){
        var errorHTML = `
            <html>
            <nav>
                <h1 class="logotext mono">~Ponyo~<pre>"CODE"</pre></h1>
            </nav>
            <br>
            <br>
            <link rel="stylesheet" href="/main.css">
            <h1 class="white-text mono2">ERROR:${err.message}<h1>
            <hr>
            <br>
            <p class="white-text mono">Please <a href="/accounts" class="mono">Try Again</a> and avoid this error . Thank you</p>
            <hr>
            <br>
            <small style="font-family: ubuntu; font-size: 60%; color:blue;">${new Date()}</small>
            </html>
        `
        res.status(400).send(errorHTML)
        res.end()
    }else if(!validation){
        var error = `
            <html>
            <nav>
                <h1 class="logotext mono">~Ponyo~<pre>"CODE"</pre></h1>
            </nav>
            <br>
            <br>
            <link rel="stylesheet" href="/main.css">
            <h1 class="white-text mono2">ERROR: Sorry, the username <span style="color: red;">${newUser.username}</span> has already been taken<h1>
            <hr>
            <br>
            <p class="white-text mono">Please <a href="/accounts" class="mono">Try Again</a> using a different username. Thank you</p>
            <hr>
            <br>
            <small style="font-family: ubuntu; font-size: 60%; color:blue;">${new Date()}</small>
            </html>
        `
        res.status(400).send(error)
    }
    
})



router.post('/accounts/login',async (req, res)=>{
    var newUser = req.body
    const users = await loadUserCollection().find({}).toArray()

    users.forEach(user => {
        if(user.email == newUser.email){
            if(user.password === newUser.password){
                // match
                
            }else{
                // incorrect password
            }
        }else{
            // no such user
        }
    });
})



// ---LOADERS---
async function loadPostCollection(){
    const client = await mongodb.MongoClient.connect(
        "mongodb://localhost/",
        {
            useNewUrlParser:true,
            useUnifiedTopology: true
        }
    )

    return client.db('test').collection('posts')
}


async function loadUserCollection(){
    const client = await mongodb.MongoClient.connect(
        "mongodb://localhost/",
        {
            useNewUrlParser:true,
            useUnifiedTopology: true
        }
    )

    return client.db('test').collection('users')
}

module.exports = router