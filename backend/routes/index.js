const express = require("express");
const { upload } = require("../utils/MULTER.JS");
const { AddUser, GetUsers, GetUserById, GetUserByEmail, UpdateUser, DeleteUser, register, signin, emailVerificationCode, deleteAccount, signout } = require("../controllers");

const router = express.Router();

router
    // user routes
    .get("/users", GetUsers)
    .get("/user/:id", GetUserById)
    .get("/user", GetUserByEmail)
    .post("/user", upload.single("image"), AddUser)
    .put("/user/:id", upload.single("image"), UpdateUser)
    .delete("/user/:id", DeleteUser)
    // auth routes
    .post("/auth/register", upload.single("image"), register)
    .post("/auth/signin", signin)
    .post("/auth/signout", signout)
    .post("/auth/verify", emailVerificationCode)
    .delete("/auth/:id", deleteAccount)

module.exports = router;