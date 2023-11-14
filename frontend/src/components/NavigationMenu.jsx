import { Container } from "@mantine/core";
import { Link } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from "../context/auth.context";
import SignOut from "./signOut";

const style = {
    textDecoration: "none",
    color: "black",
    marginInline: "0.5rem",
    marginBlock: "1rem",
    cursor: "pointer"
}

function NavigationMenu() {
    const { isAuthenticated } = useContext(AuthContext);
    return (
        <Container display="flex">
            {
                isAuthenticated ?
                    <>
                        <Link style={style} to="/">Home</Link>
                        <Link style={style} to="/users">Users</Link>
                        <Link style={style} to="/user">Profile</Link>
                        <Link style={style} to="/change-password">Change password</Link>
                        <SignOut/>
                    </>
                    : <>
                        <Link style={style} to="/signup">SignUp</Link>
                        <Link style={style} to="/signin">Login</Link>
                    </>
            }
        </Container>
    )
}

export default NavigationMenu;