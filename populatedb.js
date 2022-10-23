
var userArgs = process.argv.slice(2);

require("dotenv").config();

var async = require("async");
var Character = require("./models/character");
var Artifact = require("./models/artifact");
var Weapon = require("./models/weapon");
var WeaponType = require("./models/weaponType");
var Region = require("./models/region");

var mongoose = require("mongoose");
const weapon = require("./models/weapon");
var mongoDB = process.env.MONGO_URL;

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var characters = [];
var weapons = [];
var regions = [];
var weaponTypes = [];
var artifacts = [];

var createWeaponType = (name, cb)=>{
    let weapType = new WeaponType({name});

    weapType.save((err)=>{
        if(err){
            cb(err, null);
            return;
        }

        console.log("New weapon type: "+ weapType);
        weaponTypes.push(weapType);
        cb(null, weapType);
    });
};

var createRegion = (name, cb)=>{
    let region = new Region({name});

    region.save((err)=>{
        if(err){
            cb(err, null);
            return
        }

        console.log("New region: "+ region);
        cb(null, region);
    });
};

var createArtifact = (name, description, rarity, img, cb)=>{
    let artifact = new Artifact({name, description, rarity, img});

    artifact.save((err)=>{
        if(err){
            cb(err, null);
            return
        }
        console.log('New artifact: '+ artifact);
        cb(null, artifact);
    });
};

var createWeapon = (name, base_attack, second_stat, passive, description, rarity, weapon_type, img, cb)=>{
    let weap = new Weapon({name, base_attack, second_stat, passive, description, rarity, weapon_type, img});

    weap.save((err)=>{
        if(err){
            cb(err, null);
            return
        }
        console.log("New weapon: "+ weap);
        cb(null, weap);
    })
};

var createCharacter = (name, rarity, element, region, weapon_type, img_small, img_full, cb)=>{
    let character = new Character({name, rarity, element, region, weapon_type, img_small, img_full});

    character.save((err)=>{
        if(err){
            cb(err, null);
            return
        }

        console.log("New character: "+ character);
        cb(null, character);
    });
};


function createRegions(cb){
    async.series([
        function(callback){createRegion("Mondstadt", callback)},
        function(callback){createRegion("Liyue", callback)},
        function(callback){createRegion("Inazuma", callback)},
        function(callback){createRegion("Sumeru", callback)},
    ], cb);
}

function createWeaponTypes(cb){
    async.series([
        function(callback){createWeaponType("Sword", callback)},
        function(callback){createWeaponType("Polearm", callback)},
        function(callback){createWeaponType("Bow", callback)},
        function(callback){createWeaponType("Catalyst", callback)},
    ], cb);
}

function createArtifacts(cb){
    async.parallel([
        function(callback){
            createArtifact("Adventurer's flower",
             `The ambitious adventurer came across this resilient flower in the depths of a gloomy ruin.
            Moved by the sight of life sprouting in defiance of a lifeless land, he almost forgot about the treasures buried deep in the ruin.
            After pausing to ponder it for a while, the adventurer plucked the flower, wore it as a brooch, and ventured forth into the darkness.`,
            1,
            "https://paimon.moe/images/artifacts/adventurer_flower.png",
            callback);
        },
        function(callback){
            createArtifact("Adventurer's Tail Feather",
                `An adventurer once traveled through a forest in search of rare beasts never seen before.
                As he tore his way recklessly through the foliage, the adventurer tripped on a tree root.
                When he regained consciousness, he saw a girl so beautiful that he was willing to give up the adventurer's life to be with her.
                Her appearance was surreal, with a cluster of feathers adorning her hair.`,
                1,
                "https://paimon.moe/images/artifacts/adventurer_plume.png",
                callback);
        },
        function(callback){
            createArtifact("Adventurer's Pocket Watch",
                `A pocket watch that once belonged to an adventurer. It was crafted by a master watchmaker with simplicity and practicality in mind, aligning with the philosophy of the Adventurers' Guild.
                The adventurer spent most of his days in darkness. The rhythmic sound of its moving hands was the only proof he had of the passage of time.
                Long after he had grown accustomed to a normal life, having given up the adventurer lifestyle he once loved so dearly,
                this forgotten pocket watch still sat quietly in the cabinet, waiting for its next adventure.`,
                1,
                "https://paimon.moe/images/artifacts/adventurer_sands.png",
                callback);
        },
        function(callback){
            createArtifact("Adventurer's Golden Goblet",
                `An old golden goblet that the adventurer used to drink water. It is said that he found it in an old ruin.
                The exterior is engraved with ancient symbols and inlaid with a faded gemstone.
                Eventually, the adventurer bid farewell to the nomadic lifestyle.
                This old golden goblet was traded in for new, shiny Mora.`,
                1,
                "https://paimon.moe/images/artifacts/adventurer_goblet.png",
                callback);
        },
        function(callback){
            createArtifact("Adventurer's Bandana",
                `There is nothing special about this green bandana, save that the fabric is rather robust and highly absorbent.
                Just like the bandana, its wearer was an unexceptional, ordinary person.
                But countless secrets lie hidden in the stars high up above and the abyss deep down below.
                All of these things are awaiting discovery by mere mortals.`,
                1,
                "https://paimon.moe/images/artifacts/adventurer_circlet.png",
                callback);
        }
    ], cb);
}

function createCharacters(cb){
    async.parallel([
        function(callback){
            createCharacter(
                "Albedo",
                5,
                "geo",
                regions[0],
                weaponTypes[0],
                "https://paimon.moe/images/characters/albedo.png",
                "https://paimon.moe/images/characters/full/albedo.png",
                callback
            );
        },
        function(callback){
            createCharacter(
                "Amber",
                4,
                "pyro",
                regions[0],
                weaponTypes[2],
                "https://paimon.moe/images/characters/amber.png",
                "https://paimon.moe/images/characters/full/amber.png",
                callback
            );
        },
        function(callback){
            createCharacter(
                "Cyno",
                5,
                "electro",
                regions[3],
                weaponTypes[1],
                "https://paimon.moe/images/characters/cyno.png",
                "https://paimon.moe/images/characters/full/cyno.png",
                callback
            );
        },
    ], cb);
}

function createWeapons(cb){
    async.parallel([
        function(callback){
            createWeapon(
                "The Catch",
                42,
                "Energy recharge",
                "Increases Elemental Burst DMG by 16%/20%/24%/28%/32% and Elemental Burst CRIT Rate by 6%/7.5%/9%/10.5%/12%.",
                `The favored barbed spear of a famous Inazuman bandit.
                It was originally a harpoon used to catch fish, but it was also very handy in battle.
                They say that he even pierced the enchanted, sword-armed puppet before carrying it off.
                
                "Haha! Once, I was the master of this ship, the 'Seiraimaru.'"
                "I commanded over ten ships, and they called me the Deathless Oni of Seirai."
                "Now, I am but a leaf floating upon the waves."
                "If not for Janome and the people marooned on those islands,"
                "Forget raising our sails again — I doubt I would have managed to make it back to my home shores."
                "And yet Seirai now looks like this."
                "There is no longer any place for me in the Inazuman Islands."
                "Even that naggy, fretful old shrine maiden is gone..."
                
                The bandit named Ako Domeki's voice was thick with emotion. Then he said...
                "Hey, Janome! I'm now the freest man in the whole wide world!"
                "Aunt Shrine Maiden! Didn't you say that you wanted to go see the world?"
                "You know, go someplace else, like that Kamuna guy or that Konbumaru you always talk about?"
                "You know what? Let me, Ako Domeki Zaemon, go in your stead!"
                "Let me go see what the edge of the world really looks like!"
                
                "We'll meet again where all ship routes end!"
                "And when we do, it'll be my turn to tell you all about these distant lands!"`,
                4,
                weaponTypes[1],
                "https://paimon.moe/images/weapons/the_catch.png",
                callback
            );
        },
    ], cb);
}

async.series([
    createRegions,
    createWeaponTypes,
    createArtifacts,
    createCharacters,
    createWeapons,
], (err, results)=>{
    if(err){
        console.log('Final Err: '+err);
    }

    mongoose.connection.close();
})