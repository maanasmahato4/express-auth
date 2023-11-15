import { useContext } from "react";
import { privateApi } from "../api/axios";
import { AuthContext } from "../context/auth.context";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
function SignOut() {
    const { isAuthenticated, accessToken, setIsAuthenticated, setAccessToken, setDecodedTokenObject } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            const { data } = await privateApi.post("/auth/signout", {}, {
                headers: `Bearer ${accessToken}`
            });
            if (data.isAuthenticated === false) {
                setAccessToken('');
                setDecodedTokenObject({})
                setIsAuthenticated(false);
                navigate("/signin");
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Button onClick={handleSignOut} disabled={isAuthenticated === false ? true : false} style={{
            marginInline: "0.5rem",
            marginBlock: "1rem"
        }}>SignOut</Button>
    )
}

export default SignOut;