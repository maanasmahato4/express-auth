const { GetUsers, GetUserById, GetUserByEmail, AddUser, UpdateUser, DeleteUser } = require("./users");
const { register, signin, signout, resetPassword, forgotPassword, deleteAccount, emailVerificationCode } = require("./auth");

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
    resetPassword,
    forgotPassword,
    deleteAccount,
    emailVerificationCode
}