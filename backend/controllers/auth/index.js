const { hashValue, compareValues } = require("../../utils/bcrypt");
const { getUserByEmail, deleteUser, addUser } = require("../users/userFunctions");
const { CONFLICT_ERROR, INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR, UNAUTHORIZED_EXCEPTION } = require("../../utils/constants");
const { generateAccessToken, generateRefreshToken } = require("../../utils/tokenGenerators");
const { TokenModel } = require("../../model/token.model");
const { sendMail } = require("../../utils/mailer");
const {generateCode} = require("../../utils/codeGenerator");


// @desc registers a user if user does not exist in the database
// @route /api/auth/register 
// @access private
const register = async (req, res) => {
    const { username, email, password, roles, isVerified } = req.body;
    const file = req.file;
    try {
        // checking if the user already exists
        const userExist = await getUserByEmail(email);
        if (userExist) {
            if (userExist.isVerified === false) {
                await deleteUser(userExist._id);
            } else if (userExist.isVerified === true) {
                return res.status(500).json({ message: CONFLICT_ERROR, error: "user already exists" });
            }
        }
        const body = {
            username,
            email,
            password: await hashValue(password),
            roles,
            isVerified
        };
        const userSaved = await addUser(body, file); // adds new user
        if (!userSaved) {
            return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: "user could not be saved" });
        }

        // sends email with a verification code 
        let VERIFICATION_CODE = generateCode();
        const email = await sendMail(userSaved, VERIFICATION_CODE);

        const userTokenObject = generateAccessToken(userSaved); // generates access token which expires in 15 min.
        const RefreshTokenObject = generateRefreshToken(userSaved); // generates refresh token which expires in 1 day.
        const TokenObject = new TokenModel({
            uuid: userSaved._id,
            refresh_token: RefreshTokenObject.refresh_token
        });
        const savedRefreshToken = await TokenObject.save(); // saves the refresh token to the database for 1 day or until user logsout
        if (!savedRefreshToken) {
            return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: "user refresh token could not be saved" });
        }
        res.cookie("jwt", RefreshTokenObject.refresh_token, { httpOnly: true, secure: false, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json(userTokenObject);
    } catch (error) {
        return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: error });
    }
}

// @desc Logs in a user if the user is verified and exists in the database
// @route /api/auth/signin
// @access private
const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExist = await getUserByEmail(email);
        if (!userExist) {
            return res.status(404).json({ message: NOT_FOUND_ERROR, error: "user does not exist" });
        }
        if (!userExist.isVerified) {
            return res.status(203).json({ message: UNAUTHORIZED_EXCEPTION, error: "user is not verified" });
        }
        const passwordValidation = await compareValues(password, userExist.password);
        if (!passwordValidation) {
            return res.status(203).json({ message: UNAUTHORIZED_EXCEPTION, error: "password not matched" });
        }
        const userTokenObject = generateAccessToken(userExist);
        const RefreshTokenObject = generateRefreshToken(userExist);
        const updatedToken = await TokenModel.findOneAndUpdate(
            {
                uuid: userExist._id
            },
            {
                uuid: userExist._id,
                refresh_token: RefreshTokenObject.refresh_token,
            },
            {
                new: true, // updates the document if the document is found
                upsert: true // if document is not found, create new document
            }
        );
        if (!updatedToken) {
            return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: "refresh token could not be saved" });
        }
        res.cookie("jwt", RefreshTokenObject.refresh_token, { httpOnly: true, secure: false, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json(userTokenObject);
    } catch (error) {
        return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: error })
    }
}

// @desc Logs out a user
// @route /api/auth/signout
// @access private
const signout = (req, res, next) => {
    const cookies = req.cookies;
    try {
        if (!cookies?.jwt) {
            return res.status(204).json({ message: NOT_FOUND_ERROR, error: "no jwt-cookie found" });
        }
        const refreshToken = cookies.jwt;
        if (refreshToken) {
            res.clearCookie("jwt", { httpOnly: true, secure: false, sameSite: 'None' });
            return res.status(204);
        }
        const deletedRefreshToken = TokenModel.findOneAndDelete({ refresh_token: refreshToken })
        if (deletedRefreshToken) {
            return res.status(200).json({ message: "success" });
        } else if (!deletedRefreshToken) {
            return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: "refresh token not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: error });
    }
};

// @desc 
// @param
// @access private
const resetPassword = (req, res, next) => {

};

// @desc 
// @param
// @access private
const forgotPassword = (req, res, next) => {

};


// @desc 
// @param
// @access private
const deleteAccount = (req, res, next) => {

};

// @desc 
// @param
// @access private
const emailVerificationCode = (req, res, next) => {
    const {code} = req.body();
};

module.exports = { register, signin, signout, resetPassword, forgotPassword, deleteAccount };