import { gql } from "@apollo/client";

export const GET_USER = gql`
    query GetUser {
        getUser {
            user {
            _id
            username
            }
        }
    }
`;

export const GET_USER_PETS = gql`
    query GetUserPets {
        getUserPets {
            _id
            age
            name
            type
            posts {
            _id
            }
        }
    }
`