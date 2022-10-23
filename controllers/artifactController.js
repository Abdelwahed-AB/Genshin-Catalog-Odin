const Artifact = require("../models/artifact");

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

exports.artifact_create_get = ()=>{
    return "Not yet implemented.";
};

exports.artifact_create_post = ()=>{
    return "Not yet implemented.";
};
exports.artifact_update_get = ()=>{
    return "Not yet implemented.";
};
exports.artifact_update_post = ()=>{
    return "Not yet implemented.";
};
exports.artifact_delete_get = ()=>{
    return "Not yet implemented.";
};

exports.artifact_delete_post = ()=>{
    return "Not yet implemented.";
};