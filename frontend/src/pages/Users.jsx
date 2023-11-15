import { useState, useEffect } from "react";
import {usePrivateAxios} from "../hooks/useAxiosPrivate";
import {useNavigate, useLocation} from "react-router-dom";

function Users() {
    const [users, setUsers] = useState([]);
    const privateApi = usePrivateAxios();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const getUser = async () => {
            try {
                const users = await privateApi.get("/users", {
                    signal: controller.signal
                });
                setUsers(users.data);
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.log(error);
                    navigate('/signin', { state: { from: location }, replace: true });
                }
            }
        };

        getUser();
        return () => {
            controller.abort()
        }
    }, [])

    return (
        <div>
            {users?.length >= 1 ?
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
