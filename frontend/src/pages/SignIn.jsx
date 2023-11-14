import React, { useState, useContext } from 'react'
import { publicApi } from "../api/axios";
import { Container, TextInput, Button } from "@mantine/core";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from 'react-router-dom';
import ForgotPassword from '../components/forgotPassword';

function SignIn() {
    const navigate = useNavigate();
    const { setAccessToken, setDecodedTokenObject, setIsAuthenticated } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data } = await publicApi.post("/auth/signin", formData);
        const decodedUser = jwtDecode(data.access_token);
        setAccessToken(data.access_token);
        setDecodedTokenObject(decodedUser);
        setIsAuthenticated(true);
        navigate("/");
    }
    return (
        <div>
            <div>
                <Container>
                    <form>
                        <TextInput label="Email" placeholder='abc@gmail.com' name="email" onChange={(e) => handleChange(e, 'email')} required />
                        <TextInput label="Password" type="password" name='password' onChange={(e) => handleChange(e, 'password')} required />
                        <ForgotPassword email={formData.email}/>
                        <Button style={{ marginBlock: "0.5rem" }} onClick={handleSubmit}>Submit</Button>
                    </form>
                </Container>
            </div>
        </div>
    )
}

export default SignIn;