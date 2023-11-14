import { useContext } from 'react';
import { Card, Container, Image } from "@mantine/core";
import { AuthContext } from "../context/auth.context";

function UserProfile() {
    const { decodedTokenObject } = useContext(AuthContext);
    const { username, email, image } = decodedTokenObject.userInfo;
    return (
        <Container>
            <Card>
                <Card.Section>
                    <Image src={image.url} height={150} alt={username} />
                </Card.Section>
                <Card.Section>
                    <h3>{username}</h3>
                    <h3>{email}</h3>
                </Card.Section>
            </Card>
        </Container>
    )
}

export default UserProfile;