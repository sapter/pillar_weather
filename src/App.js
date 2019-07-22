import React, { Component } from "react";
import {
  Header,
  Form,
  Divider,
  Card,
  Image,
  List,
  Icon,
  Message,
} from "semantic-ui-react";

import "./App.css";
import { async } from "q";

class App extends Component {
  state = {
    searchType: "Current Location",
    lat: "",
    lon: "",
    city: "",
    validCity: true,
    condition: "",
    temp: null,
    pressure: null,
    humidity: null,
    icon: "",
    tempCity: "",
  };

  async componentDidMount() {
    await this.setPosition();
    await this.setWeather(this.state.lat, this.state.lon);
  }

  searchOptionChangeHandler = (e, { value }) => {
    this.setState({ searchType: value });
  };

  cityInputChangeHandler = e => {
    this.setState({ tempCity: e.target.value });
  };

  latInputChangeHandler = e => {
    this.setState({ lat: e.target.value });
  };

  lonInputChangeHandler = e => {
    this.setState({ lon: e.target.value });
  };

  cityButtonClickHandler = async () => {
    this.setState({
      city: this.state.tempCity,
    });
    await this.setWeather();
  };

  coordinatesButtonClickHandler = async () => {
    const { lat, lon } = this.state;
    await this.setWeather(lat, lon);
  };

  getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        err => reject(err),
      );
    });
  };

  setPosition = async () => {
    const position = await this.getPosition();
    console.log(position.coords);
    const { longitude, latitude } = position.coords;
    this.setState({
      lon: longitude,
      lat: latitude,
    });
  };

  fetchWeather = (lat, lon) => {
    const { searchType, city } = this.state;
    let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&APPID=7035ab5008fa909641b7b9e36f9c58de`;
    if (searchType[1] === "i") {
      url = `http://api.openweathermap.org/data/2.5/weather?q=${city},us&units=imperial&APPID=7035ab5008fa909641b7b9e36f9c58de`;
    }
    console.log(url);
    return new Promise((resolve, reject) => {
      const json = fetch(url)
        .then(response => response.json())
        .then(data => data);
      if (json) {
        resolve(json);
      } else {
        reject(Error("there was an error"));
      }
    });
  };

  setWeather = async (lat, lon) => {
    const weather = await this.fetchWeather(lat, lon);
    if (weather.cod === 200) {
      const { name: city } = weather;
      const { temp, pressure, humidity } = weather.main;
      const { main: condition, icon } = weather.weather[0];
      this.setState({
        validCity: true,
        city,
        condition,
        temp,
        pressure,
        humidity,
        icon,
      });
    } else if (weather.cod === "404") {
      this.setState({
        validCity: false,
      });
    }
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

    const { searchType, temp, validCity } = this.state;
    console.log("[App.js] render", validCity, searchType);
    let formFields = null;
    if (searchType[1] === "i") {
      formFields = (
        <div>
          <Form onSubmit={this.cityButtonClickHandler} error>
            <Form.Input
              fluid
              label="City name"
              placeholder="Enter City name"
              onChange={this.cityInputChangeHandler}
            />
            {validCity ? null : (
              <Message
                error
                header="Invalid City"
                content="Please enter a valid US city"
              />
            )}
            <Divider />
            <Form.Button
              inverted
              color="linkedin"
              fluid
              onClick={this.cityButtonClickHandler}
            >
              Let's Go
            </Form.Button>
          </Form>
        </div>
      );
    } else if (searchType[0] === "L") {
      formFields = null;
      formFields = (
        <div>
          <Form>
            <Form.Input
              fluid
              label="Lattitude"
              placeholder="0 °"
              onChange={this.latInputChangeHandler}
            />
            <Form.Input
              fluid
              label="Longitude"
              placeholder="0 °"
              onChange={this.lonInputChangeHandler}
            />
            <Form.Button
              inverted
              color="linkedin"
              fluid
              onClick={this.coordinatesButtonClickHandler}
            >
              Let's Go
            </Form.Button>
          </Form>
        </div>
      );
    }
    let weatherCard = null;
    if (temp && validCity) {
      // const { main: weatherStatus, icon } = this.state.weatherData.weather[0];
      // const { main } = this.state.weatherData;
      const { city, condition, temp, pressure, humidity, icon } = this.state;
      const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      weatherCard = (
        <Card centered>
          <Card.Content>
            <Image floated="right" size="mini" src={iconURL} />
            <Card.Header>{city}</Card.Header>
            <Card.Meta>{condition}</Card.Meta>
            <Card.Description>
              <List divided verticalAlign="middle">
                <List.Item>
                  <List.Content>
                    <List.Header>{`Temperature:  ${temp} °F `}</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>{`Humidity:  ${humidity} g/M3 `}</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>{`Pressure:  ${pressure} psi `}</List.Header>
                  </List.Content>
                </List.Item>
              </List>
            </Card.Description>
          </Card.Content>
        </Card>
      );
    }

    return (
      <div className="App">
        <Header color="violet" as="h2" icon textAlign="center">
          <Icon name="tree" circular />
          <Header.Content>Weather App</Header.Content>
        </Header>
        <Form>
          <Form.Select
            fluid
            label="Search by"
            options={options}
            placeholder="Search by"
            onChange={this.searchOptionChangeHandler}
          />
        </Form>
        {formFields}
        <Divider />
        {weatherCard}
        <Divider />
      </div>
    );
  }
}

export default App;
