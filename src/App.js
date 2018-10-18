import React, { Component } from "react";
import "./App.css";
import Header from "./Components/Header/Header";
import Menu from "./Components/Menu/Menu";
import Map from "./Components/Map/Map";
import axios from "axios";
import config from "./config"

const googleMapsApiKey = config.GOOGLE_MAPS_KEY;
const foursquareClientId = config.FOURSQUARE_ID;
const foursquareSecretId = config.SECRET_ID;

class App extends Component {
  state = {
    allPlaces: [],
    places: [],
    markers: [],
    latLong: "38.3606736, -75.5993692"
  };

  gm_authFailure() {
    window.alert("Google Maps API failed to load data!")
  }

  componentDidMount() {
    this.getPlaces("restaurants", "salisbury");
    window.gm_authFailure = this.gm_authFailure;
  }

  loadMap = () => {
    loadJS(
      `${googleMapsApiKey}`
    );
    window.initMap = this.initMap;
  };

  getPlaces = (query, location) => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const params = {
      client_id: `${foursquareClientId}`,
      client_secret: `${foursquareSecretId}`,
      query: "food",
      near: "Salisbury, MD",
      limit: "5",
      v: "20180809"
    };

    // Fetches the Data
    axios.get(endPoint + new URLSearchParams(params))
      // Handle the error
      .then(response => {
        try {
          this.setState({
              allPlaces: response.data.response.groups[0].items,
              places: response.data.response.groups[0].items
            },
            this.loadMap
          )
        } catch (err) {
          console.log(err);
        }
      })
      .catch(error => {
        window.alert("Foursquare API failed to load data!", error);
        document.querySelector('#searchQuery').setAttribute('disabled', true);
      });
  };

  // Creates and Initializes Map
  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: {
        lat: 38.3606736,
        lng: -75.5993692
      },
      zoom: 14
    });

    // Defines the info window
    let infoWindow = new window.google.maps.InfoWindow();

    this.state.places.map(place => {

      // Creates the location markers
      let marker = new window.google.maps.Marker({
        position: {
          lat: place.venue.location.lat,
          lng: place.venue.location.lng
        },
        map: map,
        title: place.venue.name,
        icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
      });

      // Adds the markers to the array
      this.state.markers.push(marker);

      // Creates the content to be displayed in the info window
      let content = `
                            <h3>${place.venue.name}</h3>
                            <p>Address: ${
                              place.venue.location.formattedAddress[0]
                            } ${place.venue.location.formattedAddress[1]} ${
        place.venue.location.formattedAddress[2]
      }</p>`;

      // Opens the info window upon marker click
      marker.addListener("click", function () {
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
        if (marker.getAnimation() === true) {
          marker.setAnimation(null);
        } else {

          // Sets animation upon marker click
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(function () {
            marker.setAnimation(null)
          }, 1000);
        }
      });
    });
  };

  // Updates the locations 
  updatePlaces = newPlaces => {
    this.setState({
      places: newPlaces
    });
    this.initMap();
  };

  render() {
    return (
      <div>
        <Header />
        <main>
          <Menu
            places={this.state.allPlaces}
            markers={this.state.markers}
            updatePlaces={this.updatePlaces}
          />
          <Map />
        </main>
      </div>
    );
  }
}

function loadJS(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);
  script.onerror = function () {
    window.alert("Google Maps API failed to load data!");
  }
}

export default App;