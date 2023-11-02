const express = require("express");
const { upload } = require("../utils/MULTER.JS");
const { AddUser } = require("../controllers");

const router = express.Router();

router
    .post("/user", upload.single("image"), AddUser)

module.exports = router;