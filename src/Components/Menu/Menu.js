import React, { Component } from "react";
import "./Menu.css";
import escapeRegExp from "escape-string-regexp";

class Menu extends Component {
  state = {
    query: "",
    places: this.props.places
  };

  updateQuery = query => {
    this.setState({ query });

    let allPlaces = this.props.places;
    let newPlaces;

    if (this.state.query && this.state.query !== "") {
      const match = new RegExp(escapeRegExp(query), "i");
      newPlaces = allPlaces.filter(place => match.test(place.venue.name));
      this.setState({ places: newPlaces });
      this.props.updatePlaces(newPlaces);
    } else {
      this.setState({ places: allPlaces });
    }
  };

  triggerMarkerClick = placeTitle => {
    this.props.markers.filter(marker => {
      if (marker.title === placeTitle) {
        window.google.maps.event.trigger(marker, "click");
      }
    });
    this.props.updatePlaces(this.props.places.filter(function (elem, i) {
      return elem.venue.name === placeTitle;
    }));
  };

  render() {
    return (
      <aside>
        <div className="search-form"
         role="search" 
         aria-label="search">
          <label htmlFor="searchQuery" />
          <input
            aria-label="form"
            id="searchQuery"
            type="text"
            placeholder="Search Places"
            onChange={e => this.updateQuery(e.target.value)}
            value={this.state.query}
          />
        </div>

        {this.state.places.length !== 0 && (
          <ul className="search-result" 
          role="contentinfo" 
          aria-label="search results">
            {this.state.places.map((place, index) => (
              <li
                key={index}
                tabIndex="0"
                className="item"
                onClick={() => this.triggerMarkerClick(place.venue.name)}
              >
                {place.venue.name}
              </li>
            ))}
          </ul>
        )}

        {this.state.places === 0 && (
          <ul className="search-result" 
          role="contentinfo" 
          aria-label="search results">
            <li className="item">Not Found..</li>
          </ul>
        )}
      </aside>
    );
  }
}

export default Menu
