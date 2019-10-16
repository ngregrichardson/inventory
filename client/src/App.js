import React, { Component } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink, Badge } from "reactstrap";
import classnames from "classnames";
import Inventory from "./components/Inventory";
import Projects from "./components/Projects";
import WishList from "./components/WishList";

let locations = ["Dungeon", "Electrical HQ", "Computer Lab"];
let counters = ["Noah", "Dani", "Brendan"];
let parts = [
  {
    name: "Computer",
    location: "Computer Lab",
    amount: 10,
    counter: "Noah",
    dateCounted: "2019-02-26",
    id: "5d8b6c300d9168",
    availableAmount: 10
  },
  {
    name: "VictorSP",
    location: "Dungeon",
    amount: 5,
    counter: "Noah",
    dateCounted: "2019-02-26",
    id: "5d8b6ca7608314",
    availableAmount: 5
  },
  {
    name: "RoboRIO",
    location: "Dungeon",
    amount: 5,
    counter: "Noah",
    dateCounted: "2019-02-26",
    id: "5d8b6cabb9db24",
    availableAmount: 5
  }
];

let projects = [
  {
    name: "Robot",
    description: "test description",
    id: "proj_5d8b6c308d9228",
    parts: [
      {
        name: "VictorSP",
        location: "Dungeon",
        amount: 5,
        counter: "Noah",
        dateCounted: "2019-02-26",
        id: "5d8b6ca7608314",
        availableAmount: 5,
        proj_amount: 5
      }
    ]
  }
];

let wishes = [
  {
    name: "Talon SRX",
    amount: 8,
    id: "98jxvdbh4ai13x"
  }
];

class App extends Component {
  state = {
    activeTab: "Inventory",
    parts: parts,
    projects: projects,
    wishes: wishes,
    mainError: ""
  };

  handleError = err => {
    if (this.state.mainError !== err) {
      this.setState({ mainError: err });
    }
  };

  handleSwitchTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };

  handleAddPart = newPart => {
    let { parts } = this.state;
    newPart["id"] = uniqid();
    parts.push(newPart);
    this.setState({ parts });
  };

  handleRemovePart = partsToRemove => {
    let { parts } = this.state;
    partsToRemove.forEach(id => {
      parts.splice(
        parts.findIndex(part => {
          return part.id === id;
        }),
        1
      );
    });
    this.setState({ parts });
  };

  handleSavePart = (id, field, value) => {
    let { parts } = this.state;
    let partIndex = parts.findIndex(e => {
      return e.id === id;
    });
    if (field !== "amount") {
      parts[partIndex][field] = value;
    } else {
      if (
        parts[partIndex].availableAmount + (value - parts[partIndex].amount) <
        0
      ) {
        return this.handleError(
          "You have too many parts in projects. This change will not save."
        );
      } else {
        parts[partIndex].availableAmount =
          parts[partIndex].availableAmount + (value - parts[partIndex].amount);
        parts[partIndex].amount = value;
      }
    }
    this.setState({ parts });
  };

  handleAddProject = newProject => {
    let { projects } = this.state;
    newProject["id"] = uniqid("proj_");
    projects.push(newProject);
    this.setState({ projects });
  };

  handleSaveProjectPart = (proj_id, part_id, field, value) => {
    let { parts, projects } = this.state;
    let part = parts.find(e => {
      return e.id === part_id;
    });
    let partIndex = parts.indexOf(part);
    let index = projects.findIndex(e => {
      return e.id === proj_id;
    });
    if (field === "proj_amount") {
      let currentValue =
        projects[index].parts[
          projects[index].parts.findIndex(e => {
            return e.id === part_id;
          })
        ].proj_amount;
      if (part.availableAmount + (currentValue - value) < 0) {
        return this.handleError("You do not have enough parts in stock");
      } else {
        parts[partIndex].availableAmount += currentValue - value;
      }
    }
    projects[index].parts[
      projects[index].parts.findIndex(e => {
        return e.id === part_id;
      })
    ][field] = value;
    this.setState({ parts, projects });
  };

  handleAddPartFromInventory = (proj_id, part_id, amount) => {
    let { projects, parts } = this.state;
    let part = parts.find(e => {
      return e.id === part_id;
    });
    let partIndex = parts.indexOf(part);
    let index = projects.findIndex(e => {
      return e.id === proj_id;
    });
    if (
      projects[index].parts.find(e => {
        return e.id === part_id;
      }) === undefined
    ) {
      if (part.availableAmount - amount < 0) {
        return "You do not have that many parts in stock";
      }
      parts[partIndex].availableAmount -= amount;
      part.proj_amount = amount;
      projects[index].parts.push(part);
      this.setState({ projects, parts });
    } else {
      return "This part is already in this project";
    }
  };

  handleRemovePartFromProject = (proj_id, part_id) => {
    let { parts, projects } = this.state;
    let partIndex = parts.findIndex(e => {
      return e.id === part_id;
    });
    let index = projects.findIndex(e => {
      return e.id === proj_id;
    });
    parts[partIndex].availableAmount +=
      projects[index].parts[
        projects[index].parts.findIndex(e => {
          return e.id === part_id;
        })
      ].amount;
    projects[index].parts.splice(
      projects[index].parts.findIndex(e => {
        return e.id === part_id;
      }),
      1
    );
    this.setState({ parts, projects });
  };

  handleRemoveProject = proj_id => {
    let { projects } = this.state;
    projects.splice(
      projects.findIndex(e => {
        return e.id === proj_id;
      }),
      1
    );
    this.setState({ projects });
  };

  handleAddWish = newWish => {
    let { wishes } = this.state;
    newWish["id"] = uniqid("wish_");
    wishes.push(newWish);
    this.setState({ wishes });
  };

  handleSave = (id, field, value) => {
    let { parts } = this.state;
    parts[
      parts.findIndex(e => {
        return e.id === id;
      })
    ][field] = field !== "amount" ? value : parseInt(value);
    this.setState({ parts });
  };

  handleRemoveWish = wishesToRemove => {
    let { wishes } = this.state;
    wishesToRemove.forEach(id => {
      wishes.splice(
        wishes.findIndex(wish => {
          return wish.id === id;
        }),
        1
      );
    });
    this.setState({ wishes });
  };

  handleSaveWish = (id, field, value) => {
    let { wishes } = this.state;
    wishes[
      wishes.findIndex(e => {
        return e.id === id;
      })
    ][field] = field !== "amount" ? value : parseInt(value);
    this.setState({ wishes });
  };

  render() {
    return (
      <div className="content">
        <Nav tabs>
          <NavItem className="mx-2">
            <h3>
              <Badge color="secondary">
                Be<sup>rt</sup> Inventory
              </Badge>
            </h3>
          </NavItem>
          <NavItem className={classnames({ pointer: true })}>
            <NavLink
              className={classnames({
                active: this.state.activeTab === "Inventory"
              })}
              onClick={() => {
                this.handleSwitchTab("Inventory");
              }}
            >
              Inventory
            </NavLink>
          </NavItem>
          <NavItem className={classnames({ pointer: true })}>
            <NavLink
              className={classnames({
                active: this.state.activeTab === "Projects"
              })}
              onClick={() => {
                this.handleSwitchTab("Projects");
              }}
            >
              Projects
            </NavLink>
          </NavItem>
          <NavItem className={classnames({ pointer: true })}>
            <NavLink
              className={classnames({
                active: this.state.activeTab === "Wish List"
              })}
              onClick={() => {
                this.handleSwitchTab("Wish List");
              }}
            >
              Wish List
            </NavLink>
          </NavItem>
          <div id="mainError">{this.state.mainError}</div>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="Inventory">
            <Inventory
              locations={locations}
              counters={counters}
              parts={this.state.parts}
              onAddPart={this.handleAddPart}
              onRemovePart={this.handleRemovePart}
              onSave={this.handleSavePart}
              projects={this.state.projects}
            ></Inventory>
          </TabPane>
          <TabPane tabId="Projects">
            <Projects
              locations={locations}
              counters={counters}
              parts={this.state.parts}
              projects={this.state.projects}
              onAddProject={this.handleAddProject}
              onSave={this.handleSaveProjectPart}
              onAddPartFromInventory={this.handleAddPartFromInventory}
              onRemovePartFromProject={this.handleRemovePartFromProject}
              onRemoveProject={this.handleRemoveProject}
            ></Projects>
          </TabPane>
          <TabPane tabId="Wish List">
            <WishList
              parts={this.state.parts}
              wishes={this.state.wishes}
              onAddWish={this.handleAddWish}
              onRemoveWish={this.handleRemoveWish}
              onSave={this.handleSaveWish}
            ></WishList>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default App;

let uniqid = (a = "", b = false, long = false) => {
  var c = Date.now() / 1000;
  var d = c
    .toString(16)
    .split(".")
    .join("");
  while (d.length < 14) {
    d += "0";
  }
  var e = "";
  if (b) {
    e = ".";
    var f = Math.round(Math.random() * 100000000);
    e += f;
  }
  return a + d + e;
};
