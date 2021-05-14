const dataMapper = {
    getJWT: (email, password) => {
        const JWT_AUD = process.env.JWT_AUD;
        const body = {
            query: `
                mutation SignInMutation($input: signInInput!) {
                    signIn(input: $input) {
                    currentUser {
                        slug
                        jwtToken (aud:"${JWT_AUD}") {
                            token
                        }
                    }
                    otpSessionChallenge
                    errors {
                        message
                        code 
                        path
                    }
                    } 
                }
            `,
            variables: {
                input: {
                    email,
                    password,
                },
            },
        };
        return body;
    },
    AuthWith2FA: (otpSessionChallenge, otpAttempt) => {
        const JWT_AUD = process.env.JWT_AUD;
        const body = {
            query: `
                mutation SignInMutation($input: signInInput!) {
                    signIn(input: $input) {
                    currentUser {
                        jwtToken (aud:"${JWT_AUD}") {
                            token
                        }
                    }
                    otpSessionChallenge
                    errors {
                        message
                        code 
                        path
                    }
                    } 
                }
            `,
            variables: {
                input: {
                    otpSessionChallenge,
                    otpAttempt,
                },
            },
        };
        return body;
    },
    getUserInfos: () => {
        const data = {
            query: `
                {
                currentUser {
                    slug
                    profile {
                        pictureUrl
                    }
                }
            }
            `
        };
        return data;
    }
}

module.exports = dataMapper;