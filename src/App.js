import React from "react";
import {
  Grid,
  Header,
  Image,
  Form,
  Segment,
  Dropdown,
} from "semantic-ui-react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Grid
        textAlign="center"
        verticalAlign="middle"
        style={{ height: "50vh" }}
      >
        <Grid.Column className="column">
          <Header as="h2" textAlign="center">
            Weather App
          </Header>
          <Form>
            <Form.Input fluid label="Search by" placeholder="Search by" />
          </Form>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default App;
