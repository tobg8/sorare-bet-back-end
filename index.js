const axios = require('axios');
const bcrypt = require('bcrypt');

const fetchTest = async () => {
    const email = 'sorarebusiness@yahoo.com'
    const response = await axios.get(`https://api.sorare.com/api/v1/users/${email}`);
    
    // Need to retrieve response.data.salt
    const salt = response.data.salt;
    const password = 'theomula987!';

    // Create hashed password
    const saltyPassword = bcrypt.hashSync(password, salt);
    console.log(saltyPassword)

    // Need to retrieve _sorare_session_id
    const cookie = response.headers['set-cookie'][1];

    // Need to retrieve a X-CSRF-TOKEN
    const CSRF = response.headers['csrf-token'];

    // Create Headers for post
    // const headers = {
    //     "x-csrf-token": CSRF,
    //     "set-cookie": cookie,
    //     'Content-Type': 'application/json'
    // }

   // Prepare Query and infos
    const url = 'https://api.sorare.com/graphql';
    const body = {
        query: `
            mutation SignInMutation($input: signInInput!) {
                signIn(input: $input) {
                currentUser {
                    slug
                    cardsCount
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
                "email": email,
                "password": saltyPassword,
            }
        }
    };
    
    const test = await axios.post(url, body)
    // console.log(test.data.data.signIn.otpSessionChallenge)
    const otpChall = test.data.data.signIn.otpSessionChallenge;
    console.log(otpChall)
    const otpCode = '226831'
    const body2 = {
        query: `
            mutation SignInMutation($input: signInInput!) {
                signIn(input: $input) {
                currentUser {
                    slug
                    cardsCount
                    cards {
                        slug
                        age
                        grade
                        name
                        id
                        rarity
                        pictureUrl
                        player {
                            so5Scores(last:5) {
                                score
                                player {
                                    slug
                                }
                                detailedScore {
                                    totalScore
                                }
                            }
                        }
                    }
                }
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
                "otpSessionChallenge": otpChall,
                "otpAttempt": otpCode,
            },
            last: "5",
        }
    };
    const finalTest = await axios.post(url, body2);
    // if(finalTest.data) {
    //     console.log(finalTest.data.errors);
    // }
    console.log(finalTest.data.data.signIn.currentUser.cards[0].player.so5Scores);
    // if(finalTest.data.data.currentUser) {
    //     console.log(finalTest.data.data.signIn.currentUser);
    // }
    
    
}

fetchTest();