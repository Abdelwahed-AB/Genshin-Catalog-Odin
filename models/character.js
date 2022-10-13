const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    rarity: {type: Number, min: 1, max: 5},
    region: {type: mongoose.Types.ObjectId},
    weapon_type: {type: mongoose.Types.ObjectId},
});

module.exports = mongoose.model("Character", CharacterSchema);