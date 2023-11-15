import { useContext, useEffect } from "react";
import "../context/auth.context";
import { useRefreshToken } from "./useRefreshToken";
import { privateApi } from "../api/axios";
import { AuthContext } from "../context/auth.context";

export const usePrivateAxios = () => {
    const { accessToken, setAccessToken } = useContext(AuthContext);
    const refresh = useRefreshToken();

    useEffect(() => {
        const requestIntercept = privateApi.interceptors.request.use(
            config => {
                if (!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = privateApi.interceptors.response.use(
            response => response,
            async (error) => {
                const prevReq = error?.config;
                if (error?.response?.status === 403 && !prevReq?.sent) {
                    prevReq.sent = true;
                    const newAccessTokenObject = await refresh();
                    prevReq.headers['Authorization'] = `Bearer ${newAccessTokenObject.access_token}`;
                    setAccessToken(newAccessTokenObject.access_token);
                    return privateApi(prevReq);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            privateApi.interceptors.request.eject(requestIntercept);
            privateApi.interceptors.response.eject(responseIntercept);
        }
    }, [accessToken, refresh]);
    return privateApi;
}