const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    const access_token = jwt.sign(
        {
            "userInfo": {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.roles,
                isVerified: user.isVerified,
                image: {
                    img_id: user.imageUrl.img_id,
                    url: user.imageUrl.url,
                    _id: user.imageUrl._id
                },
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '30min'
        }
    );
    return access_token;
};

const generateRefreshToken = (user) => {
    const refresh_token = jwt.sign(
        {
            "userInfo": {
                _id: user._id,
                email: user.email
            }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    );

    return refresh_token;
}


module.exports = { generateAccessToken, generateRefreshToken };