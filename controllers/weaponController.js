const Weapon = require("../models/weapon");
const WeaponType = require("../models/weaponType");
const async = require("async");


exports.weapon_list = (req, res, next)=>{
    let queryObj = {};

    if(Object.keys(req.query).length > 0){
        var rarity = (req.query.rarity !== '')?parseInt(req.query.rarity):0;
        var weaponType = req.query.weapon;
        if(rarity != 0)
            queryObj["rarity"]= rarity;
        if(weaponType!="")
            queryObj["weapon_type"]= weaponType;
    }
    async.parallel({
        weapon_list(cb){
            Weapon.find(queryObj).exec(cb);
        },
        weapon_types(cb){
            WeaponType.find().exec(cb);
        },
    }, (err, results)=>{
        if(err) return next(err);
        res.render("item_list", {
            weapon_list: results.weapon_list,
            weapon_types: results.weapon_types,
            qO: queryObj,
        });
    });
};

exports.weapon_detail = (req, res, next)=>{
    Weapon.findById(req.params.id).populate().exec((err, weapon)=>{
        if(err) return next(err);
        WeaponType.findById(weapon.weapon_type).exec((err, weapon_type)=>{
            if(err) return next(err);
            res.render("weapon_detail", {
                weapon,
                weapon_type,
            });
        });
    });
};

exports.weapon_create_get = ()=>{
    return "Not yet implemented.";
};
exports.weapon_create_post = ()=>{
    return "Not yet implemented.";
};

exports.weapon_delete_get = ()=>{
    return "Not yet implemented.";
};
exports.weapon_delete_post = ()=>{
    return "Not yet implemented.";
};

exports.weapon_update_get = ()=>{
    return "Not yet implemented.";
};

exports.weapon_update_post = ()=>{
    return "Not yet implemented.";
};