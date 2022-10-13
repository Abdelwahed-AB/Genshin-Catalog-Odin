const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArtifactSchema = new Schema({
    name: {type: String, required: true, maxLenght: 100},
    description: {type: String, required: true},
    rarity: {type: Number, required: true, min: 1, max: 5},
});

module.exports = mongoose.model("Artifact", ArtifactSchema);