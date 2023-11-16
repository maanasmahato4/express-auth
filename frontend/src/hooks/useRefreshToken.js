import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";


export const useRefreshToken = () => {
    const { setAccessToken } = useContext(AuthContext);

    const refresh = async () => {
        const { data } = await axios.get("http://localhost:3000/api/auth/refresh", {
            withCredentials: true
        });
        setAccessToken(data.accessTokenObject.access_token);
        return data.accessTokenObject;
    }
    return refresh;
}