import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import add from "../images/add.svg";
import remove from "../images/remove.svg";
import search from "../images/search.svg";
import form from "../images/form.svg";

class WishList extends Component {
  state = {
    parts: this.props.parts,
    wishes: this.props.wishes,
    term: "",
    newWishModal: false,
    newWishError: ""
  };

  handleError = (location, error) => {
    if (location === "newPart") {
      this.setState({ newWishError: error });
    }
  };

  componentDidUpdate = ({ parts, wishes }) => {
    if (JSON.stringify(parts) !== JSON.stringify(this.props.parts)) {
      this.setState({ parts: this.props.parts });
    }
    if (wishes !== this.props.wishes) {
      this.setState({ wishes: this.props.wishes });
    }
  };

  handleAddWish = () => {
    if (document.getElementById("newWishName").value === "") {
      return this.handleError("newWish", "The name field is required.");
    }
    if (isNaN(parseInt(document.getElementById("newWishAmount").value))) {
      return this.handleError("newWish", "The amount field is required.");
    }
    let names = this.state.wishes.map(wish => {
      return wish.name.toLowerCase();
    });
    if (
      names.includes(document.getElementById("newWishName").value.toLowerCase())
    ) {
      return this.handleError(
        "newWish",
        "There is already a wish with this name."
      );
    }
    let newWish = {
      name: document.getElementById("newWishName").value,
      amount: parseInt(document.getElementById("newWishAmount").value),
      link: document.getElementById("newWishLink").value
    };
    this.handleError("newWish", "");
    this.props.onAddWish(newWish);
    this.toggleNewWishModal();
  };

  handleRemoveWishes = () => {
    let checkboxes = document.getElementsByClassName("wishCheckbox");
    let wishesToRemove = [];
    for (var checkbox in checkboxes) {
      if (checkboxes[checkbox].checked === true) {
        wishesToRemove.push(checkboxes[checkbox].parentNode.id);
      }
    }
    if (
      wishesToRemove.length !== 0 &&
      window.confirm(
        `Are you sure you want to remove ${wishesToRemove.length} wishes?`
      )
    ) {
      this.props.onRemoveWish(wishesToRemove);
    }
  };

  toggleNewWishModal = () => {
    this.setState({ newWishModal: !this.state.newWishModal });
  };

  handleSave = (id, field) => {
    this.props.onSave(
      id,
      field,
      document.getElementById(`${id}_${field}`).firstChild.value
    );
  };

  handleSearch = () => {
    this.setState({ term: document.getElementById("wishSearch").value });
  };

  render() {
    return (
      <div className="content">
        <div className="searchBarRight">
          <button
            className="iconBtn"
            id="addWish"
            title="Add new wish..."
            onClick={this.toggleNewWishModal}
          >
            <img src={add} alt="add wish icon"></img>
          </button>
          <button
            className="iconBtn"
            id="removeWishes"
            title="Remove selected wishes..."
            onClick={this.handleRemoveWishes}
          >
            <img src={remove} alt="remove wishes icon"></img>
          </button>
          <div className="spacer"></div>
          <img
            src={search}
            onClick={() => {
              document.getElementById("wishSearch").focus();
            }}
            style={{ cursor: "pointer" }}
            alt="search icon"
          ></img>
          <input
            name="wishSearch"
            id="wishSearch"
            className="search"
            onInput={this.handleSearch}
          ></input>
        </div>
        <div className="titleBar">
          <div className="titleItem shortTitle">Select</div>
          <div className="titleItem">Part Name</div>
          <div className="titleItem">Amount Wanted</div>
          <div className="titleItem shortTitle">Order Form</div>
        </div>
        <div className="partList">
          {this.state.wishes.map((wish, i) => {
            if (
              wish.name.toLowerCase().includes(this.state.term.toLowerCase())
            ) {
              return (
                <div key={wish.id} id={wish.id} className="part">
                  <input
                    type="checkbox"
                    name="selected"
                    className="wishCheckbox shortField"
                  ></input>
                  <div className="partField" id={`${wish.id}_name`}>
                    <input
                      type="text"
                      name="name"
                      className="partText"
                      defaultValue={wish.name}
                      onBlur={() => {
                        this.handleSave(wish.id, "name");
                      }}
                    ></input>
                  </div>
                  <div className="partField" id={`${wish.id}_amount`}>
                    <input
                      type="number"
                      name="amount"
                      className="partText"
                      defaultValue={wish.amount}
                      onBlur={() => {
                        this.handleSave(wish.id, "amount");
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
          isOpen={this.state.newWishModal}
          toggle={this.toggleNewWishModal}
        >
          <ModalHeader toggle={this.toggleNewWishModal}>Add Wish</ModalHeader>
          <ModalBody>
            <div className="form">
              <div className="form-field">
                <label htmlFor="newWishName">Name:</label>
                <input
                  type="text"
                  name="newWishName"
                  id="newWishName"
                  placeholder="Name..."
                  className="ml-1 flex-grow-1"
                ></input>
              </div>
              <div className="form-field">
                <label htmlFor="newWishAmount">Amount:</label>
                <input
                  type="number"
                  name="newWishAmount"
                  id="newWishAmount"
                  placeholder="Amount..."
                  className="ml-1 flex-grow-1"
                ></input>
              </div>
              <div className="form-field">
                <label htmlFor="newWishLink">Link:</label>
                <input
                  id="newWishLink"
                  name="newWishLink"
                  placeholder="Link..."
                  className="ml-1 flex-grow-1"
                ></input>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <span id="newWishError">{this.state.newWishError}</span>
            <Button color="success" onClick={this.handleAddWish}>
              Add Wish
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default WishList;
