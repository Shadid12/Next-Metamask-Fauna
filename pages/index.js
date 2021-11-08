import styles from '../styles/Home.module.css'
import Web3 from 'web3'
import Web3Token from 'web3-token'


export default function Home() {
  const login = async () => {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const address = (await web3.eth.getAccounts())[0];
    console.log('--->', address);
    const signed_msg = await Web3Token.sign(msg => web3.eth.personal.sign(msg, address), '1h');
    const response = await fetch('api/user', {
      method: 'POST',
      body: JSON.stringify({
        signed_msg
      })
    })

  }
  return (
    <div className={styles.container}>
      <button onClick={login}>Login with Metamask</button>
    </div>
  )
}
