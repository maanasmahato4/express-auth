const { GetUsers, GetUserById, GetUserByEmail, AddUser, UpdateUser, DeleteUser } = require("./users");
const { register, signin, signout, changePassword, forgotPassword, renewPassword, deleteAccount, emailVerificationCode, refreshAccessToken } = require("./auth");

module.exports = {
    AddUser,
    GetUsers,
    GetUserById,
    GetUserByEmail,
    UpdateUser,
    DeleteUser,
    register,
    signin,
    signout,
    changePassword,
    forgotPassword,
    deleteAccount,
    emailVerificationCode,
    renewPassword,
    refreshAccessToken
}