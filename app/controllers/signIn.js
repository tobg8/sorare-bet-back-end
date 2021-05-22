const axios = require('axios');
const bcrypt = require('bcrypt');

const signIn = {
    getSalt: async (req, res) => {
        // retrieve email and password
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                error: 'Provide valid email or password',
            });
        }
        // use email to retrieve the salt
        const url = `${process.env.SALT_URL}/${email}`;
        try {
            const response = await axios.get(url);
            const salt = response.data.salt;
            // hash the password with salt and return it
            const saltyPassword = bcrypt.hashSync(password, salt);
            res.status(200).json({
                saltyPassword: saltyPassword,
            });
        } 
        catch (error) {
            console.trace(error);
        }
    },
    tryLogin: async(req, res) => {
        const { email, password } = req.body;
        const url = process.env.API_URL;
        const JWT_AUD = process.env.JWT_AUD;
        try {
            // const response = await axios.post(url, dataMapper.getJWT(email,password));
            const response = await axios ({
                url: url,
                method: 'post',
                data: {
                    query: `
                        mutation SignInMutation($input: signInInput!) {
                            signIn(input: $input) {
                            currentUser {
                                id
                                slug
                                jwtToken (aud:${JWT_AUD}) {
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
                },
            });
            console.log(response.data);
            // if we dont get currentUser or otpSessionChallenge there is no user with this credentials
            if (!response.data.data.signIn.otpSessionChallenge && !response.data.data.signIn.currentUser) {
                res.status(404).json({
                    error: 'No user found, double check credentials',
                });
            };
            // If we get an otpSessionChallenge it means we have 2FA
            if (response.data.data.signIn.otpSessionChallenge && response.data.data.signIn.currentUser === null) {
                res.json(response.data.data.signIn);
            };
            // ! if no 2FA account sometimes you get access to data instantly and sometimes they send a code to email.
            // ! email code works like 2FA.
        } 
        catch (error) {
            console.log(error);
        }
    },
    doubleAuthLogin: async(req, res) => {
        const { otpSessionChallenge, otpAttempt } = req.body;
        const url = process.env.API_URL;
        const JWT_AUD = process.env.JWT_AUD;
        try {
            // const response = await axios.post(url, dataMapper.AuthWith2FA(otpSessionChallenge, otpAttempt));
            const response = await axios ({
                url: url,
                method: 'post',
                data: {
                    query: `
                        mutation SignInMutation($input: signInInput!) {
                            signIn(input: $input) {
                            currentUser {
                                jwtToken (aud:${JWT_AUD}) {
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
                },
            });
            // If bad otpCode
            if (response.data.data.signIn.errors.length > 0) {
                return res.status(400).json({
                    error: 'invalid code',
                })
            }
            res.status(200).json(response.data.data.signIn.currentUser)
        } 
        catch (error) {
            console.trace(error);
        }
    },
    getUserInfos: async (req, res) => {
        const { jwt } = req.body;
        const url = process.env.API_URL;
        try {
            if(!jwt) {
                res.status(400).json({
                    error: 'not signed in',
                });
            }
            const response = await axios ({
                url: url,
                method: 'post',
                headers: {
                    authorization: `Bearer ${jwt}`
                },
                data: {
                    query: `
                        {
                        currentUser {
                            slug
                            id
                            profile {
                                pictureUrl
                            }
                        }
                    }
                    `
                },
            });

            if (response.status === 200) {
                res.status(200).json(response.data.data.currentUser);
            }
        } 
        catch (error) {
            return res.json(error, '&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
        }
    },
    getCards: async (req, res) => {
        const { jwt } = req.body;
        const url = process.env.API_URL;
        try {
            if(!jwt) {
                res.status(400).json({
                    error: 'not signed in',
                });
            }

            const response = await axios ({
                url: url,
                method: 'post',
                headers: {
                    authorization: `Bearer ${jwt}`
                },
                data: {
                    query: `
                    {
                        currentUser {
                          cards {
                            slug
                            id
                            rarity
                            pictureUrl
                            position
                            player {
                              status {
                                lastFiveSo5AverageScore
                              }
                              activeClub {
                                upcomingGames(first: 2) {
                                  date
                                  id
                                  away {
                                    name
                                    pictureUrl
                                  }
                                  home {
                                    name
                                    pictureUrl
                                  }
                                  so5Fixture {
                                    aasmState
                                    canCompose
                                    id
                                    gameWeek
                                    startDate
                                    endDate
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                      
                    `
                },
            });
            if(response.status === 200) {
                res.status(200).json(response.data.data.currentUser.cards);
            }
        } 
        catch (error) {
            console.log(error);
        }
    },
}

module.exports = signIn;