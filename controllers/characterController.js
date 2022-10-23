const Character = require("../models/character");
const WeaponType = require("../models/weaponType");
const async = require("async");

exports.character_list = (req, res, next)=>{
    let queryObj = {};
    if(Object.keys(req.query).length > 0){
        var rarity = (req.query.rarity !== '')?parseInt(req.query.rarity):0;
        var element = req.query.element;
        var weaponType = req.query.weapon;
        if(rarity != 0)
            queryObj["rarity"]= rarity;
        if(element != "")
            queryObj["element"]= element;
        if(weaponType!="")
            queryObj["weapon_type"]= weaponType;
    }
    async.parallel({
        character_list(cb){
            Character.find(queryObj).exec(cb);
        },
        weapon_types(cb){
            WeaponType.find().exec(cb);
        },
    }, (err, results)=>{
        if(err) return next(err);
        res.render("item_list", {
            character_list: results.character_list,
            weapon_types: results.weapon_types,
            qO: queryObj,
        });
    });
};

exports.character_detail = ()=>{
    return "NOT YET IMPLEMENTED.";
};

exports.character_create_get = ()=>{
    return "NOT YET IMPLEMENTED.";
};

exports.character_create_post = ()=>{
    return "NOT YET IMPLEMENTED.";
};

exports.character_delete_get = ()=>{
    return "NOT YET IMPLEMENTED.";
};

exports.character_delete_post = ()=>{
    return "NOT YET IMPLEMENTED.";
};

exports.character_update_get = ()=>{
    return "NOT YET IMPLEMENTED.";
};

exports.character_update_post = ()=>{
    return "NOT YET IMPLEMENTED.";
};