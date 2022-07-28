import { useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL + 'api'

console.log(`Vite API URL: ${API_URL}`)


function App() {
  const [email, setEmail] = useState('')
  return (
    <div className="App">
      <article className='main-content'>
        <h1>Vite + React (similar to create-react-app)</h1>
        <p>
          Focus on how the AuthenticWallet API works for SPA applications. The SPA application needs a supporting backend to use the API.
        </p>
        <p>
          The methods that the needed backend uses for protecting itself against spam or other attacks are for the integrator to decide. At authentic we suggest using CSRFTokens + checking domain names and HTTPS connection.
        </p>
        <p>
          Although the AuthenticWallet API can be used on an SPA application, it is not recommended. The API was designed with an SSR application in mind. Still, we are working to provide better support for SPAs and ways to mitigate unwanted mintings.
        </p>
      </article>
      <div className="card">
        <form action={`${API_URL}/i-want-nft`} method="GET">
          <fieldset>
            <label htmlFor="email-input">
              Email to mint NFT to
            </label>
            <input id="email-input" name="customer_email" value={email} onChange={(e) => {
              setEmail(e.target.value)
            }} />
            <button>
              Redeem NFT
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  )
}

export default App
