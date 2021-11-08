import { useState } from 'react'
import styles from '../styles/Home.module.css'
import Web3 from 'web3'
import Web3Token from 'web3-token'
import Cookie from 'js-cookie'
import { Client, Lambda, Map, Paginate, Documents, Collection, Get } from 'faunadb'


export default function Home() {

  const [isLoggedin, setLoggedin] = useState(false)

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

    const { token } = await response.json();
    const one_hour = new Date(new Date().getTime() + 3600 * 1000)
    Cookie.set('fauna-auth', token, { expires: one_hour })
    setLoggedin(true);

  }

  const queryMovies = async () => {
    const authToken = Cookie.get('fauna-auth')
    const faunaClient = await new Client({ secret: authToken })
    const movies = await faunaClient.query(
      Map(
        Paginate(Documents(Collection('Movie'))),
        Lambda(x => Get(x))
      )
    )

    console.log('movies', movies)
  }

  return (
    <div className={styles.container}>
      { isLoggedin ? (
        <button onClick={queryMovies}>Query Movies</button>
      ) : 
      <button onClick={login}>Login with Metamask</button>
      }
    </div>
  )
}
