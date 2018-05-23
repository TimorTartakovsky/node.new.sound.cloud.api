const {mongoose} = require("./db/mongoose");
const {track} = require("./models/tracks");
const Q = require("q");
const {ProjectConstants} = require("../projectHelper/consts")
const {searchQuery} = require("./models/searchQuery");
const dateFormat = require('dateformat');
const {soundCloudConnector} = require("./soundCloudConnector/integration");

class TracksRepository {

    constructor() {
        this._runtimeStorage = {};
    }

    getPredefinedBands() {
        let promisesArray = [];
        ProjectConstants.predefinedBands.forEach(band => {
            const newPromise = new Promise((resolve, reject) => {
                if (this._runtimeStorage[band] && Array.isArray(this._runtimeStorage[band])) {
                    resolve(this._runtimeStorage[band]);
                }
                return soundCloudConnector.getTrackByBandNameWithLimit(band)
                    .then(response => {
                        let arrayToReturn = [];
                        response.forEach((track) => {
                            arrayToReturn = arrayToReturn.concat({
                                title: track.title,
                                description: track.description,
                                likes_count: track.likes_count,
                                tag_list: track.tag_list,
                            })
                        })
                        resolve(arrayToReturn);
                    })
                    .catch(err => {
                        reject(`Error: ${err.message}`);
                    });
            });
            promisesArray = promisesArray.concat(newPromise);
        });
        return Q.all(promisesArray).then(result => {
            console.log(this.getSortedByLikes(result));
            return this.getSortedByLikes(result);
        }).catch(err => {
            throw `Error: ${err.message}`;
        });
    }

    getTracksByBandName(bandName) {
        if (this._runtimeStorage[bandName] && Array.isArray(this._runtimeStorage[bandName])) {
            return this._runtimeStorage[bandName]
        }
        return soundCloudConnector.getTrackByBandName(bandName)
            .then(response => {
              let array = [];
              if (response) {
                 const now = new Date();
                 new searchQuery({
                   time: dateFormat(now, "HH:mm dd/mm/yyyy"),
                   result: JSON.stringify(response),
                   band: bandName
                 }).save().catch(err => {
                     throw `Error: ${err.message}`;
                 });
                 response.forEach(trackRes => {
                     const trackToSave = {
                         title: trackRes.title,
                         description: trackRes.description,
                         likes_count: trackRes.likes_count,
                         tag_list: trackRes.tag_list,
                     }
                     array = array.concat(trackToSave);
                     new track(trackToSave).save().catch(error => {
                         console.log(error);
                         return error;
                     });
                 })
              }
              this._runtimeStorage[bandName] = this.getTreeMostLikedAndLeastLikedTracks(array);
              return array;
            }).catch(error => {
                throw `Error: ${error.message}`;
            });
    }

    getSortedByLikes(arr) {
        const compareByLikes = (track1, track2) => track1.likes_count - track2.likes_count;
        return arr.sort(compareByLikes);
    }

    getTreeMostLikedAndLeastLikedTracks(arr) {
        let arrayToReturn = [];
        const compareByLikes = (track1, track2) => track1.likes_count - track2.likes_count;
        arr.sort(compareByLikes).reverse();
        if (arr.length > 6) {
            arrayToReturn[0] = arr[0];
            arrayToReturn[1] = arr[1];
            arrayToReturn[2] = arr[2];
            arrayToReturn[3] = arr[arr.length - 3];
            arrayToReturn[4] = arr[arr.length - 2];
            arrayToReturn[5] = arr[arr.length - 1];
            return arrayToReturn;
        }
        return arr;
    }

}
const tracksRepository = new TracksRepository();
module.exports = {tracksRepository};