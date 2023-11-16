import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";
import { useRefreshToken } from "../hooks/useRefreshToken";
import { jwtDecode } from "jwt-decode";

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, accessToken, setAccessToken, setIsAuthenticated, setDecodedTokenObject } = useContext(AuthContext);
    const refresh = useRefreshToken();
    useEffect(() => {
        const persistAuth = async () => {
            if (!isAuthenticated && !accessToken) {
                const accessTokenObject = await refresh();
                if (accessTokenObject?.access_token) {
                    setAccessToken(accessTokenObject.access_token);
                    const decodedObject = jwtDecode(accessTokenObject.access_token);
                    setDecodedTokenObject(decodedObject);
                    setIsAuthenticated(true);
                }
                if (!accessTokenObject?.access_token) {
                    setIsAuthenticated(false);
                    console.log(isAuthenticated);
                }
            }
        }

        persistAuth();
    }, [])
    return isAuthenticated ? children : <Navigate to="/signin" />
}

