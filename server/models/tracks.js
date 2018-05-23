const mongoose = require("mongoose");
// save new something
const track = mongoose.model("track", {
    title: {
        type: String,
        default: false,
    },
    description: {
        type: String,
        default: false,
    },
    likes_count: {
        type: Number,
        required: true,
    },
    tag_list: {
        type: String,
        default: false,
    },
});

module.exports = {track};