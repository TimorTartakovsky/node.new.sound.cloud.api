const mongoose = require("mongoose");
// save new something
const searchQuery = mongoose.model("searchQuery", {
    time: {},
    result: {
        type: String,
        default: false,
    },
    band: {
        type: String,
        required: true,
    }
});

module.exports = {searchQuery};