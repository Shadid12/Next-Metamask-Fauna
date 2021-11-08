import Web3Token from 'web3-token'

export default async function handler(req, res) {
    const {signed_msg} = JSON.parse(req.body);
    const { address, body } = await Web3Token.verify(signed_msg);
    res.status(200).json({ token: 'some-token' })
}