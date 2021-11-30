import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation loginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`
export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email , password: $password ) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`
export const SAVE_BOOK = gql`
    mutation saveBook($authors: [String], $description: String, $title: String, $bookId: String $image: String, $link: String) {
        saveBook(authors: $authors, description: $description, title: $title, bookId: $bookId, image: $image , link: $link) {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`
export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: ID!) {
        removeBook(bookId: $bookId) {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`
