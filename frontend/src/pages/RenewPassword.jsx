import { useState, useEffect, useContext } from "react";
import { publicApi } from "../api/axios";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import { Button, Container, TextInput } from "@mantine/core";

function RenewPassword() {
  const navigate = useNavigate();
  const { verificationObject } = useContext(AuthContext);
  const [renewPasswordFormData, setRenewPasswordFormData] = useState({ email: verificationObject.email, newPassword: "" });
  useEffect(() => {
    if (verificationObject.verificationType !== "forgot") {
      navigate("/login");
    }
  }, [verificationObject])

  const handleChange = (e) => {
    setRenewPasswordFormData({ ...renewPasswordFormData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await publicApi.post("/auth/renew-password", renewPasswordFormData);
      if (data.message === "password renewed") {
        navigate("/login");
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Container>
      <form>
        <TextInput label="Email" placeholder="abc@gmail.com" value={verificationObject.email || ""} name="email" onChange={handleChange} />
        <TextInput label="New Password" placeholder="" name="newPassword" onChange={handleChange} />
        <Button onClick={handleSubmit} style={{ marginBlock: "0.5rem" }}>Submit</Button>
      </form>
    </Container>
  )
}

export default RenewPassword;