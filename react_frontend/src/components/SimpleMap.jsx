import React from "react";
import GoogleMapReact from 'google-map-react';
const AnyReactComponent = ({ text }) => <div>{text}</div>;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faPersonWalking } from '@fortawesome/free-solid-svg-icons'

export default function SimpleMap(){
  const defaultProps = {
    center: {
      lat: 41.879769,
      lng:  -87.630331
    },
    zoom: 14
  };

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '95vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_API_KEY }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        
      >
        <AnyReactComponent
          lat={59.955413}
          lng={30.337844}
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
  );
}
