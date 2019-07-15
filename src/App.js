import React, { Component } from "react";
import {
  Header,
  Form,
  Button,
  Divider,
  Card,
  Image,
  List,
  Icon,
} from "semantic-ui-react";

import "./App.css";

class App extends Component {
  state = {
    searchType: "Current Location",
    lat: "",
    lon: "",
    city: "",
    weatherData: {},
    tempCity: "",
  };

  componentDidMount() {
    this.getPosition();
    setTimeout(() => {
      this.fetchWeather(this.state.lat, this.state.lon);
    }, 200);
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

  cityButtonClickHandler = () => {
    setTimeout(() => {
      this.setState({ city: this.state.tempCity });
    }, 100);
    setTimeout(() => {
      this.fetchWeather();
    }, 200);
  };

  coordinatesButtonClickHandler = () => {
    const { lat, lon } = this.state;
    setTimeout(() => {
      this.fetchWeather(lat, lon);
    }, 5000);
  };

  getPosition = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      this.setState({ lat: latitude, lon: longitude });
    });
  };

  fetchWeather = (lat, lon) => {
    const { searchType, city } = this.state;
    let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&APPID=7035ab5008fa909641b7b9e36f9c58de`;
    if (searchType[1] === "i") {
      url = `http://api.openweathermap.org/data/2.5/weather?q=${city},us&units=imperial&APPID=7035ab5008fa909641b7b9e36f9c58de`;
    }
    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({ weatherData: data });
      });
    setTimeout(() => {
      this.setState({ city: this.state.weatherData.name });
    }, 200);
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

    const { searchType, city } = this.state;
    let formFields = null;
    if (searchType[1] === "i") {
      formFields = (
        <div>
          <Form>
            <Form.Input
              fluid
              label="City name"
              placeholder="Enter City name"
              onChange={this.cityInputChangeHandler}
            />
          </Form>
          <Divider />
          <Button
            inverted
            color="linkedin"
            fluid
            onClick={this.cityButtonClickHandler}
          >
            Let's Go
          </Button>
        </div>
      );
    } else if (searchType[0] === "L") {
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
          </Form>
          <Button
            inverted
            color="linkedin"
            fluid
            onClick={this.coordinatesButtonClickHandler}
          >
            Let's Go
          </Button>
        </div>
      );
    }

    let weatherCard = null;
    if (city.length) {
      const { main: weatherStatus, icon } = this.state.weatherData.weather[0];
      const { main } = this.state.weatherData;
      const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      weatherCard = (
        <Card centered>
          <Card.Content>
            <Image floated="right" size="mini" src={iconURL} />
            <Card.Header>{city}</Card.Header>
            <Card.Meta>{weatherStatus}</Card.Meta>
            <Card.Description>
              <List divided verticalAlign="middle">
                <List.Item>
                  <List.Content>
                    <List.Header>{`Temperature:  ${
                      main.temp
                    } °F `}</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>{`Humidity:  ${
                      main.humidity
                    } g/M3 `}</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header>{`Pressure:  ${
                      main.pressure
                    } psi `}</List.Header>
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
