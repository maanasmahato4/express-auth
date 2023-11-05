const path = require("path");
const { User } = require("../../model/user.model");
const fs = require("fs");
const { INTERNAL_SERVER_ERROR } = require("../../utils/contants");
const { AddToCloudinary } = require("../../shared/cloudinary");

const getUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        throw new Error({status: 500, message: INTERNAL_SERVER_ERROR, error: error})
    }
}

const getUserById = async (id) => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        throw new Error({status: 500, message: INTERNAL_SERVER_ERROR, error: error})
    }
}

const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email: email });
        return user;
    } catch (error) {
        throw new Error({status: 500, message: INTERNAL_SERVER_ERROR, error: error})
    }
}


const addUser = async (body, file) => {
    try {
        const result = await AddToCloudinary(file.path, "users");
        if (!result) {
            throw new Error({status: 500, message: "image could not be saved", error: "error at addUser function"})
        }
        const newUser = new User({
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

        const imageExist = path.join(__dirname, "../../uploads", file.originalname);
        if (imageExist) {
            fs.unlinkSync(imageExist);
        }
        return user;
    } catch (error) {
        throw new Error({status: 500, message: INTERNAL_SERVER_ERROR, error: error})
    }
}

const updateUser = async (body, file) => {
    let updatedUser = {
        username: body.username,
        email: body.email,
        password: body.password,
        roles: body.roles.split(','),
        isVerified: body.isVerified
    };
    try {
        if (file || file.length > 0) {
            const result = await AddToCloudinary(file.path, "users");
            if (!result) {
                throw new Error({status: 500, message: "image could not be saved", error: "error at updateUser function"});
            }
            updatedUser.imageUrl = {
                img_id: result.public_id,
                url: result.url
            }
            const user = await User.findByIdAndUpdate(body._id, updatedUser);
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
            const user = await User.findByIdAndUpdate(body._id, updatedUser);
            return user;
        }
    } catch (error) {
        throw new Error({status: 500, message: INTERNAL_SERVER_ERROR, error: error})
    }
}

const deleteUser = async (id) => {
    try {
        const result = await User.findByIdAndDelete(id);
        return result;
    } catch (error) {
        throw new Error({status: 500, message: INTERNAL_SERVER_ERROR, error: error})
    }
}

module.exports = { getUsers, getUserById, getUserByEmail, addUser, updateUser, deleteUser };