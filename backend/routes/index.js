const express = require("express");
const { upload } = require("../utils/MULTER.JS");
const { AddUser,
    GetUsers,
    GetUserById,
    GetUserByEmail,
    UpdateUser, DeleteUser,
    register,
    signin,
    emailVerificationCode,
    deleteAccount,
    signout,
    forgotPassword,
    changePassword,
    renewPassword,
    refreshAccessToken
} = require("../controllers");
const { verifyJWT } = require("../middlewares/verifyJwt");

const router = express.Router();

router
    // user routes
    .get("/users", verifyJWT, GetUsers)
    .get("/user/:id", GetUserById)
    .get("/user", GetUserByEmail)
    .post("/user", upload.single("image"), AddUser)
    .put("/user/:id", upload.single("image"), UpdateUser)
    .delete("/user/:id", DeleteUser)
    // auth routes
    .post("/auth/register", upload.single("image"), register)
    .get("/auth/refresh", refreshAccessToken)
    .post("/auth/signin", signin)
    .post("/auth/verify", emailVerificationCode)
    .post("/auth/forgot-password", forgotPassword)
    .put("/auth/change-password", verifyJWT, changePassword)
    .put("/auth/renew-password", renewPassword)
    .post("/auth/signout", signout)
    .delete("/auth/:id", verifyJWT, deleteAccount)

module.exports = router;