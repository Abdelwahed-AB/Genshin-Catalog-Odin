const Character = require("../models/character");
const WeaponType = require("../models/weaponType");
const Region = require("../models/region");
const async = require("async");
const {body, validationResult} = require("express-validator")
const he = require("he");

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

exports.character_detail = (req, res, next)=>{

    Character.findById(req.params.id).exec((err, character)=>{
        if(err) return next(err);
        async.parallel({
            weapon_type(cb){
                WeaponType.findById(character.weapon_type).exec(cb);
            },
            region(cb){
                Region.findById(character.region).exec(cb);
            }
        }, (err, results)=>{
            if(err) return next(err);

            res.render("character_detail", {
                character: character,
                weapon_type: results.weapon_type,
                region: results.region,
            });
        });
    });
};

exports.character_create_get = (req, res, next)=>{
    async.parallel({
        region_list(cb){
            Region.find().exec(cb);
        },
        weapon_types(cb){
            WeaponType.find().exec(cb)
        }
    }, (err, results)=>{
        if(err) return next(err);

        res.render("character_form", {
            region_list: results.region_list,
            weapon_types: results.weapon_types, 
            character: {},
        })
    });
};

exports.character_create_post = [
    body("name").trim().isLength({min: 1}).escape().withMessage("Name must be specified"),
    body("rarity").isInt().withMessage("You must pick a rarity."),
    body("region").isLength({min: 1}).withMessage("You must pick a region."),
    body("element").isLength({min: 1}).withMessage("You must pick an element."),
    body("weapon_type").isLength({min: 1}).withMessage("You must pick a weapon type."),
    body("description").trim().escape().isLength({min: 1}).withMessage("Description must be specified"),
    body("img_small").trim().isLength({min: 1}).withMessage("Thumbnail image must be specified"),
    body("img_full").trim().isLength({min: 1}).withMessage("Full image must be specified"),
    body("password").custom(val=>val === process.env.SECRET).withMessage("Wrong password."),

    (req, res, next)=>{
        let errors = validationResult(req);

        let character = req.body;
        character.img_small = he.decode(character.img_small);
        character.img_full = he.decode(character.img_full);
        character.description = he.decode(character.description);

        if(!errors.isEmpty()){
            console.log(req.body.password === process.env.SECRET);
            async.parallel({
                region_list(cb){
                    Region.find().exec(cb);
                },
                weapon_types(cb){
                    WeaponType.find().exec(cb);
                }
            }, (err, results)=>{
                if(err) return next(err);

                res.render("character_form", {
                    region_list: results.region_list,
                    weapon_types: results.weapon_types, 
                    character: character,
                    errors: errors.array(),
                });
            });
            return;
        }

        character = new Character(character);

        character.save((err, newCharacter)=>{
            if(err) return next(err);

            res.redirect(newCharacter.url);
        });
    }
];

exports.character_update_get = (req, res, next)=>{
    async.parallel({
        region_list(cb){
            Region.find().exec(cb);
        },
        weapon_types(cb){
            WeaponType.find().exec(cb)
        },
        character(cb){
            Character.findById(req.params.id).exec(cb);
        },
    }, (err, results)=>{
        if(err) return next(err);
        let character = results.character.toObject();

        character.region = character.region.toString();
        character.weapon_type = character.weapon_type.toString();
        character.rarity = ''+character.rarity;
        
        res.render("character_form", {
            region_list: results.region_list,
            weapon_types: results.weapon_types, 
            character: character,
        })
    });
};

exports.character_update_post = [
    body("name").trim().isLength({min: 1}).escape().withMessage("Name must be specified"),
    body("rarity").isInt().withMessage("You must pick a rarity."),
    body("region").isLength({min: 1}).withMessage("You must pick a region."),
    body("element").isLength({min: 1}).withMessage("You must pick an element."),
    body("weapon_type").isLength({min: 1}).withMessage("You must pick a weapon type."),
    body("description").trim().escape().isLength({min: 1}).withMessage("Description must be specified"),
    body("img_small").trim().isLength({min: 1}).withMessage("Thumbnail image must be specified"),
    body("img_full").trim().isLength({min: 1}).withMessage("Full image must be specified"),
    body("password").custom(val=>val === process.env.SECRET).withMessage("Wrong password."),

    (req, res, next)=>{
        let errors = validationResult(req);

        let character = req.body;
        character.img_small = he.decode(character.img_small);
        character.img_full = he.decode(character.img_full);
        character.description = he.decode(character.description);
        character._id = req.params.id;

        if(!errors.isEmpty()){
            async.parallel({
                region_list(cb){
                    Region.find().exec(cb);
                },
                weapon_types(cb){
                    WeaponType.find().exec(cb)
                }
            }, (err, results)=>{
                if(err) return next(err);

                res.render("character_form", {
                    region_list: results.region_list,
                    weapon_types: results.weapon_types, 
                    character: character,
                    errors: errors.array(),
                });
            });
            return;
        }

        character = new Character(character);

        Character.findByIdAndUpdate(req.params.id, character, (err, newChar)=>{
            if(err) return next(err);

            res.redirect(newChar.url);
        })
    }
];

exports.character_delete_get = (req, res, next)=>{
    Character.findById(req.params.id).exec((err, character)=>{
        if(err) return next(err);

        res.render("delete_item", {character});
    });
};

exports.character_delete_post = [
    body("password").custom(val=>val === process.env.SECRET).withMessage("Wrong password."),
    (req, res, next)=>{
        let errors = validationResult(req);

        if(!errors.isEmpty()){
            Character.findById(req.params.id).exec((err, char)=>{
                if(err) return next(err);
        
                res.render("delete_item", {
                    character: char,
                    errors: errors.array(),
                });
            });
            return;
        }

        Character.findByIdAndDelete(req.params.id, (err)=>{
            if(err) return next(err);
            res.redirect("/characters");
        });
    }
];