import { createContext, useState } from "react";

export const AuthContext = createContext({
    accessToken: '',
    setAccessToken: () => '',
    decodedTokenObject: {},
    setDecodedTokenObject: () => { },
    isAuthenticated: false,
    setIsAuthenticated: () => false,
    verificationObject: {email: "", verificationType: ""},
    setVerificationObject: () => {},
    isVerified: false,
    setIsVerified: () => false
});

export const AuthContextProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState('');
    const [decodedTokenObject, setDecodedTokenObject] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [verificationObject, setVerificationObject] = useState({email: "", verificationType: ""});
    
    return <AuthContext.Provider value={{
        accessToken,
        setAccessToken,
        decodedTokenObject,
        setDecodedTokenObject,
        isAuthenticated,
        setIsAuthenticated,
        verificationObject,
        setVerificationObject,
        isVerified,
        setIsVerified
    }}>
        {children}
    </AuthContext.Provider>
};