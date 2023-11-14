import { publicApi } from "../api/axios";
import { useState, useEffect } from "react";

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const controller = new AbortController();
        const getUser = async () => {
            try {
                const users = await publicApi.get("/users", {
                    signal: controller.signal
                });
                setUsers(users.data);
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.log(error);
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
