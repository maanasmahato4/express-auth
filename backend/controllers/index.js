const {GetUsers, GetUserById, GetUserByEmail, AddUser, UpdateUser, DeleteUser } = require("./users/index");

module.exports = {
    AddUser,
    GetUsers,
    GetUserById,
    GetUserByEmail,
    UpdateUser,
    DeleteUser
}