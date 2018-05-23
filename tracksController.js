const express = require("express");
const hbs = require("hbs");
const app = express();
const bodyParser = require("body-parser");
const {tracksRepository} = require("./server/tracksRepository");
const config = require("./config.json");
const logging = require("logger-winston");
logging.init(config);
const logger = logging.getLogger("API Controller");
const SECRET_KEY = "Secret key 777";

hbs.registerPartials(`${__dirname}/views/partials`);
app.set("view engine", "hbs");

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send("Hello Express...");
});

app.get("/getPredefined", (req, res) => {
    const response = tracksRepository.getPredefinedBands();
    logger.info(response);
    response.then(response => {
        res.status(200).send(response);
    }).catch(err => res.status(400).send({error: err}));
});

app.post("/tracks", (req, res) => {
    const bandName = req.body["band_name"];
    const secretKey = req.body["secret_key"];
   if (!isBandNameFromRequestValid(bandName)) {
       return res.send(400, {"error": "band_name was not found..."})
   }
    if (!isSecretKeyFromRequestValid(secretKey)) {
        return res.send(400, {"error": "secret_key was not found..."})
    }
    const response = tracksRepository.getTracksByBandName(bandName);
    logger.info(response);
    response.then(response => {
            res.status(200).send(response);
        }).catch(err => res.status(400).send({error: err}));
});

app.get('/tracks', (req, res) => {
    res.render("tracks.hbs", {
        tracks: "my tracks",
    });
});

app.use(express.static(__dirname + "public"))

app.listen(3000, () => {
    logger.info("node.sound.cloud.api is working");
});

const isSecretKeyFromRequestValid = (secretKey) => {
    if(!secretKey || secretKey !== SECRET_KEY) {
        return false;
    }
    return true;
}

const isBandNameFromRequestValid = (bandName) => {
    if(!bandName || bandName.length <= 1) {
        return false;
    }
    return true;
}


