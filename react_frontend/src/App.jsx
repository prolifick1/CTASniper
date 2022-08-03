import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import axios from 'axios'

function App() {

function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }
  const csrftoken = getCookie('csrftoken');
  axios.defaults.headers.common['X-CSRFToken'] = csrftoken
  
  const [count, setCount] = useState(0);
  const [user, setUser ] = useState(null);

  const submitSignupForm = function(e) {
    e.preventDefault();
    axios.post('/signup', { email: "jeff@amazon.com", password: "dragons"})
      .then((response) => {
        console.log(`response for POST /signup ${response}`);
      })
  }
  
  const submitLoginForm = function(event) {
    event.preventDefault();
    axios.post('/login', { email: 'jeff@amazon.com', password: 'dragons' })
      .then((response) => {
        console.log(`response for POST /login ${response}`);
        window.location.reload();
      });
  }

  const submitLogoutForm = function(e) {
    event.preventDefault();
    axios.post('/logout')
      .then((response) => {
        console.log(`response for POST /delete ${response}`);
        whoAmI();
      });
  }

  const whoAmI = async () => {
    const response = await axios.get('/whoami');
    const user = response.data && response.data[0].fields;
    setUser(user);
  }

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <button onClick={submitSignupForm}>Sign Up</button>
      <button onClick={submitLoginForm}>Log in</button>
      <button onClick={submitLogoutForm}>Log out</button>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
