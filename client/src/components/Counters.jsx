import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import add from "../images/add.svg";
import remove from "../images/remove.svg";

class Counters extends Component {
  state = {
    counters: [],
    newCounterModal: false,
    newCounterError: ""
  };

  handleError = (location, error) => {
    if (location === "newCounter") {
      this.setState({ newCounterError: error });
    }
  };

  componentDidUpdate = ({ counters }) => {
    if (counters !== this.props.counters) {
      this.setState({ counters: this.props.counters });
    }
  };

  handleAddCounter = () => {
    if (document.getElementById("newCounterName").value === "") {
      return this.handleError("newCounter", "The name field is required.");
    }
    let names = this.state.counters.map(counter => {
      return counter.toLowerCase();
    });
    if (
      names.includes(
        document.getElementById("newCounterName").value.toLowerCase()
      )
    ) {
      return this.handleError(
        "newCounter",
        "There is already a counter with this name."
      );
    }
    this.handleError("newCounter", "");
    this.props.onAddCounter(document.getElementById("newCounterName").value);
    this.toggleNewCounterModal();
  };

  handleRemoveCounters = () => {
    let checkboxes = document.getElementsByClassName("counterCheckbox");
    let countersToRemove = [];
    for (var checkbox in checkboxes) {
      if (checkboxes[checkbox].checked === true) {
        countersToRemove.push(checkboxes[checkbox].parentNode.id);
      }
    }
    if (
      countersToRemove.length !== 0 &&
      window.confirm(
        `Are you sure you want to remove ${countersToRemove.length} counters?`
      )
    ) {
      this.props.onRemoveCounters(countersToRemove);
    }
  };

  toggleNewCounterModal = () => {
    this.setState({ newCounterModal: !this.state.newCounterModal });
  };

  render() {
    return (
      <div className="content">
        <div className="searchBarRight">
          <button
            className="iconBtn"
            id="addCounter"
            title="Add new counter..."
            onClick={this.toggleNewCounterModal}
          >
            <img src={add} alt="add counter icon"></img>
          </button>
          <button
            className="iconBtn"
            id="removeCounters"
            title="Remove selected counters..."
            onClick={this.handleRemoveCounters}
          >
            <img src={remove} alt="remove counters icon"></img>
          </button>
        </div>
        <div className="partList">
          {this.state.counters.map((counter, i) => {
            return (
              <div key={counter} id={counter} className="part">
                <input
                  type="checkbox"
                  name="selected"
                  className="counterCheckbox shortField"
                ></input>
                <div
                  className="partField"
                  style={{ justifyContent: "flex-start" }}
                >
                  <h6 style={{ margin: 0 }}>{counter}</h6>
                </div>
              </div>
            );
          })}
        </div>
        <Modal
          isOpen={this.state.newCounterModal}
          toggle={this.toggleNewCounterModal}
        >
          <ModalHeader toggle={this.toggleNewCounterModal}>
            Add Counter
          </ModalHeader>
          <ModalBody>
            <div className="form">
              <div className="form-field">
                <label htmlFor="newCounterName">Name:</label>
                <input
                  type="text"
                  name="newCounterName"
                  id="newCounterName"
                  placeholder="Name..."
                  className="ml-1 flex-grow-1"
                ></input>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <span id="newCounterError">{this.state.newCounterError}</span>
            <Button color="success" onClick={this.handleAddCounter}>
              Add Counter
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Counters;
