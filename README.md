# node.new.sound.cloud.api
API
---

Open terminal and run several commands.

* path/to/mongo server bin (C:\Program Files\MongoDB\Server\3.4\bin)
* run - mongodb.exe
* open new tab in terminal 
* navigate on cloned project and run - npm install 
* when installation finished run - npm start

Requests:

* POST http://localhost:3000/tracks
`   body:
    {
        "band_name": "2pac",
        "secret_key": "Secret key 777"
    }
`
returns back 6 tracks 3 most liked 3 least liked
* GET http://localhost:3000/getPredefined

returns back all predefined bands tracks array sorted by likes_count.

winston-logger used only on tracksController.js...

Also started to implement view engine via hbs... under construction 
 
