import { useContext, useEffect } from 'react'
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";

function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated !== true) {
      navigate("/signin");
    }
  }, [isAuthenticated]);
  return (
    <div>
      home
    </div>
  )
}

export default Home