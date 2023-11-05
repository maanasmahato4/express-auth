const express = require("express");
const { upload } = require("../utils/MULTER.JS");
const { AddUser, GetUsers, GetUserById, GetUserByEmail, UpdateUser, DeleteUser } = require("../controllers");

const router = express.Router();

router
    .get("/users", GetUsers)
    .get("/user/:id", GetUserById)
    .get("/user", GetUserByEmail)
    .post("/user", upload.single("image"), AddUser)
    .put("/user/:id", upload.single("image"), UpdateUser)
    .delete("/user/:id", DeleteUser)

module.exports = router;