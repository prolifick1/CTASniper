import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import axios from 'axios';
import GoogleMapReact from 'google-map-react';
import SimpleMap from './components/SimpleMap';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import './map-card.css';
import Navbar from 'react-bootstrap/Navbar';
import ReactDOM from 'react-dom'
import MapCard from './components/MapCard'



const submitLoginForm = function(event){
  // this isn't actually necessary, since this isn't in a form. 
  // but if it WAS a form, we'd need to prevent default.
  event.preventDefault()
  axios.post('/login', {email: 'jeff@amazon.com', password:'dragons'}).then((response)=>{
    console.log('response from server: ', response)
    window.location.reload()
  })
}

const submitSignupForm = function(event){
  // this isn't actually necessary, since this isn't in a form. but if it WAS 
  // a form, we'd need to prevent default.
  event.preventDefault()
  axios.post('/signup', {email: 'jeff@amazon.com', password:'dragons'}).then((response)=>{
    console.log('response from server: ', response)
  })
}
const logOut = function(event){
  // this isn't actually necessary, since this isn't in a form. but if it WAS 
  // a form, we'd need to prevent default.
  event.preventDefault()
  axios.post('/logout').then((response)=>{
    console.log('response from server: ', response)
    whoAmI()
  })
}
const getCSRFToken = () => {
  let csrfToken
  // the browser's cookies for this page are all in one string, separated by semi-colons
  const cookies = document.cookie.split(';')
  for ( let cookie of cookies ) {
      // individual cookies have their key and value separated by an equal sign
      const crumbs = cookie.split('=')
      if ( crumbs[0].trim() === 'csrftoken') {
          csrfToken = crumbs[1]
      }
  }
  return csrfToken
}

console.log('token? ', getCSRFToken())
//every request should have an X-CSRFToken in headers by default
axios.defaults.headers.common['X-CSRFToken'] = getCSRFToken()


function App() {
  const [arrival, setArrival] = useState('Click for next arrival')
  const [place, setPlace] = useState('');
  //const [count, setCount] = useState(0);
  const [user, setUser ] = useState(null);
  const [stationsList, setStationsList] = useState([]);


  const whoAmI = async () => {
    const response = await axios.get('/whoami')
    const user = response.data && response.data[0] && response.data[0].fields
    // const user = response.data[0].fields
    console.log('user from whoami? ', user, response)
    setUser(user)
    //window.foo.bar.baz = 'error!'
  }

  useEffect(()=>{
    whoAmI()
  }, [])


  //query api every 10sec, if newArrivalObj changed, update

  //migiht have to use a useEffect hook that synchronizes countdown timer to
  //changing state of newArrivalObj - now

  {/*
  const calculateWalk = async(originCoords, destinationCoords) => {
    console.log('station: ', originCoords) 
    console.log('place: ', destinationCoords);

    axios.get('/calculate_walk', { params: { originCoords: originCoords, destinationCoords: destinationCoords } })
    .then((response) => {
      console.log(response)
      console.log('Google walk time (sec):', response.data.routes[0].legs[0].duration.value)
    })
  }
  */}

  return (
    <div className="App">
      { user ?
        <div id="wrapper">
          <BasicExample user={user}/> 
          <SimpleMap />
          <MapCard stationsList={stationsList}/>
          <div>
          </div>
        </div>
      :
        <div>
          <BasicExample /> 
        </div>
      }
    </div>
  )
}

function BasicExample({user}) {
  const whoAmI = async () => {
    const response = await axios.get('/whoami')
    const user = response.data && response.data[0] && response.data[0].fields
    // const user = response.data[0].fields
    console.log('user from whoami? ', user, response)
    setUser(user)
    //window.foo.bar.baz = 'error!'
  }

  useEffect(()=>{
    whoAmI()
  }, [])
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">CTASniper</Navbar.Brand>
        <Nav.Link className="ml-auto" href="#home">
          {user ?
            <div>
              <button onClick={logOut}>Log out</button>
            </div>
          :
            <div>
              <button onClick={submitSignupForm}>Sign Up</button>
              <button onClick={submitLoginForm}>Log in</button>
            </div>
          } 
        </Nav.Link>
      </Container>
    </Navbar>
  );
}


export default App
