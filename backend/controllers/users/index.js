const path = require("path");
const { cloudinary } = require("../../cloudinary/config");
const { User } = require("../../model/user.model");
const fs = require("fs");

const AddUser = async (req, res, next) => {
    try {
        const file = req.file.path;
        const result = await cloudinary.uploader.upload(file, {
            overwrite: true,
            invalidate: true,
            resource_type: "auto",
            folder: "users"
        });
        if (!result) {
            next("error no imageurl found")
        }
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            roles: req.body.roles.split(','),
            imageUrl: {
                img_id: result.public_id,
                url: result.url
            }
        });
        const user = await newUser.save();

        const imageExist = path.join(__dirname, "../../uploads", req.file.originalname);
        if (imageExist) {
            fs.unlinkSync(imageExist);
        }
        res.status(201).json(user)
    } catch (error) {
        next(error);
    }
}

module.exports = { AddUser };