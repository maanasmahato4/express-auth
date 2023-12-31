const { getUsers, getUserById, getUserByEmail, addUser, updateUser, deleteUser } = require("./userFunctions");
const { NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR } = require("../../utils/constants");

// @desc Gets all the user documents
// @route GET /api/users
// @access private
const GetUsers = async (req, res) => {
    try {
        // The users constant consists of an array of users where each user document is received with this format.
        /* 
            {
                _id: string,
                username: string,
                email: string
                password: string,
                roles: [string],
                imageUrl: { img_id: string, url: string, _id: string },
                isVerified: boolean
            }
        */
        const users = await getUsers();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: NOT_FOUND_ERROR, error: NOT_FOUND_ERROR });
        }
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR, message: error });
    }
}

// @desc Gets a single user document which matches with the id sent from the client
// @route GET /api/user/:id
// @access private
const GetUserById = async (req, res) => {
    try {
        const id = req.params.id;
        // The user constant consists of a document which is received with this format.
        /* 
            {
                _id: string,
                username: string,
                email: string
                password: string,
                roles: [string],
                imageUrl: { img_id: string, url: string, _id: string },
                isVerified: boolean
            }
        */
        const user = await getUserById(id);
        if (!user || user.length === 0) {
            return res.status(404).json({ message: NOT_FOUND_ERROR, error: NOT_FOUND_ERROR });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR, message: error });
    }
}

// @desc Gets a single user document which matches with the email sent from the client
// @route GET /api/user
// @access private
const GetUserByEmail = async (req, res) => {
    try {
        const email = req.body.email;
        // The user constant consists of a document which is received with this format.
        /* 
            {
                _id: string,
                username: string,
                email: string
                password: string,
                roles: [string],
                imageUrl: { img_id: string, url: string, _id: string },
                isVerified: boolean
            }
        */
        const user = await getUserByEmail(email);
        if (!user || user.length === 0) {
            return res.status(404).json({ message: NOT_FOUND_ERROR, error: NOT_FOUND_ERROR });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR, message: error });
    }
}

// @desc Adds a new user
// @route POST /api/user
// @access private
const AddUser = async (req, res, next) => {
    try {
        // The user constant consists of a document which is received with this format.
        /* 
            {
                _id: string,
                username: string,
                email: string
                password: string,
                roles: [string],
                imageUrl: { img_id: string, url: string, _id: string },
                isVerified: boolean
            }
        */
        const user = await addUser(req.body, req.file);
        if (!user) {
            return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: "user could not be saved" });
        }
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR, message: error });
    }
}

// @desc Updates a user document which matches with the id sent from the client
// @route PUT /api/user/:id
// @access private
const UpdateUser = async (req, res) => {
    try {
        const id = req.params.id;
        // The user constant consists of a document which is received with this format.
        /* 
           {
               _id: string,
               username: string,
               email: string
               password: string,
               roles: [string],
               imageUrl: { img_id: string, url: string, _id: string },
               isVerified: boolean
           }
       */
        const user = await updateUser(id, req.body, req.file);
        if (!user) {
            return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: "user could not be updated" });
        }
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR, message: error });
    };
};

// @desc Deletes a user document which matches with the id sent from the client
// @route GET /api/user
// @access private
const DeleteUser = async (req, res) => {
    try {
        // The deleted constant consists of an object
        /* 
            {
                message: string
            }
        */
        const deleted = await deleteUser(req.body._id);
        if (!deleted) {
            return res.status(500).json({ message: INTERNAL_SERVER_ERROR, error: "user could not be deleted" });
        }
        res.status(204).json({ message: "user deleted" });
    } catch (error) {
        return res.status(500).json({ error: INTERNAL_SERVER_ERROR, message: error });
    };
};


module.exports = { GetUsers, GetUserById, GetUserByEmail, AddUser, UpdateUser, DeleteUser };