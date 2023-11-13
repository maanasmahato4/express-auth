import React, { useContext } from 'react';
import { publicApi } from "../api/axios";
import { AuthContext } from "../context/auth.context";
import {useNavigate} from "react-router-dom";

function ForgotPassword({ email }) {
  const { setVerificationObject } = useContext(AuthContext);
  const navigate  = useNavigate();
  const handleSubmit = async () => {
    const { data } = await publicApi("/auth/verify", email);
    if (data.message === "mail sent") {
      setVerificationObject({ email: email, verificationType: "forgot" });
      navigate("/verify");
    }
  }
  return (
    <div>
      <span style={{ color: "blue" }} onClick={handleSubmit}>forgot password</span>
    </div>
  )
}

export default ForgotPassword;