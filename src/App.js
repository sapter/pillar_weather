import React, { Component } from "react";
import { Header, Form, Button, Divider } from "semantic-ui-react";
// import axios from "axios";
// import { geolocated } from "react-geolocated";

import "./App.css";

class App extends Component {
  state = {
    searchType: "Current Location",
    lat: "",
    lon: "",
    city: "",
    weatherData: {},
  };

  componentDidMount() {
    this.getPosition();
    setTimeout(() => {
      this.fetchWeather(this.state.lat, this.state.lon);
    }, 200);
  }

  handleSearchOptionChange = (e, { value }) => {
    this.setState({ searchType: value });
  };

  getPosition = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      this.setState({ lat: latitude, lon: longitude });
      console.dir(this.state);
    });
  };

  fetchWeather = (lat, lon) => {
    const { searchType, city } = this.state;
    let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=7035ab5008fa909641b7b9e36f9c58de`;
    if (searchType[1] === "i") {
      url = `http://api.openweathermap.org/data/2.5/weather?q=${city},us&units=imperial&APPID=7035ab5008fa909641b7b9e36f9c58de`;
    }
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({ weatherData: data });
        console.dir(this.state);
      });
  };

  render() {
    const options = [
      { key: "a", text: "Current Location", value: "Current Location" },
      { key: "c", text: "City", value: "City" },
      {
        key: "l",
        text: "Longitude and Latitude",
        value: "Longitude and Latitude",
      },
    ];

    const { searchType } = this.state;
    let formFields = null;
    if (searchType[1] === "i") {
      formFields = (
        <Form>
          <Form.Input fluid label="City name" placeholder="Enter City name" />
        </Form>
      );
    } else if (searchType[0] === "L") {
      formFields = (
        <Form>
          <Form.Input fluid label="Lattitude" placeholder="0 °" />
          <Form.Input fluid label="Longitude" placeholder="0 °" />
        </Form>
      );
    }

    return (
      <div className="App">
        <Header as="h2" textAlign="center">
          Weather App
        </Header>
        <Form>
          <Form.Select
            fluid
            label="Search by"
            options={options}
            placeholder="Search by"
            onChange={this.handleSearchOptionChange}
          />
        </Form>
        {formFields}
        <Divider />
        <Button
          inverted
          color="linkedin"
          fluid
          onClick={() => console.log(this.state)}
        >
          Let's Go
        </Button>
        <Divider />
        <Button inverted color="twitter" fluid onClick={this.fetchWeather}>
          Fetch
        </Button>
        <Divider />
        <Button inverted color="google plus" fluid onClick={this.getPosition}>
          Get Position
        </Button>
      </div>
    );
  }
}

// clsss App extends Component {
//   state = {};

//   const options = [
//     { key: "c", text: "City", value: "city" },
//     { key: "l", text: "Longitude and Latitude", value: "longitude and latitude" },
//   ];
//   render() {

//     return (
//       <div className="App">
//         <Header as="h2" textAlign="center">
//           Weather App
//         </Header>
//         <Form>
//           <Form.Select
//             fluid
//             label="Search by"
//             options={options}
//             placeholder="Search by"
//           />
//         </Form>
//       </div>
//     );
//   }
// }

export default App;
