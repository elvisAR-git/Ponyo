const fs = require('fs')
const os = require('os')
const util = require('util')

const readFile = util.promisify(fs.readFile)


// add as many as you like
MEDIA_DIRS = [
    os.homedir + '/Desktop/SideProject/Client/Images/',
    os.homedir + '/Desktop/SideProject/Client/Multimedia/',
    os.homedir + '/Desktop/SideProject/Client/templates/',
    os.homedir + '/Desktop/SideProject/Client/ARengine/'
]


class MediaRender{
    static async get(filename){
        var response= {
            code: 404,
            data: undefined
        }
        var n = MEDIA_DIRS.length
        var counter = 0

        while(counter <= n){
            let data = await readFile(MEDIA_DIRS[counter]+ filename)
            .then(dt=>{
                response.code = 200
                response.data = dt
                console.log(`[+] 200 ---> ${MEDIA_DIRS[counter]+ filename}`)
            }).catch((err)=>{
            // do nothing
            })
            counter = counter + 1
        }
        if (response.data === undefined){
            console.log(`[!] 404 ----> ${filename}`)
        }
        return response
    }
}

module.exports = MediaRender