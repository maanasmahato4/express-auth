const { hashValue, compareValues } = require("../../utils/bcrypt");
const { getUserByEmail, deleteUser, addUser } = require("../users/userFunctions");
const { CONFLICT_ERROR, INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR, UNAUTHORIZED_EXCEPTION, NOT_MATCHED_ERROR } = require("../../utils/constants");
const { generateAccessToken, generateRefreshToken } = require("../../utils/tokenGenerators");
const { TokenModel, UserModel, VerificationCodeModel } = require("../../model");
const { sendMail } = require("../../utils/mailer");
const { generateCode } = require("../../utils/codeGenerator");


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

        const saveVerificationCode = await VerificationCodeModel.findOneAndUpdate({ email: userSaved.email }, {
            email: userSaved.email,
            code: VERIFICATION_CODE,
            verificationType: 'register'
        }, { new: true, upsert: true }).exec(); // saving verification code after generation to verify the user after client sends verification code

        if (!saveVerificationCode) {
            return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: "verification code could not be saved" });
        }
        const mailSent = await sendMail(userSaved, VERIFICATION_CODE);
        if (!mailSent) {
            return res.status(500).json({ message: "mail was not sent", error: INTERNAL_SERVER_ERROR });
        }
        return res.status(200).json({ message: "mail sent" });
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
        return res.status(200).json(userTokenObject);
    } catch (error) {
        return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: error })
    }
}

// @desc Logs out a user
// @route /api/auth/signout
// @access private
const signout = async (req, res) => {
    const cookies = req.cookies;
    try {
        if (!cookies?.jwt) {
            return res.status(500).json({ message: NOT_FOUND_ERROR, error: "no jwt-cookie found" });
        }
        const refreshToken = cookies.jwt;
        if (refreshToken) {
            res.clearCookie("jwt", { httpOnly: true, secure: false, sameSite: 'None' });
        }
        const deletedRefreshToken = await TokenModel.findOneAndDelete({ refresh_token: refreshToken })
        if (!deletedRefreshToken) {
            return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: "refresh token not found" });
        }
        return res.status(200).json({ message: "success" });
    } catch (error) {
        return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: error });
    }
};

// @desc changes the current password to a new password sent from the client by the user
// @routes /api/auth/change-password
// @access private
const changePassword = async (req, res) => {
    try {
        const { email, password, newPassword } = req.body;
        const user = await getUserByEmail(email); // gets the user document which matches with the email
        if (!user) {
            return res.status(404).json({ message: NOT_FOUND_ERROR, error: "user not found" });
        }
        const passwordVerified = await compareValues(password, user.password); //compares the password from the document with the password sent from the client
        if (!passwordVerified) {
            return res.status(203).json({ message: UNAUTHORIZED_EXCEPTION, error: "password not matched" });
        }
        const passwordChanged = await UserModel.findByIdAndUpdate(user._id, {
            password: await hashValue(newPassword)
        }, { new: true }); //updates the password
        if (!passwordChanged) {
            return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: "error changing password" });
        }
        // Call signout function to log out the user
        const signoutResponse = await signout(req, res);
        if (signoutResponse.statusCode !== 200) {
            return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: "error signing out user after password change" });
        }
        return res.status(200).json({ message: "password changed" });
    } catch (error) {
        return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: error });
    }
};

// @desc renew the current password sent from the client by the user
// @routes /api/auth/renw-password
// @access private
const renewPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await getUserByEmail(email); // gets the user document which matches with the email
        if (!user) {
            return res.status(404).json({ message: NOT_FOUND_ERROR, error: "user not found" });
        }
        const passwordChanged = await UserModel.findByIdAndUpdate(user._id, {
            password: await hashValue(newPassword)
        }, { new: true }); //updates the password
        if (!passwordChanged) {
            return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: "error changing password" });
        }
        return res.status(200).json({ message: "password renewed" });
    }

    catch (error) {
        return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: error });
    }
};

// @desc sends the verification code if the user forgets password
// @route /api/auth/forgot-password
// @access private
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await getUserByEmail(email); // gets the user document which matches with the email
        if (!user) {
            return res.status(404).json({ message: NOT_FOUND_ERROR, error: "user not found" });
        };
        // sends email with a verification code 
        let VERIFICATION_CODE = generateCode();

        const saveVerificationCode = await VerificationCodeModel.findOneAndUpdate({ email: user.email }, {
            email: user.email,
            code: VERIFICATION_CODE,
            verificationType: 'forgot'
        }, { new: true, upsert: true }).exec(); // saving verification code after generation to verify the user after client sends verification code
        if (!saveVerificationCode) {
            return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: "verification code could not be saved" });
        }
        await sendMail(user, VERIFICATION_CODE);
        return res.status(200).json({ message: "mail sent" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: error });
    }
};


// @desc deletes an account which matches with the id
// @route /api/auth/:id
// @access private
const deleteAccount = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedAccount = await deleteUser(id);
        if (!deletedAccount) {
            return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: "not able to delete account" });
        }
    } catch (error) {
        return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: error });
    }

};

// @desc verifies the verification code sent from the client
// @route /api/auth/verify
// @access private
const emailVerificationCode = async (req, res) => {
    try {
        const { email, code, verificationType } = req.body;
        const userVerification = await VerificationCodeModel.findOne({ email: email });
        if (!userVerification) {
            return res.status(404).json({ message: NOT_FOUND_ERROR, error: "verification code not found" })
        }
        if (!(userVerification.code == code && userVerification.verificationType === verificationType)) {
            return res.status(203).json({ message: NOT_MATCHED_ERROR, error: "the verification code from the client does not match" });
        }

        if (verificationType === "register") {
            const userIsVerified = await UserModel.findOneAndUpdate({ email: email }, { isVerified: true }, { new: true });
            if (!userIsVerified) {
                return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: "user could not get verified" });
            }
            const userTokenObject = generateAccessToken(userIsVerified); // generates access token which expires in 15 min.
            const RefreshTokenObject = generateRefreshToken(userIsVerified); // generates refresh token which expires in 1 day.

            const TokenObject = new TokenModel({
                uuid: userIsVerified._id,
                refresh_token: RefreshTokenObject.refresh_token
            });
            const savedRefreshToken = await TokenObject.save(); // saves the refresh token to the database for 1 day or until user logsout
            if (!savedRefreshToken) {
                return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: "user refresh token could not be saved" });
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