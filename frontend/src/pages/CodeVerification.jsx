import { TextInput, Container, Button } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import { publicApi } from "../api/axios";
import { jwtDecode } from "jwt-decode";

function CodeVerification() {
    const navigate = useNavigate();
    const { verificationObject, setAccessToken, setIsAuthenticated, setDecodedTokenObject, setIsVerified } = useContext(AuthContext);

    const [verification, setVerification] = useState({
        email: verificationObject.email,
        code: "",
        verificationType: verificationObject.verificationType
    });

    useEffect(() => {
        if (!verificationObject) {
            navigate("/signup");
        }
    }, [verificationObject]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await publicApi.post("/auth/verify", verification);
            if (verificationObject.verificationType === "register") {

                if (!data.access_token) {
                    console.log("error at code verification component");
                } else {
                    const decodedUser = jwtDecode(data.access_token);
                    if (decodedUser.userInfo.isVerified === true) {
                        setAccessToken(data.access_token);
                        setDecodedTokenObject(decodedUser);
                        setIsAuthenticated(true);
                        navigate("/");
                    }
                }
            } else if (verificationObject.verificationType === "forgot") {
                if (!data.isVerified) {
                    console.log("error at code verification component");
                } else {
                    setIsVerified(true);
                    navigate("/renew-password");
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Container>
            <form>
                <TextInput
                    label="Verification Code"
                    name="code"
                    placeholder="eg:123456"
                    onChange={(e) => setVerification({ ...verification, code: e.target.value })}
                    required
                />
                <Button onClick={handleSubmit}>Submit</Button>
            </form>
        </Container>
    )
}

export default CodeVerification;