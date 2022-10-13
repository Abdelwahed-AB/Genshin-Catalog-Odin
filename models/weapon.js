const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WeaponSchema = new Schema({
    base_stat: {type: String, required: true, maxLength: 100},
    second_stat: {type: String, required: true, maxLength: 100},
    passive: {type: String, required: true, maxLength: 500},
    description: {type: String, required: true},
    rarity: {type: Number, min: 1, max: 5},
    weapon_type: {type: mongoose.Types.ObjectId},
});

module.exports = mongoose.model("Weapon", WeaponSchema);