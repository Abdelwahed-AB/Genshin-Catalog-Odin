const { text } = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    rarity: {type: Number, min: 1, max: 5},
    region: {type: mongoose.Types.ObjectId},
    element: {type: String, required: true, maxLength: 50},
    weapon_type: {type: mongoose.Types.ObjectId},
    description: {type: String, required: true},
    img_small: {type: String, required: true},
    img_full: {type: String, required:true},
});

CharacterSchema.virtual("url").get(function(){
    return '/character/'+this._id;
});

module.exports = mongoose.model("Character", CharacterSchema);