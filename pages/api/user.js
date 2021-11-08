import Web3Token from 'web3-token'
import { Client, Collection, Create, Get, Match, TimeAdd, Tokens, Index, Ref, Now } from 'faunadb'

const serverClient = new Client({ secret: process.env.FAUNA_SECRECT})

export default async function handler(req, res) {
    const {signed_msg} = JSON.parse(req.body);
    const { address, body } = await Web3Token.verify(signed_msg);

    try {
        // find a user in db with public address
        const user = await serverClient.query(
            Get(
                Match(Index('user_by_public_address'), address)
            )
        )
        // create a new token
        const accessToken = await createAccessToken(user.ref.id, 3600)
        res.status(200).json({ token: accessToken.secret })
    } catch (error) {
        console.log('--->', error)
        // register a new user with the public address
        if(error.name === 'NotFound') {
            const newUser = await registerNewUser(address)
            const accessToken = await createAccessToken(newUser.ref.id, 3600)
            res.status(200).json({ token: accessToken.secret })
        }
    }
}


const registerNewUser = public_address => {
    return serverClient.query(
        Create(
            Collection('User'),
            { data: { public_address } }
        )
    )
}

const createAccessToken = (ref, ttl) => {
    return serverClient.query(
        Create(
            Tokens(), {
                instance: Ref(Collection('User'), ref),
                data: {
                    type: 'access'
                },
                ttl: TimeAdd(Now(), ttl, "seconds")
            }
        )
    )
}