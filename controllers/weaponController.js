const Weapon = require("../models/weapon");
const WeaponType = require("../models/weaponType");
const async = require("async");
const {body, validationResult} = require("express-validator");
const he = require("he");
const weapon = require("../models/weapon");


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

exports.weapon_create_get = (req, res, next)=>{
    WeaponType.find().exec((err, results)=>{
        if(err) return next(err);

        res.render("weapon_form", {
            weapon_types: results, 
            weapon: {},
        })
    });
};
exports.weapon_create_post = [
    body("name").trim().isLength({min: 1}).escape().withMessage("Name must be specified."),
    body("rarity").isInt().withMessage("You must pick a rarity."),
    body("base_attack").isInt().withMessage("Base attack must be specified."),
    body("weapon_type").isLength({min: 1}).withMessage("You must pick a weapon type."),
    body("passive").trim().escape().isLength({min: 1}).withMessage("Weapon passive must be specified."),
    body("second_stat").trim().escape().isLength({min: 1}).withMessage("Secondary stat must be specified."),
    body("img").trim().isLength({min: 1}).withMessage("Thumbnail image must be specified."),

    (req, res, next)=>{
        let errors = validationResult(req);

        if(!errors.isEmpty()){
            WeaponType.find().exec((err, results)=>{
                if(err) return next(err);
                
                let weapon = req.body;
                weapon.name = he.decode(weapon.name);
                weapon.ima = he.decode(weapon.img);
                weapon.passive = he.decode(weapon.passive);
                res.render("weapon_form", {
                    weapon_types: results, 
                    weapon: weapon,
                    errors: errors.array(),
                })
            });

            return;
        }

        let weapon = req.body;
        weapon.name = he.decode(weapon.name);
        weapon.ima = he.decode(weapon.img);
        weapon.passive = he.decode(weapon.passive);
        weapon.second_stat = he.decode(weapon.second_stat);

        weapon = new Weapon(weapon);

        weapon.save((err, newWeap)=>{
            if(err) return next(err);

            res.redirect("/weapon/"+newWeap._id);
        });
    },
];

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