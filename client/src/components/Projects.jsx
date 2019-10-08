import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Select from "react-dropdown-select";
import add from "../images/add.svg";
import remove from "../images/remove.svg";
import search from "../images/search.svg";
import addPart from "../images/add-part.svg";
import addWish from "../images/add-wish.svg";
// import form from "../images/form.svg";

class Projects extends Component {
  state = {
    locations: this.props.locations,
    counters: this.props.counters,
    parts: this.props.parts,
    projects: this.props.projects,
    term: "",
    newProjectModal: false,
    newProjectError: "",
    partFromInventoryModal: false,
    partFromInventoryError: "",
    partFromWishlistModal: false,
    partFromWishlistError: "",
    addPartFromInventoryId: "",
    addingPartToProject: { parts: [] },
    addingPartToProjectId: ""
  };

  handleError = (location, error) => {
    if (location === "newProject") {
      return this.setState({ newProjectError: error });
    }
    if (location === "partFromInventory") {
      return this.setState({ partFromInventoryError: error });
    }
    if (location === "partFromWishlist") {
      return this.setState({ partFromWishlistError: error });
    }
  };

  componentWillReceiveProps = ({ locations, counters, parts, projects }) => {
    if (JSON.stringify(locations) !== JSON.stringify(this.state.locations)) {
      this.setState({ locations });
    }
    if (JSON.stringify(counters) !== JSON.stringify(this.state.counters)) {
      this.setState({ counters });
    }
    if (JSON.stringify(parts) !== JSON.stringify(this.state.parts)) {
      this.setState({ parts });
    }
    if (JSON.stringify(projects) !== JSON.stringify(this.state.projects)) {
      this.setState({ projects });
    }
  };

  toggleNewProjectModal = () => {
    this.setState({ newProjectModal: !this.state.newProjectModal });
  };

  togglePartFromInventoryModal = proj => {
    this.handleError("partFromInventory", "");
    if (!this.state.partFromInventoryModal) {
      this.setState({
        partFromInventoryModal: !this.state.partFromInventoryModal,
        addingPartToProject: proj,
        addingPartToProjectId: proj.id
      });
    } else {
      this.setState({
        partFromInventoryModal: !this.state.partFromInventoryModal,
        addingPartToProject: { parts: [] },
        addingPartToProjectId: ""
      });
    }
  };

  togglePartFromWishlistModal = () => {
    this.setState({
      partFromWishlistModal: !this.state.partFromWishlistModal
    });
  };

  handleAddProject = () => {
    if (document.getElementById("newProjectName").value === "") {
      return this.handleError("newProject", "The name field is required.");
    }
    let names = this.state.projects.map(project => {
      return project.name.toLowerCase();
    });
    if (
      names.includes(
        document.getElementById("newProjectName").value.toLowerCase()
      )
    ) {
      return this.handleError(
        "newProject",
        "There is already a project with this name."
      );
    }
    let project = {
      name: document.getElementById("newProjectName").value,
      description: document.getElementById("newProjectDescription").value,
      parts: []
    };
    this.handleError("newProject", "");
    this.props.onAddProject(project);
    this.toggleNewProjectModal();
  };

  handleSearch = () => {
    this.setState({ term: document.getElementById("projSearch").value });
  };

  handleSave = (proj_id, part_id, field) => {
    this.props.onSave(
      proj_id,
      part_id,
      field,
      document.getElementById(`${proj_id}_${part_id}_${field}`).firstChild.value
    );
  };

  handleAddPartFromInventory = () => {
    if (
      this.state.addPartFromInventoryId === "" ||
      this.state.addPartFromInventoryId === undefined
    ) {
      return this.handleError(
        "partFromInventory",
        "The part field is required."
      );
    }
    if (document.getElementById("addPartFromInventoryAmount").value === "") {
      return this.handleError(
        "partFromInventory",
        "The amount field is required."
      );
    }
    this.props.onAddPartFromInventory(
      this.state.addingPartToProjectId,
      this.state.addPartFromInventoryId,
      document.getElementById("addPartFromInventoryAmount").value
    );
    this.togglePartFromInventoryModal();
  };

  handleRemovePartFromProject = (proj_id, part_id) => {
    this.props.onRemovePartFromProject(proj_id, part_id);
  };

  handleRemoveProject = proj_id => {
    if (
      window.confirm(
        `Are you sure you want to remove the ${
          this.state.projects.find(e => e.id === proj_id).name
        } project?`
      )
    ) {
      this.props.onRemoveProject(proj_id);
    }
  };

  render() {
    return (
      <div className="content">
        <div className="searchBarRight">
          <button
            className="iconBtn"
            id="addProject"
            title="Add new projects..."
            onClick={this.toggleNewProjectModal}
          >
            <img src={add} alt="add part icon"></img>
          </button>
          <div className="spacer"></div>
          <img
            src={search}
            onClick={() => {
              document.getElementById("projSearch").focus();
            }}
            style={{ cursor: "pointer", width: "24px" }}
            alt="search icon"
          ></img>
          <input
            name="projSearch"
            id="projSearch"
            className="search"
            onInput={this.handleSearch}
          ></input>
        </div>
        <div className="partList">
          {this.state.projects.map((project, i) => {
            if (
              project.name.toLowerCase().includes(this.state.term.toLowerCase())
            ) {
              return (
                <div key={project.id} id={`${project.id}`} className="project">
                  <div className="projectHeader">
                    <h4 style={{ margin: 0 }}>{project.name}</h4>
                    <span style={{ margin: 0, marginLeft: "30px" }}>
                      <i>{project.description}</i>
                    </span>
                    <div className="projectField">
                      <button
                        className="iconBtn"
                        onClick={() => {
                          this.handleRemoveProject(project.id);
                        }}
                      >
                        <img src={remove} alt="remove project icon"></img>
                      </button>
                    </div>
                  </div>
                  <div style={{ width: "100%" }}>
                    <button
                      className="iconBtn"
                      id="addPartFromInventory"
                      title="Add part from inventory"
                      onClick={() => {
                        this.togglePartFromInventoryModal(project);
                      }}
                    >
                      <img src={addPart} alt="add part icon"></img>
                    </button>
                    <button
                      className="iconBtn"
                      id="addPartFromWishlist"
                      title="Add part from wishlist"
                      onClick={this.togglePartFromWishlistModal}
                    >
                      <img src={addWish} alt="add part icon"></img>
                    </button>
                  </div>
                  <div
                    className="partList"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {project.parts.map((part, i) => {
                      return (
                        <div
                          key={part.id}
                          id={`${project.id}_${part.id}`}
                          className="part"
                          style={{ width: "40%" }}
                        >
                          <div
                            className="partField"
                            id={`${project.id}_${part.id}_name`}
                          >
                            <h6 style={{ margin: 0 }}>{part.name}</h6>
                          </div>
                          <div
                            className="partField"
                            id={`${project.id}_${part.id}_amount`}
                          >
                            <input
                              type="number"
                              name="amount"
                              className="partText"
                              defaultValue={part.amount}
                              onBlur={() => {
                                this.handleSave(project.id, part.id, "amount");
                              }}
                            ></input>
                          </div>
                          <div>
                            <button
                              className="iconBtn"
                              onClick={() => {
                                this.handleRemovePartFromProject(
                                  project.id,
                                  part.id
                                );
                              }}
                            >
                              <img src={remove} alt="remove part icon"></img>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        <Modal
          isOpen={this.state.newProjectModal}
          toggle={this.toggleNewProjectModal}
        >
          <ModalHeader toggle={this.toggleNewProjectModal}>
            Add Project
          </ModalHeader>
          <ModalBody>
            <div className="form">
              <div className="form-field">
                <label htmlFor="newProjectName">Name:</label>
                <input
                  type="text"
                  name="newProjectName"
                  id="newProjectName"
                  placeholder="Name..."
                  className="ml-1 flex-grow-1"
                ></input>
              </div>
              <div className="form-field">
                <label htmlFor="newProjectDescription">Description:</label>
                <input
                  type="text"
                  name="newProjectDescription"
                  id="newProjectDescription"
                  placeholder="Description..."
                  className="ml-1 flex-grow-1"
                ></input>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <span id="newProjectError">{this.state.newProjectError}</span>
            <Button color="success" onClick={this.handleAddProject}>
              Add Project
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.partFromInventoryModal}
          toggle={this.togglePartFromInventoryModal}
        >
          <ModalHeader toggle={this.togglePartFromInventoryModal}>
            Add Part to {this.state.addingPartToProject.name}
          </ModalHeader>
          <ModalBody>
            <div className="form">
              <div className="form-field">
                <label htmlFor="addPartFromInventoryName">Part:</label>
                <Select
                  name="addPartFromInventoryName"
                  id="addPartFromInventoryName"
                  placeholder="Select part"
                  separator={true}
                  labelField="name"
                  valueField="id"
                  searchBy="name"
                  options={this.state.parts.filter(e => {
                    return !this.state.addingPartToProject.parts
                      .map(x => x.name)
                      .includes(e.name);
                  })}
                  className="ml-1 flex-grow-1"
                  onChange={values => {
                    this.setState({ addPartFromInventoryId: values[0].id });
                  }}
                ></Select>
              </div>
              <div className="form-field">
                <label htmlFor="addPartFromInventoryAmount">Amount:</label>
                <input
                  type="number"
                  name="addPartFromInventoryAmount"
                  id="addPartFromInventoryAmount"
                  placeholder="Amount..."
                  className="ml-1 flex-grow-1"
                ></input>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <span id="partFromInventoryError">
              {this.state.partFromInventoryError}
            </span>
            <Button
              color="success"
              onClick={() => {
                this.handleAddPartFromInventory();
              }}
            >
              Add Part from Inventory
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Projects;
