const {GetUsers, GetUserById, GetUserByEmail, AddUser, UpdateUser, DeleteUser } = require("./users/index");
const {register, signin, signout, resetPassword, forgotPassword} = require("./auth");

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
    forgotPassword
}