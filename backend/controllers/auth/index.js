const { hashValue, compareValues } = require("../../utils/bcrypt");
const { getUserByEmail, deleteUser, addUser } = require("../users/userFunctions");
const { CONFLICT_ERROR, INTERNAL_SERVER_ERROR } = require("../../utils/constants");
const { generateAccessToken, generateRefreshToken } = require("../../utils/tokenGenerators");
const { TokenModel } = require("../../model/token.model");
const register = async (req, res, next) => {
    const { username, email, password, roles, isVerified } = req.body;
    const file = req.file;
    try {
        const userExist = await getUserByEmail(email);
        if (userExist) {
            if (userExist.isVerified === false) {
                await deleteUser(userExist._id);
            } else if (userExist.isVerified === true) {
                next({ status: 500, message: CONFLICT_ERROR, error: "user already exists" });
            }
        }
        const body = {
            username,
            email,
            password: await hashValue(password),
            roles,
            isVerified
        };
        const userSaved = await addUser(body, file);
        if (!userSaved) {
            next({ status: 500, message: INTERNAL_SERVER_ERROR, error: "user could not be saved" });
        }
        const userTokenObject = generateAccessToken(userSaved);
        const RefreshTokenObject = generateRefreshToken(userSaved);
        const TokenObject = new TokenModel({
            uuid: userSaved._id,
            refresh_token: RefreshTokenObject.refresh_token
        });
        const savedRefreshToken = await TokenObject.save();
        if(!savedRefreshToken){
            next({status: 500, message: INTERNAL_SERVER_ERROR, error: "user refresh token could not be saved"})
        }
        res.status(200).json(userTokenObject);
    } catch (error) {
        next({ status: 500, message: INTERNAL_SERVER_ERROR, error: error });
    }
}

const signin = (req, res, next) => {

}

const signout = (req, res, next) => {

}

const resetPassword = (req, res, next) => {

}

const forgotPassword = (req, res, next) => {

}

const deleteAccount = (req, res, next) => {

}

module.exports = { register, signin, signout, resetPassword, forgotPassword, deleteAccount };