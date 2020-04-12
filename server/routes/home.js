const express = require('express')
const fs = require('fs')
const mime = require('mime');
const os = require('os')
const MediaRender = new require('./mediaRender')
console.log("[+] Using MediaRender")
const MAIN_DIR = os.homedir + '/Desktop/SideProject/Client/templates/'


const router = express.Router()

router.get('/',(req,res)=>{
    fs.readFile(MAIN_DIR + 'index.html',(err, data)=>{
        if(err){
            res.writeHead(404)
            fs.readFile(__dirname +'/404.html', (err2, data2)=>{
                if(err2){
                    console.log(err2)
                    res.write("[404, 500] Fatal Error")
                    res.end()
                }else{
                    console.log(`[+] 200 ---> ${__dirname + "/404.html"}`)
                    res.write(data2)
                    res.end()
                }
            })
        }else{
            console.log(`[+] 200 ---> ${MAIN_DIR + 'index.html'}`)
            res.writeHead(200)
            res.write(data)
            res.end()
        }
    })
})

router.get('/accounts', (req,res)=>{
    fs.readFile(MAIN_DIR + 'account.html',(err, data)=>{
        if(err){
            res.writeHead(404)
            fs.readFile(__dirname +'/404.html', (err2, data2)=>{
                if(err2){
                    console.log(err2)
                    res.write("[404, 500] Fatal Error")
                    res.end()
                }else{
                    console.log(`[+] 200 ---> ${__dirname + "/404.html"}`)
                    res.write(data2)
                    res.end()
                }
            })
        }else{
            console.log(`[+] 200 ---> ${MAIN_DIR + 'account.html'}`)
            res.writeHead(200)
            res.write(data)
            res.end()
        }
    })
})

router.get('/:filename',(req,res)=>{
    // security
    if(req.params.filename == "home.js"){
        // drop it
        res.status(400)
        res.setHeader("Content-Type","text/html")
        res.send("<HTML>  <h2>400 BAD REQUEST</h2>  </HTML>")
        res.end()
        console.log("[!] 400 ---> Illegal request to home.js")
        return
    }
    async function fetch(req, res){
        res.setHeader("Content-Type", mime.getType(req.params.filename))
        var value = await MediaRender.get(req.params.filename)
        .then(
            (value)=>{
                if (value.code == 404){
                    res.writeHead(value.code)
                    try {
                        if(req.params.filename.endsWith('.js') || res.params.filename.endsWith('.css') || res.params.filename.endsWith('.html')){
                            fs.readFile(__dirname +'/404.html', (err2, data2)=>{
                                if(err2){
                                    console.log(err2)
                                    res.write("[404, 500] Fatal Error")
                                }else{
                                    console.log(`[+] 200 ---> ${__dirname + "/404.html"}`)
                                    res.write(data2)
                                    res.end()
                                }
                            })
                        }else{
                            console.log("terminating")
                            res.end()
                        }
                    } catch (error) {
                        fs.readFile(__dirname +'/404.html', (err2, data2)=>{
                            if(err2){
                                console.log(err2)
                                res.write("[404, 500] Fatal Error")
                            }else{
                                console.log(`[+] 200 ---> ${__dirname + "/404.html"}`)
                                res.write(data2)
                                res.end()
                            }
                        })
                    }
                }else{
                    res.writeHead(value.code)
                    res.write(value.data)
                    res.end()
                }
                
            }
        ).catch(
            (err) => {
                console.log(err)
            }
        )
    }
    fetch(req, res)
   
})

module.exports = router