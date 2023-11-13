import React, { useState, useContext } from 'react';
import { Container, TextInput, FileInput, Button } from "@mantine/core";
import { publicApi } from "../api/axios";
import { AuthContext } from "../context/auth.context";
import {useNavigate} from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();
    const { verificationObject, setVerificationObject } = useContext(AuthContext);
    const [newAccount, setNewAccount] = useState({ username: "", email: "", password: "", roles: 'user', isVerified: false, image: null });
    const handleChange = (e, name) => {
        if (name !== 'image') {
            setNewAccount({ ...newAccount, [name]: e.target.value });
        } else {
            setNewAccount({ ...newAccount, [name]: e });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("username", newAccount.username);
        formData.append("email", newAccount.email);
        formData.append("password", newAccount.password);
        formData.append("roles", newAccount.roles);
        formData.append("isVerified", newAccount.isVerified);
        formData.append("image", newAccount.image);
        try {
            const { data } = await publicApi.post("/auth/register", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (data.message === "mail sent") {
                setVerificationObject({ ...verificationObject, email: newAccount.email, verificationType: 'register' });
                navigate("/verify");
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div>
            <Container>
                <form>
                    <TextInput label="Username" placeholder='eg: john' name='username' onChange={(e) => handleChange(e, 'username')} required />
                    <TextInput label="Email" placeholder='abc@gmail.com' name="email" onChange={(e) => handleChange(e, 'email')} required />
                    <TextInput label="Password" type="password" name='password' onChange={(e) => handleChange(e, 'password')} required />
                    <FileInput label="Profile image" name='image' onChange={(e) => handleChange(e, 'image')} required />
                    <Button style={{ marginBlock: "0.5rem" }} onClick={handleSubmit}>Submit</Button>
                </form>
            </Container>
        </div>
    )
}

export default SignUp;