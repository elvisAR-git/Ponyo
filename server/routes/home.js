const express = require('express')
const mongodb = require('mongodb')
const fs = require('fs')
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
router.get('/:filename',(req,res)=>{
    async function fetch(req, res){
        var value = await MediaRender.get(req.params.filename)
        .then(
            (value)=>{
                if (value.code == 404){
                    res.writeHead(value.code)
                    if(req.params.filename.endsWith('.html')){
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