const express = require('express')
const mongodb = require('mongodb')

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

module.exports = router