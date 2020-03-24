import React from 'react';
import { geolocated } from 'react-geolocated';

const Tracker = ({
  isGeolocationAvailable,
  isGeolocationEnabled,
  coords,
  setGeoLocationCoords,
  children
}) => {
  if (!isGeolocationAvailable) {
    return <div>Your browser does not support Geolocation</div>;
  }

  if (!isGeolocationEnabled) {
    return <div>Geolocation is not enabled</div>;
  }

  if (!coords) {
    return <div>Waiting for coordinates...</div>;
  }

  // return (
  //   <div>{this.props.children(coords)}</div>
  // )
  console.log(coords);
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>latitude</td>
            <td>{coords.latitude}</td>
          </tr>
          <tr>
            <td>longitude</td>
            <td>{coords.longitude}</td>
          </tr>
          <tr>
            <td>altitude</td>
            <td>{coords.altitude}</td>
          </tr>
          <tr>
            <td>heading</td>
            <td>{coords.heading}</td>
          </tr>
          <tr>
            <td>speed</td>
            <td>{coords.speed}</td>
          </tr>
        </tbody>
      </table>

      <button onClick={() => setGeoLocationCoords(coords)}>Save Params</button>
    </div>
  );
};

export default GeoLocationTracker = geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(Tracker);

/* AVAILABLE OPTIONS!
  {
    positionOptions: {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: Infinity,
    },
    watchPosition: false,
    userDecisionTimeout: null,
    suppressLocationOnMount: false,
    geolocationProvider: navigator.geolocation,
    isOptimisticGeolocationEnabled: true
  }
*/
