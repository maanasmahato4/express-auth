const cloudinary = require("cloudinary").v2;

/* cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
}); */

cloudinary.config({
    cloud_name: 'dqn88yr6y', 
    api_key: '825141699117774', 
    api_secret: 'XlrXxTRQSHisQKwVeUyKexg-SFI' 
});
  

module.exports = {cloudinary};