import { useState, useContext } from "react";
import { Button, Container, TextInput } from "@mantine/core";
import { publicApi } from "../api/axios";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();
  const { accessToken, setAccessToken, decodedTokenObject, setDecodedTokenObject, setIsAuthenticated } = useContext(AuthContext);
  const [changePasswordForm, setChangePasswordForm] = useState({ email: decodedTokenObject.userInfo.email, password: "", newPassword: "" });

  const handleChange = (e) => {
    setChangePasswordForm({ ...changePasswordForm, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(changePasswordForm);
    try {
      const { data } = await publicApi.put("/auth/change-password", changePasswordForm, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log(data);
      if (data.isAuthenticated === false) {
        setAccessToken('');
        setDecodedTokenObject('');
        setIsAuthenticated(false);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }

  }
  return (
    <Container>
      <form>
        <TextInput
          label="Email"
          name="email"
          type="email"
          value={decodedTokenObject.userInfo.email || ''}
          placeholder="eg:abc@gmail.com"
          onChange={handleChange}
          required
        />
        <TextInput
          label="Current Password"
          name="password"
          type="password"
          onChange={handleChange}
          required
        />
        <TextInput
          label="New password"
          name="newPassword"
          type="password"
          onChange={handleChange}
          required
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </form>
    </Container>
  )
}

export default ChangePassword;