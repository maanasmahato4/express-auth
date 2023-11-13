import { publicApi } from "../api/axios";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";

function Users() {
    const [users, setUsers] = useState([]);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated !== true) {
            navigate("/login");
        }
    }, [isAuthenticated]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getUser = async () => {
            try {
                const users = await publicApi.get("/users", {
                    signal: controller.signal
                });
                isMounted && setUsers(users.data);
            } catch (error) {
                console.log(error);
            }
        };

        getUser();
        return () => {
            isMounted = false;
            controller.abort()
        }
    }, [])

    return (
        <div>
            {users?.length > 1 ?
                <div>
                    {users.map((user, idx) => {
                        return <ul key={idx}>
                            <li>{user.username}</li>
                        </ul>
                    })}
                </div>
                : <p>No users to display</p>
            }
        </div>
    )
}


export default Users;