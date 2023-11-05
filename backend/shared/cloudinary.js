const { INTERNAL_SERVER_ERROR } = require("../utils/contants");
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
        throw Error(`${INTERNAL_SERVER_ERROR}\t${error}`)
    }
}

module.exports = { AddToCloudinary };