const Artifact = require("../models/artifact");
const {body, validationResult} = require("express-validator");
const he = require("he");

exports.artifact_list = (req, res, next)=>{
    let queryObj = {};

    if(Object.keys(req.query).length > 0){
        var rarity = (req.query.rarity !== '')?parseInt(req.query.rarity):0;
        if(rarity != 0)
            queryObj["rarity"]= rarity;
    }

    Artifact.find(queryObj).exec((err, artifact_list)=>{
        if(err) return next(err);

        res.render("item_list", {
            artifact_list: artifact_list,
            qO: queryObj,
        });
    });
};

exports.artifact_detail = (req, res, next)=>{
    Artifact.findById(req.params.id).exec((err, artifact)=>{
        if(err) return next(err);

        res.render("artifact_detail", {
            artifact
        });
    });
};

exports.artifact_create_get = (req, res, next)=>{
    res.render("artifact_form", {artifact: {}});
};

exports.artifact_create_post = [
    body("name").trim().isLength({min: 1}).escape().withMessage("Name must be specified"),
    body("rarity").isInt().withMessage("You must pick a rarity."),
    body("description").trim().escape().isLength({min: 1}).withMessage("Description must be specified"),
    body("img").trim().isLength({min: 1}).withMessage("Thumbnail image must be specified"),
    body("password").custom(val=>val === process.env.SECRET).withMessage("Wrong password."),
    (req, res, next)=>{
        let errors = validationResult(req);
        let artifact = req.body;
        artifact.name = he.decode(artifact.name);
        artifact.description = he.decode(artifact.description);
        artifact.img = he.decode(artifact.img);

        if(!errors.isEmpty()){
            res.render("artifact_form", {
               artifact: artifact,
               errors: errors.array(), 
            });
            return;
        }

        artifact = new Artifact(artifact);

        artifact.save((err, newArtifact)=>{
            if(err) return next(err);

            res.redirect(newArtifact.url);
        });
    },
];
exports.artifact_update_get = (req, res, next)=>{
    Artifact.findById(req.params.id).exec((err, artifact)=>{
        if(err) return next(err);
        let art = artifact.toObject();
        art.rarity = ''+art.rarity;
        res.render("artifact_form", {artifact:art});
    });
};
exports.artifact_update_post = [
    body("name").trim().isLength({min: 1}).escape().withMessage("Name must be specified"),
    body("rarity").isInt().withMessage("You must pick a rarity."),
    body("description").trim().escape().isLength({min: 1}).withMessage("Description must be specified"),
    body("img").trim().isLength({min: 1}).withMessage("Thumbnail image must be specified"),
    body("password").custom(val=>val === process.env.SECRET).withMessage("Wrong password."),
    (req, res, next)=>{
        let errors = validationResult(req);
        let artifact = req.body;
        artifact.name = he.decode(artifact.name);
        artifact.description = he.decode(artifact.description);
        artifact.img = he.decode(artifact.img);
        artifact._id = req.params.id;

        if(!errors.isEmpty()){
            res.render("artifact_form", {
               artifact: artifact,
               errors: errors.array(), 
            });
            return;
        }

        artifact = new Artifact(artifact);

        Artifact.findByIdAndUpdate(req.params.id, artifact, (err, newArt)=>{
            if(err) return next(err);

            res.redirect(newArt.url);
        });
    },
];
exports.artifact_delete_get = (req, res, next)=>{
    Artifact.findById(req.params.id).exec((err, artifact)=>{
        if(err) return next(err);

        res.render("delete_item", {artifact});
    });
};

exports.artifact_delete_post = [
    body("password").custom(val=>val === process.env.SECRET).withMessage("Wrong password."),
    (req, res, next)=>{
        let errors = validationResult(req);

        if(!errors.isEmpty()){
            Artifact.findById(req.params.id).exec((err, art)=>{
                if(err) return next(err);
        
                res.render("delete_item", {
                    artifact: art,
                    errors: errors.array(),
                });
            });
            return;
        }

        Artifact.findByIdAndDelete(req.params.id, (err)=>{
            if(err) return next(err);
            res.redirect("/artifacts");
        });
    }
];