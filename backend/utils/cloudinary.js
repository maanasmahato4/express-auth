const { INTERNAL_SERVER_ERROR } = require("./constants");
const { cloudinary } = require("../Config/cloudinary.config");

const AddToCloudinary = (filePath, folder) => {
    try {
        const result = cloudinary.uploader.upload(filePath, {
            overwrite: true,
            invalidate: true,
            resource_type: "auto",
            folder: folder
        })

        return result;
    } catch (error) {
        throw { status: 500, message: INTERNAL_SERVER_ERROR, error: error };
    }
};

const DeleteFromCloudinary = (publicId) => {
    try {
        const result = cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw { status: 500, message: INTERNAL_SERVER_ERROR, error: error };
    }
}

module.exports = { AddToCloudinary, DeleteFromCloudinary };