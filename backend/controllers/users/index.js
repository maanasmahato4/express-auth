const { getUsers, getUserById, getUserByEmail, addUser, updateUser, deleteUser } = require("./userFunctions");
const { NOT_FOUND_ERROR } = require("../../utils/contants");

const GetUsers = async (req, res, next) => {
    try {
        const users = await getUsers();
        if (!users || users.length === 0) {
            res.status(404).json({ error: NOT_FOUND_ERROR })
        }
        res.status(200).json(users);
    } catch (error) {
        next({ status: 500, message: INTERNAL_SERVER_ERROR, error: error });
    }
}

const GetUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await getUserById(id);
        if (!user || user.length === 0) {
            res.status(404).json({ error: NOT_FOUND_ERROR });
        }
        res.status(200).json(user);
    } catch (error) {
        next({ status: 500, message: INTERNAL_SERVER_ERROR, error: error });
    }
}

const GetUserByEmail = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await getUserByEmail(email);
        if (!user || user.length === 0) {
            res.status(404).json({ error: NOT_FOUND_ERROR });
        }
        res.status(200).json(user);
    } catch (error) {
        next({ status: 500, message: INTERNAL_SERVER_ERROR, error: error });
    }
}

const AddUser = async (req, res, next) => {
    try {
        const user = await addUser(req.body, req.file);
        if (!user) {
            res.status(500).json({ error: "user could not be saved" });
        }
        res.status(201).json(user);
    } catch (error) {
        next({ status: 500, message: INTERNAL_SERVER_ERROR, error: error });
    }
}

const UpdateUser = async (req, res, next) => {
    try {
        const user = await updateUser(req.body, req.file);
        if (!user) {
            res.status(500).json({ error: "user could not be updated" });
        }
        res.status(203).json(user);
    } catch (error) {
        next({ status: 500, message: INTERNAL_SERVER_ERROR, error: error });
    }
}

const DeleteUser = async (req, res, next) => {
    try {
        const deleted = await deleteUser(req.body._id);
        if (!deleted) {
            res.status(500).json({ error: "user could not be deleted" });
        }
        res.status(204).json({ message: "user deleted" });
    } catch (error) {
        next({ status: 500, message: INTERNAL_SERVER_ERROR, error: error });
    }
}


module.exports = { GetUsers, GetUserById, GetUserByEmail, AddUser, UpdateUser, DeleteUser };