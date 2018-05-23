const needle = require("needle");
const Q = require("q");
const SOUND_CLOUD_API_BASE_URL = "http://api.soundcloud.com/";
const TRACKS = "tracks/?q=";
const LIMIT = "&limit=6&";
const CLIENT_KEY = "&client_id=pCNN85KHlpoe5K6ZlysWZBEgLJRcftOd";

class SoundCloudConnector {

    getTrackByBandName(bandName) {
        const q = Q.defer();
        needle("get",`${SOUND_CLOUD_API_BASE_URL}${TRACKS}${bandName}${CLIENT_KEY}`)
            .then(response => q.resolve(response.body))
            .catch(err => q.resolve(err));
       return q.promise;
    }

    getTrackByBandNameWithLimit(bandName, limit = LIMIT) {
        const q = Q.defer();
        needle("get",`${SOUND_CLOUD_API_BASE_URL}${TRACKS}${bandName}${'&limit=' + limit + '&' || LIMIT}${CLIENT_KEY}`)
            .then(response => q.resolve(response.body))
            .catch(err => q.resolve(err));
        return q.promise;
    }
}

const soundCloudConnector = new SoundCloudConnector();

module.exports = {soundCloudConnector};