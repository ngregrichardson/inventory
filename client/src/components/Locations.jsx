import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import add from "../images/add.svg";
import remove from "../images/remove.svg";

class Locations extends Component {
  state = {
    locations: [],
    newLocationModal: false,
    newLocationError: ""
  };

  handleError = (location, error) => {
    if (location === "newLocation") {
      this.setState({ newLocationError: error });
    }
  };

  componentDidUpdate = ({ locations }) => {
    if (locations !== this.props.locations) {
      this.setState({ locations: this.props.locations });
    }
  };

  handleAddLocation = () => {
    if (document.getElementById("newLocationName").value === "") {
      return this.handleError("newLocation", "The name field is required.");
    }
    let names = this.state.locations.map(location => {
      return location.toLowerCase();
    });
    if (
      names.includes(
        document.getElementById("newLocationName").value.toLowerCase()
      )
    ) {
      return this.handleError(
        "newLocation",
        "There is already a location with this name."
      );
    }
    this.handleError("newLocation", "");
    this.props.onAddLocation(document.getElementById("newLocationName").value);
    this.toggleNewLocationModal();
  };

  handleRemoveLocations = () => {
    let checkboxes = document.getElementsByClassName("locationCheckbox");
    let locationsToRemove = [];
    for (var checkbox in checkboxes) {
      if (checkboxes[checkbox].checked === true) {
        locationsToRemove.push(checkboxes[checkbox].parentNode.id);
      }
    }
    if (
      locationsToRemove.length !== 0 &&
      window.confirm(
        `Are you sure you want to remove ${locationsToRemove.length} locations?`
      )
    ) {
      this.props.onRemoveLocations(locationsToRemove);
    }
  };

  toggleNewLocationModal = () => {
    this.setState({ newLocationModal: !this.state.newLocationModal });
  };

  render() {
    return (
      <div className="content">
        <div className="searchBarRight">
          <button
            className="iconBtn"
            id="addLocation"
            title="Add new location..."
            onClick={this.toggleNewLocationModal}
          >
            <img src={add} alt="add location icon"></img>
          </button>
          <button
            className="iconBtn"
            id="removeLocations"
            title="Remove selected locations..."
            onClick={this.handleRemoveLocations}
          >
            <img src={remove} alt="remove locations icon"></img>
          </button>
        </div>
        <div className="partList">
          {this.state.locations.map((location, i) => {
            return (
              <div key={location} id={location} className="part">
                <input
                  type="checkbox"
                  name="selected"
                  className="locationCheckbox shortField"
                ></input>
                <div
                  className="partField"
                  style={{ justifyContent: "flex-start" }}
                >
                  <h6 style={{ margin: 0 }}>{location}</h6>
                </div>
              </div>
            );
          })}
        </div>
        <Modal
          isOpen={this.state.newLocationModal}
          toggle={this.toggleNewLocationModal}
        >
          <ModalHeader toggle={this.toggleNewLocationModal}>
            Add Location
          </ModalHeader>
          <ModalBody>
            <div className="form">
              <div className="form-field">
                <label htmlFor="newLocationName">Name:</label>
                <input
                  type="text"
                  name="newLocationName"
                  id="newLocationName"
                  placeholder="Name..."
                  className="ml-1 flex-grow-1"
                ></input>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <span id="newLocationError">{this.state.newLocationError}</span>
            <Button color="success" onClick={this.handleAddLocation}>
              Add Location
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Locations;
