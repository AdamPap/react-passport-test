import React, { useState } from 'react'
import axios from 'axios'

function App() {
  const [registerUsername, setRegisterUsername] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginUsername, setLoginUsername] = useState('')
  const [user, setUser] = useState(null)

  const register = async () => {
    const res = await axios({
      method: 'POST',
      data: {
        username: registerUsername,
        password: registerPassword
      },
      withCredentials: true,
      url: "http://localhost:3001/register"
    })
    console.log(res)
  }

  const login = async () => {
    const res = await axios({
      method: 'POST',
      data: {
        username: loginUsername,
        password: loginPassword
      },
      withCredentials: true,
      url: "http://localhost:3001/login"
    })
    console.log(res)
  }

  const getUser = async () => {
    const res = await axios({
      method: 'GET',
      withCredentials: true,
      url: "http://localhost:3001/user"
    })
    console.log(res.data)
    setUser(res.data)
  }

  return (
    <div className="App">
      <div>
        <h1>Register</h1>
        <form onSubmit={register}>
          <input type="text" placeholder="username" onChange={evt => setRegisterUsername(evt.target.value)} />
          <input type="text" placeholder="password" onChange={evt => setRegisterPassword(evt.target.value)} />
          <button type="submit">Register</button>
        </form>
      </div>
      <div>
        <h1>Login</h1>
        <form onSubmit={login}>
          <input type="text" placeholder="username" onChange={evt => setLoginUsername(evt.target.value)} />
          <input type="text" placeholder="password" onChange={evt => setLoginPassword(evt.target.value)} />
          <button type="submit">Login</button>
        </form>
      </div>
      <div>
        <h1>Get user</h1>
        <p>{user ? `${user.username}` : 'No user'}</p>
        <button onClick={getUser}>Get user</button>
      </div>
    </div>
  );
}

export default App;
