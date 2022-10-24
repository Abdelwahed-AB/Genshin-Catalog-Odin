const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WeaponSchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    base_attack: {type: Number, required: true},
    second_stat: {type: String, required: true, maxLength: 100},
    passive: {type: String, required: true, maxLength: 500},
    rarity: {type: Number, min: 1, max: 5},
    weapon_type: {type: mongoose.Types.ObjectId},
    img: {type: String, required: true},
});

WeaponSchema.virtual("url").get(function(){
    return '/weapon/'+this._id;
})

module.exports = mongoose.model("Weapon", WeaponSchema);