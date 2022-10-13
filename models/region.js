const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RegionSchema = new Schema({
    name: {type: String, required: true, maxLenght: 100},
});

module.exports = mongoose.model("Region", RegionSchema);