const { text } = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    rarity: {type: Number, min: 1, max: 5},
    element: {type: String, required: true, maxLength: 50},
    region: {type: mongoose.Types.ObjectId},
    weapon_type: {type: mongoose.Types.ObjectId},
    img_small: {type: String, required: true},
    img_full: {type: String, required:true},
});

module.exports = mongoose.model("Character", CharacterSchema);