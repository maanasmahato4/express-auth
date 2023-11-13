import { useContext } from "react";
import { publicApi } from "../api/axios";
import { AuthContext } from "../context/auth.context";
import { Button } from "@mantine/core";
function signOut() {
    const { isAuthenticated, setIsAuthenticated, setAccessToken, setDecodedTokenObject } = useContext(AuthContext);

    const handleSignOut = async () => {
        try {
            const { data } = await publicApi.post("/auth/signout");
            if (data.isAuthenticated === false) {
                setAccessToken('');
                setDecodedTokenObject({})
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Button onClick={handleSignOut} disabled={isAuthenticated === false ? true : false}>SignOut</Button>
    )
}

export default signOut