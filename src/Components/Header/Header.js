import React, { Component } from "react";
import "./Header.css";

class Menu extends Component {
  toggleMenu = () => {
    const menu = document.querySelector("aside");
    menu.classList.toggle("toggle");
  };

  render() {
    return (
      <header>
        <span className="toggle-menu fas fa-bars" onClick={this.toggleMenu} />
        <h1 className="main-header" 
        role="navigation" label="header">Salisbury Neighborhood Eats</h1>
        <div className="food-list" 
        role="contentinfo"
        aria-label="food-places" >
          <ul className="static-list">
            <li>Cook-Out Burgers</li>
            <li>Sushi de Kanpai</li>
            <li>Evolution Craft Brewing Co. Public House</li>
            <li>Specific Gravity Pizzeria & Beer Joint</li>
            <li>Bagel Bakery Café</li>
          </ul>
        </div>
      </header>
    );
  }
}

export default Menu;