import React from "react";
import Card from 'react-bootstrap/Card'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faPersonWalking } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

export default function MapCard(props) {
  const [placeCoords, setPlaceCoords] = useState({});
  //just a single object now, needs to be a list of objects later
  const [stationCoords, setStationCoords] = useState({});
  const [countdown, setCountdown] = useState('Click for next ETA');
  const [lastETA, setLastETA] = useState(0)
  const [walkTime, setWalkTime] = useState(0);
  const [isWalkTimeSet, setIsWalkTimeSet] = useState(false);
  //const [stationsList, setStationsList] = useState({});
  //const [place, setPlace] = useState('');
  
  // query train data api every 5s, check if newArrivalObj changed
  // if eta from API is more than 15s over or under, adjust ETA countdown by difference
  // then, continue 1s countdown as usual

  const updateArrival = async() => {
    updateStations();
    const response = await axios.get('/get_train_data')
    console.log('train data:', response.data)
    let newArrival = response.data.ctatt.eta[2].arrT;
    console.log(newArrival);
    console.log('updating arrival:', newArrival)
    let now = new Date(Date.now())
    let newArrivalObj = new Date(newArrival);
    console.log('ETA (sec): ', (newArrivalObj - now)/1000) 
    let countdown = Math.floor((newArrivalObj - now)/1000);
    setLastETA(countdown);
    //todo: compare last eta against new eta for time difference

    //begin or continue countingdown eta
    setInterval(function(){
      setCountdown(countdown--);
      if(isWalkTimeSet) {
        if(countdown === (walkTime + 120)) {
          console.log('HEAD OUT!');
        }
      }
    }, 1000);
  }


  //migiht have to use a useEffect hook that synchronizes countdown timer to
  //changing state of newArrivalObj - now

  const updatePlace = async() => {
    console.log('print from mapComponent')

    let input_address = document.getElementById('input_address').value;
    try {
      await axios.get('/get_place', { params : { query: input_address  }})
      .then((response) => {
        let placeCoords = { lat: String(response.data.results[0].geometry.location.lat), lng : String(response.data.results[0].geometry.location.lng) }
        setPlaceCoords(placeCoords);
        console.log('placeCoords', placeCoords)
      })
    } catch {
      console.log('error getting place')
    }         
  }
  
const updateStations = async() => {
  try{
    await axios.get('/get_stations').then((response) => {
        console.log('got stations:', response.data);
        console.log('station: ', {lat: response.data[26].location.latitude, lng: response.data[26].location.longitude})
      //setStationsList({lat: response.data[26].location.latitude, lng: response.data[26].location.longitude});
        setStationCoords({lat: response.data[26].location.latitude, lng: response.data[26].location.longitude});
     })
  } catch {
    console.log('error getting stations');
  }
}
  const calculateWalk = async(originCoords, destinationCoords) => {
    console.log('place: ', originCoords);
    console.log('station: ', destinationCoords);
    axios.get('/calculate_walk', { params: { originCoords: originCoords, destinationCoords: destinationCoords } })
    .then((response) => {
      let walkTime = response.data.routes[0].legs[0].duration.value;
      setWalkTime(walkTime);
      setIsWalkTimeSet(true);
      //console.log('Google walk time (sec):', response.data.routes[0].legs[0].duration.value)
    })
  }

  //set to true, if walktime and eta equal useRef to set it back to false
  //  useEffect(() => {
  //    console.log('eta inside useEffect', countdown);
  //
  //      setInterval(() => {
  //        //console.log('eta (from calcWalk()):', countdown);
  //        //console.log('walk time (from calculateWalk):', walkTime);
  //        if(countdown === (walkTime + 60)) {
  //          console.log('HEAD OUT!');
  //        }
  //      }, 5000);
  //  }, [walkTime, countdown])

  console.log('Nhung walk time', walkTime)
  // use stations api
  // save fav place to db
  // update place results below
  // UI: add svgs to search boxes
  // UI: black border on focus, 
  return(
  <div className="card-container container" style={{width: '25rem'}}>
      <Card id="data-harvester" bg="white">
        <Card.Body>
          <h1>What is your departure location ?</h1>
          <div>
            <input id='input_address' value='125 S Clark St' placeholder="Search Your Location"></input>
            <button onClick={ updatePlace }>
              click for place
            </button>
          </div>
          <div>
            <button onClick={ updateArrival } > 
              ETA: {countdown} 
            </button>
          </div>
          <div>
            <p>Calculate Walk Time</p>
            <button onClick={ () => calculateWalk(placeCoords, stationCoords) }>
              calculate walk time
            </button>
          </div>
          <hr />
          {  }
        </Card.Body>
      </Card>
    {/*
    <div className="row d-flex">
      <div className="col-md-12">
        <div className="card map-card" style={{ width: '100%' }}>
          <div className={`card-body`}>
            <div className="button px-2 mt-3">
              <a className="btn-floating btn-lg living-coral float-right">
                <FontAwesomeIcon icon={faPersonWalking} size="xl" ></FontAwesomeIcon>
              </a>
            </div>
            <div className="bg-white px-4 pb-4 pt-3-5">
              <h5 className="card-title h5 living-coral-text">Central Park Zoo</h5>
              <div className="d-flex justify-content-between living-coral-text">
                <h6 className="card-subtitle font-weight-light">A place to relax</h6>
                <FontAwesomeIcon icon={faCoffee} />
                <h6 className="font-small font-weight-light mt-n1">25 min</h6>
              </div>
              <hr />
              <div className="d-flex justify-content-between pt-2 mt-1 text-center text-uppercase living-coral-text">
                <div>
                  <FontAwesomeIcon icon={faCoffee} size="lg" />
                  <i className="fas fa-phone fa-lg mb-3"></i>
                  <p className="mb-0">Call</p>
                </div>
                <div>
                  <i className="fas fa-cat fa-lg mb-3"></i>
                  <p className="mb-0">Love</p>
                </div>
                <div>
                  <i className="far fa-grin-beam-sweat fa-lg mb-3"></i>
                  <p className="mb-0">Smile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    */}
  </div> 
  )
}
