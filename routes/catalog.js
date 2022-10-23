var express = require('express');
var router = express.Router();

const characterController = require("../controllers/characterController");
const weaponController = require("../controllers/weaponController");
const artifactController = require("../controllers/artifactController");


//By default load characters
router.get(["/", "/characters"], characterController.character_list);

router.get("/character/create", characterController.character_create_get);

router.post("/character/create", characterController.character_create_post);

router.get("/character/:id/delete", characterController.character_delete_get);

router.post("/character/:id/delete", characterController.character_delete_post);

router.get("/character/:id/update", characterController.character_update_get);

router.post("/character/:id/update", characterController.character_update_post);

router.get("/character/:id", characterController.character_detail);


//Artifact routes
router.get("/artifacts", artifactController.artifact_list);

router.get("/artifact/create", artifactController.artifact_create_get);

router.post("/artifact/create", artifactController.artifact_create_post);

router.get("/artifact/:id/delete", artifactController.artifact_delete_get);

router.post("/artifact/:id/delete", artifactController.artifact_delete_post);

router.get("/artifact/:id/update", artifactController.artifact_update_get);

router.post("/artifact/:id/update", artifactController.artifact_update_post);

router.get("/artifact/:id", artifactController.artifact_detail);

//weapon routes
router.get("/weapons", weaponController.weapon_list);

router.get("/weapon/create", weaponController.weapon_create_get);

router.post("/weapon/create", weaponController.weapon_create_post);

router.get("/weapon/:id/delete", weaponController.weapon_delete_get);

router.post("/weapon/:id/delete", weaponController.weapon_delete_post);

router.get("/weapon/:id/update", weaponController.weapon_update_get);

router.post("/weapon/:id/update", weaponController.weapon_update_post);

router.get("/weapon/:id", weaponController.weapon_detail);

module.exports = router;