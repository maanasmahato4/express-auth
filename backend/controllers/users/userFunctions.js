const path = require("path");
const { UserModel } = require("../../model");
const fs = require("fs");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");
const { AddToCloudinary, DeleteFromCloudinary } = require("../../utils/cloudinary");

// @desc Returns and array of users
const getUsers = async () => {
    try {
        const users = await UserModel.find();
        return users;
    } catch (error) {
        throw { status: 500, error: INTERNAL_SERVER_ERROR, message: error };
    }
}

// @desc Return a document of a user with matching _id
// @param id: String
const getUserById = async (id) => {
    try {
        const user = await UserModel.findById(id);
        return user;
    } catch (error) {
        throw { status: 500, error: INTERNAL_SERVER_ERROR, message: error };
    }
}

// @desc Returns a user with matching email
// @param email:String
const getUserByEmail = async (email) => {
    try {
        const user = await UserModel.findOne({ email: email });
        return user;
    } catch (error) {
        throw { status: 500, error: INTERNAL_SERVER_ERROR, message: error };
    }
}

// @desc Adds a new user to the document
// @param body, file
const addUser = async (body, file) => {
    try {
        const result = await AddToCloudinary(file.path, "users"); //adds the file to the cloudinary, the file is picked from the file path
        if (!result) {
            throw { status: 500, message: "image could not be saved", error: "error at addUser function" };
        }
        const newUser = new UserModel({
            username: body.username,
            email: body.email,
            password: body.password,
            roles: body.roles.split(','),
            imageUrl: {
                img_id: result.public_id,
                url: result.url
            },
            isVerified: body.isVerified
        });
        const user = await newUser.save();

        // deletes the image from the uploads folder if the image with the same name exists
        const imageExist = path.join(__dirname, "../../uploads", file.originalname);
        if (imageExist) {
            fs.unlinkSync(imageExist);
        }
        return user;
    } catch (error) {
        throw { status: 500, error: INTERNAL_SERVER_ERROR, message: error }
    }
}

// @desc Updates a user with matching id
// @Param id: String, body, file
const updateUser = async (id, body, file) => {
    let updatedUser = {
        username: body.username,
        email: body.email,
        password: body.password,
        roles: typeof body.roles === "string" ? body.roles.split(',') : body.roles,
        isVerified: body.isVerified
    };
    try {
        if (file) {
            const saved_result = await AddToCloudinary(file.path, "users"); // add the image to the cloudinary
            if (!saved_result) {
                throw { status: 500, message: "image could not be saved", error: "error at updateUser function" };
            }
            updatedUser.imageUrl = {
                img_id: saved_result.public_id,
                url: saved_result.url
            }
            const userImage = await getUserById(id);
            const deleted_result = await DeleteFromCloudinary(userImage.imageUrl.img_id); // deletes the image from cloudinary
            if (!deleted_result) {
                throw { status: 500, message: "previous image could not be deleted", error: "error at updateUser function" };
            }
            const user = await UserModel.findByIdAndUpdate(id, updatedUser, { new: true });

            // deletes the image from the uploads folder
            const imageExist = path.join(__dirname, "../../uploads", file.originalname);
            if (imageExist) {
                fs.unlinkSync(imageExist);
            }
            return user;
        } else {
            updatedUser.imageUrl = {
                img_id: body.imageUrl.img_id,
                url: body.imageUrl.url
            }
            const user = await UserModel.findByIdAndUpdate(body._id, updatedUser, { new: true });
            return user;
        }
    } catch (error) {
        throw { status: 500, error: INTERNAL_SERVER_ERROR, message: error };
    }
}

// @desc Deletes a user with matching id
// @param id: String
const deleteUser = async (id) => {
    try {
        const result = await UserModel.findByIdAndDelete(id);
        return result;
    } catch (error) {
        throw { status: 500, error: INTERNAL_SERVER_ERROR, message: error };
    }
}

module.exports = { getUsers, getUserById, getUserByEmail, addUser, updateUser, deleteUser };