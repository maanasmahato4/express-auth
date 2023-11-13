const { hashValue, compareValues } = require("../../utils/bcrypt");
const { getUserByEmail, deleteUser, addUser } = require("../users/userFunctions");
const { CONFLICT_ERROR, INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR, UNAUTHORIZED_EXCEPTION, NOT_MATCHED_ERROR } = require("../../utils/constants");
const { generateAccessToken, generateRefreshToken } = require("../../utils/tokenGenerators");
const { TokenModel, UserModel, VerificationCodeModel } = require("../../model");
const { sendMail } = require("../../utils/mailer");
const { generateCode } = require("../../utils/codeGenerator");
const { DeleteFromCloudinary } = require("../../utils/cloudinary");


// @desc registers a user if user does not exist in the database
// @route POST /api/auth/register 
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
                await DeleteFromCloudinary(userExist.imageUrl.img_id);
            } else if (userExist.isVerified === true) {
                return res.status(500).json({ message: "user already exists", error: CONFLICT_ERROR });
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
            console.log("error");
            return res.status(500).json({ message: "user could not be saved", error: INTERNAL_SERVER_ERROR });
        }

        // sends email with a verification code 
        let VERIFICATION_CODE = generateCode();

        const saveVerificationCode = await VerificationCodeModel.findOneAndUpdate({ email: userSaved.email }, {
            email: userSaved.email,
            code: VERIFICATION_CODE,
            verificationType: 'register'
        }, { new: true, upsert: true }).exec(); // saving verification code after generation to verify the user after client sends verification code

        if (!saveVerificationCode) {
            return res.status(500).json({ message: "verification code could not be saved", error: INTERNAL_SERVER_ERROR });
        }
        await sendMail(userSaved, VERIFICATION_CODE);
        return res.status(200).json({ message: "mail sent" });
    } catch (error) {
        return res.status(500).json({ message: error, error: INTERNAL_SERVER_ERROR });
    }
}

// @desc Logs in a user if the user is verified and exists in the database
// @route POST /api/auth/signin
// @access private
const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExist = await getUserByEmail(email);
        if (!userExist) {
            return res.status(404).json({ message: "user does not exist", error: NOT_FOUND_ERROR });
        }
        if (!userExist.isVerified) {
            return res.status(203).json({ message: "user is not verified", error: UNAUTHORIZED_EXCEPTION });
        }
        const passwordValidation = await compareValues(password, userExist.password);
        if (!passwordValidation) {
            return res.status(203).json({ message: "password not matched", error: UNAUTHORIZED_EXCEPTION });
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
            return res.status(500).json({ message: "refresh token could not be saved", error: INTERNAL_SERVER_ERROR });
        }
        res.cookie("jwt", RefreshTokenObject.refresh_token, { httpOnly: true, secure: false, sameSite: 'Lax', maxAge: 24 * 60 * 60 * 1000 });
        return res.status(200).json(userTokenObject);
    } catch (error) {
        return res.status(500).json({ message: error, error: INTERNAL_SERVER_ERROR });
    }
}

// @desc Logs out a user
// @route POST /api/auth/signout
// @access private
const signout = async (req, res) => {
    const cookies = req.cookies;
    try {
        if (!cookies?.jwt) {
            return res.status(500).json({ message: "no jwt-cookie found", error: NOT_FOUND_ERROR });
        }
        const refreshToken = cookies.jwt;
        if (refreshToken) {
            res.clearCookie("jwt", { httpOnly: true, secure: false, sameSite: 'None' });
        }
        const deletedRefreshToken = await TokenModel.findOneAndDelete({ refresh_token: refreshToken })
        if (!deletedRefreshToken) {
            return res.status(500).json({ message: "refresh token not found", error: INTERNAL_SERVER_ERROR });
        }
        return res.status(200).json({ message: "success" });
    } catch (error) {
        return res.status(500).json({ message: error, error: INTERNAL_SERVER_ERROR });
    }
};

// @desc changes the current password to a new password sent from the client by the user
// @routes PUT /api/auth/change-password
// @access private
const changePassword = async (req, res) => {
    try {
        const { email, password, newPassword } = req.body;
        const user = await getUserByEmail(email); // gets the user document which matches with the email
        if (!user) {
            return res.status(404).json({ message: "user does not exist", error: NOT_FOUND_ERROR });
        }
        const passwordVerified = await compareValues(password, user.password); //compares the password from the document with the password sent from the client
        if (!passwordVerified) {
            return res.status(203).json({ message: "password not matched", error: UNAUTHORIZED_EXCEPTION });
        }
        const passwordChanged = await UserModel.findByIdAndUpdate(user._id, {
            password: await hashValue(newPassword)
        }, { new: true }); //updates the password
        if (!passwordChanged) {
            return res.status(500).json({ message: "error changing password", error: INTERNAL_SERVER_ERROR });
        }
        // Call signout function to log out the user
        const signoutResponse = await signout(req, res);
        if (signoutResponse.statusCode !== 200) {
            return res.status(500).json({ message: "error signing out user after password change", error: INTERNAL_SERVER_ERROR });
        }
        return res.status(200).json({ message: "password changed" });
    } catch (error) {
        return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: error });
    }
};

// @desc renew the current password sent from the client by the user
// @routes PUT /api/auth/renw-password
// @access private
const renewPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await getUserByEmail(email); // gets the user document which matches with the email
        if (!user) {
            return res.status(404).json({ message: "user does not exist", error: NOT_FOUND_ERROR });
        }
        const passwordChanged = await UserModel.findByIdAndUpdate(user._id, {
            password: await hashValue(newPassword)
        }, { new: true }); //updates the password
        if (!passwordChanged) {
            return res.status(500).json({ message: "error changing password", error: INTERNAL_SERVER_ERROR });
        }
        return res.status(200).json({ message: "password renewed" });
    }

    catch (error) {
        return res.status(500).json({ message: error, error: INTERNAL_SERVER_ERROR });
    }
};

// @desc sends the verification code if the user forgets password
// @route PUT /api/auth/forgot-password
// @access private
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await getUserByEmail(email); // gets the user document which matches with the email
        if (!user) {
            return res.status(404).json({ message: "user does not exist", error: NOT_FOUND_ERROR });
        };
        // sends email with a verification code 
        let VERIFICATION_CODE = generateCode();

        const saveVerificationCode = await VerificationCodeModel.findOneAndUpdate({ email: user.email }, {
            email: user.email,
            code: VERIFICATION_CODE,
            verificationType: 'forgot'
        }, { new: true, upsert: true }).exec(); // saving verification code after generation to verify the user after client sends verification code
        if (!saveVerificationCode) {
            return res.status(500).json({ message: "verification code could not be saved", error: INTERNAL_SERVER_ERROR });
        }
        await sendMail(user, VERIFICATION_CODE);
        return res.status(200).json({ message: "mail sent" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error, error: INTERNAL_SERVER_ERROR });
    }
};


// @desc deletes an account which matches with the id
// @route DELETE /api/auth/:id
// @access private
const deleteAccount = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedAccount = await deleteUser(id);
        if (!deletedAccount) {
            return res.status(500).json({ message: "not able to delete account", error: INTERNAL_SERVER_ERROR });
        }
    } catch (error) {
        return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: error });
    }

};

// @desc verifies the verification code sent from the client
// @route POST /api/auth/verify
// @access private
const emailVerificationCode = async (req, res) => {
    try {
        const { email, code, verificationType } = req.body;
        const userVerification = await VerificationCodeModel.findOne({ email: email });
        if (!userVerification) {
            return res.status(404).json({ error: NOT_FOUND_ERROR, message: "verification code not found" });
        }
        if (!(userVerification.code == code && userVerification.verificationType === verificationType)) {
            return res.status(203).json({ error: NOT_MATCHED_ERROR, message: "the verification code from the client does not match" });
        }

        if (verificationType === "register") {
            const userIsVerified = await UserModel.findOneAndUpdate({ email: email }, { isVerified: true }, { new: true });
            if (!userIsVerified) {
                return res.status(500).json({ error: INTERNAL_SERVER_ERROR, message: "user could not get verified" });
            }
            const userTokenObject = generateAccessToken(userIsVerified); // generates access token which expires in 15 min.
            const RefreshTokenObject = generateRefreshToken(userIsVerified); // generates refresh token which expires in 1 day.

            const TokenObject = new TokenModel({
                uuid: userIsVerified._id,
                refresh_token: RefreshTokenObject.refresh_token
            });
            const savedRefreshToken = await TokenObject.save(); // saves the refresh token to the database for 1 day or until user logsout
            if (!savedRefreshToken) {
                return res.status(500).json({ error: INTERNAL_SERVER_ERROR, message: "user refresh token could not be saved" });
            }
            res.cookie("jwt", RefreshTokenObject.refresh_token, { httpOnly: true, secure: false, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
            return res.status(200).json({ message: "use has been verified", access_token: userTokenObject.access_token });
        } else if (verificationType === "forgot") {
            const user = await UserModel.findOne({ email: email });
            if (!user) {
                return res.status(404).json({ message: "user not found", error: NOT_FOUND_ERROR });
            }
            return res.status(200).json({ message: "user verified" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: error });
    }
};

module.exports = { register, signin, signout, changePassword, renewPassword, forgotPassword, deleteAccount, emailVerificationCode };