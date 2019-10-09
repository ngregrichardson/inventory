import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge
} from "reactstrap";
import add from "../images/add.svg";
import remove from "../images/remove.svg";
import search from "../images/search.svg";
import form from "../images/form.svg";

class Inventory extends Component {
  state = {
    locations: this.props.locations,
    counters: this.props.counters,
    parts: this.props.parts,
    term: "",
    newPartModal: false,
    newPartError: ""
  };

  handleError = (location, error) => {
    if (location === "newPart") {
      this.setState({ newPartError: error });
    }
  };

  componentWillReceiveProps = ({ locations, counters, parts }) => {
    if (JSON.stringify(locations) !== JSON.stringify(this.state.locations)) {
      this.setState({ locations });
    }
    if (JSON.stringify(counters) !== JSON.stringify(this.state.counters)) {
      this.setState({ counters });
    }
    if (JSON.stringify(parts) !== JSON.stringify(this.state.parts)) {
      this.setState({ parts });
    }
  };

  handleAddPart = () => {
    if (document.getElementById("newPartName").value === "") {
      return this.handleError("newPart", "The name field is required.");
    }
    if (isNaN(parseInt(document.getElementById("newPartAmount").value))) {
      return this.handleError("newPart", "The amount field is required.");
    }
    let names = this.state.parts.map(part => {
      return part.name.toLowerCase();
    });
    if (
      names.includes(document.getElementById("newPartName").value.toLowerCase())
    ) {
      return this.handleError(
        "newPart",
        "There is already a part with this name."
      );
    }
    let today = new Date();
    let dd =
      today.getDate() < 10 ? `0${today.getDate()}` : `${today.getDate()}`;
    let mm = today.getMonth() + 1;
    mm = mm < 10 ? `0${mm}` : mm;
    let yyyy = today.getFullYear();
    let date = `${yyyy}-${mm}-${dd}`;
    let newPart = {
      name: document.getElementById("newPartName").value,
      location: document.getElementById("newPartLocation").value,
      amount: parseInt(document.getElementById("newPartAmount").value),
      avaliableAmount: parseInt(document.getElementById("newPartAmount").value),
      counter: document.getElementById("newPartCounter").value,
      dateCounted: date,
      link: document.getElementById("newPartLink").value
    };
    this.handleError("newPart", "");
    this.props.onAddPart(newPart);
    this.toggleNewPartModal();
  };

  handleRemoveParts = () => {
    let checkboxes = document.getElementsByClassName("partCheckbox");
    let partsToRemove = [];
    for (var checkbox in checkboxes) {
      if (checkboxes[checkbox].checked === true) {
        partsToRemove.push(checkboxes[checkbox].parentNode.parentNode.id);
      }
    }
    if (
      partsToRemove.length !== 0 &&
      window.confirm(
        `Are you sure you want to remove ${partsToRemove.length} parts?`
      )
    ) {
      this.props.onRemovePart(partsToRemove);
    }
  };

  toggleNewPartModal = () => {
    this.setState({ newPartModal: !this.state.newPartModal });
  };

  handleSave = (id, field) => {
    this.props.onSave(
      id,
      field,
      document.getElementById(`${id}_${field}`).firstChild.value
    );
  };

  handleSearch = () => {
    this.setState({ term: document.getElementById("invSearch").value });
  };

  render() {
    return (
      <div className="content">
        <div className="searchBarRight">
          <button
            className="iconBtn"
            id="addPart"
            title="Add new part..."
            onClick={this.toggleNewPartModal}
          >
            <img src={add} alt="add part icon"></img>
          </button>
          <button
            className="iconBtn"
            id="removeParts"
            title="Remove selected parts..."
            onClick={this.handleRemoveParts}
          >
            <img src={remove} alt="remove parts icon"></img>
          </button>
          <div className="spacer"></div>
          <img
            src={search}
            onClick={() => {
              document.getElementById("invSearch").focus();
            }}
            style={{ cursor: "pointer" }}
            alt="search icon"
          ></img>
          <input
            name="invSearch"
            id="invSearch"
            className="search"
            onInput={this.handleSearch}
          ></input>
        </div>
        <div className="titleBar">
          <div className="titleItem shortTitle">Select</div>
          <div className="titleItem">Part Name</div>
          <div className="titleItem">Part Location</div>
          <div className="titleItem">Part Amount</div>
          <div className="titleItem">Last Counter</div>
          <div className="titleItem">Date Counted</div>
          <div className="titleItem shortTitle">Order Form</div>
        </div>
        <div className="partList">
          {this.state.parts.map((part, i) => {
            if (
              part.name.toLowerCase().includes(this.state.term.toLowerCase())
            ) {
              return (
                <div key={part.id} id={part.id} className="part">
                  <input
                    type="checkbox"
                    name="selected"
                    className="partCheckbox shortField"
                  ></input>
                  <div className="partField" id={`${part.id}_name`}>
                    <input
                      type="text"
                      name="name"
                      className="partText"
                      defaultValue={part.name}
                      onBlur={() => {
                        this.handleSave(part.id, "name");
                      }}
                    ></input>
                  </div>
                  <div className="partField" id={`${part.id}_location`}>
                    <select
                      name="location"
                      className="partSelect"
                      defaultValue={part.location}
                      onInput={() => {
                        this.handleSave(part.id, "location");
                      }}
                    >
                      {this.state.locations.map((location, j) => {
                        return (
                          <option key={j} value={location}>
                            {location}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="partField" id={`${part.id}_amount`}>
                    <Badge
                      color={
                        part.avaliableAmount === 0
                          ? "danger"
                          : part.avaliableAmount < part.amount / 2
                          ? "warning"
                          : "success"
                      }
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "5px",
                        width: "20px"
                      }}
                    >
                      {part.avaliableAmount}
                    </Badge>
                    <input
                      type="number"
                      name="amount"
                      className="partText"
                      defaultValue={part.amount}
                      onBlur={() => {
                        this.handleSave(part.id, "amount");
                      }}
                    ></input>
                  </div>
                  <div className="partField" id={`${part.id}_counter`}>
                    <select
                      name="counter"
                      className="partSelect"
                      defaultValue={part.counter}
                      onInput={() => {
                        this.handleSave(part.id, "counter");
                      }}
                    >
                      {this.state.counters.map((counter, j) => {
                        return (
                          <option key={j} value={counter}>
                            {counter}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="partField" id={`${part.id}_dateCounted`}>
                    <input
                      type="date"
                      name="dateCounted"
                      className="partText"
                      defaultValue={part.dateCounted}
                      onBlur={() => {
                        this.handleSave(part.id, "dateCounted");
                      }}
                    ></input>
                  </div>
                  <button className="iconBtn shortField">
                    <img src={form} alt="order form icon"></img>
                  </button>
                </div>
              );
            }
            return null;
          })}
        </div>
        <Modal
          isOpen={this.state.newPartModal}
          toggle={this.toggleNewPartModal}
        >
          <ModalHeader toggle={this.toggleNewPartModal}>Add Part</ModalHeader>
          <ModalBody>
            <div className="form">
              <div className="form-field">
                <label htmlFor="newPartName">Name:</label>
                <input
                  type="text"
                  name="newPartName"
                  id="newPartName"
                  placeholder="Name..."
                  className="ml-1 flex-grow-1"
                ></input>
              </div>
              <div className="form-field">
                <label htmlFor="newPartLocation">Location:</label>
                <select
                  name="newPartLocation"
                  id="newPartLocation"
                  className="ml-1 flex-grow-1"
                >
                  {this.state.locations.map((location, j) => {
                    return (
                      <option key={j} value={location}>
                        {location}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="newPartAmount">Amount:</label>
                <input
                  type="number"
                  name="newPartAmount"
                  id="newPartAmount"
                  placeholder="Amount..."
                  className="ml-1 flex-grow-1"
                ></input>
              </div>
              <div className="form-field">
                <label htmlFor="newPartCounter">Counter:</label>
                <select
                  name="newPartCounter"
                  id="newPartCounter"
                  className="ml-1 flex-grow-1"
                >
                  {this.state.counters.map((counter, j) => {
                    return (
                      <option key={j} value={counter}>
                        {counter}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="newPartLink">Link:</label>
                <input
                  id="newPartLink"
                  name="newPartLink"
                  placeholder="Link..."
                  className="ml-1 flex-grow-1"
                ></input>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <span id="newPartError">{this.state.newPartError}</span>
            <Button color="success" onClick={this.handleAddPart}>
              Add Part
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Inventory;
