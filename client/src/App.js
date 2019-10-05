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
    amount: 5,
    counter: "Noah",
    dateCounted: "2019-02-26",
    id: "5d8b6c300d9168"
  },
  {
    name: "VictorSP",
    location: "Dungeon",
    amount: 5,
    counter: "Noah",
    dateCounted: "2019-02-26",
    id: "5d8b6ca7608314"
  },
  {
    name: "RoboRIO",
    location: "Dungeon",
    amount: 5,
    counter: "Noah",
    dateCounted: "2019-02-26",
    id: "5d8b6cabb9db24"
  }
];

let projects = [
  {
    name: "Robot",
    description: "test description",
    id: "p_5d8b6c308d9228",
    parts: [
      {
        name: "VictorSP",
        location: "Dungeon",
        amount: 5,
        counter: "Noah",
        dateCounted: "2019-02-26",
        id: "5d8b6ca7608314"
      }
    ]
  }
];

class App extends Component {
  state = {
    activeTab: "Projects",
    parts: parts,
    projects: projects
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

  handleSave = (id, field, value) => {
    let { parts } = this.state;
    parts[
      parts.findIndex(e => {
        return e.id === id;
      })
    ][field] = field !== "amount" ? value : parseInt(value);
    this.setState({ parts });
  };

  handleAddProject = newProject => {
    let { projects } = this.state;
    newProject["id"] = uniqid("proj_");
    projects.push(newProject);
    this.setState({ projects });
  };

  handleSaveProjectPart = (proj_id, part_id, field, value) => {
    let { projects } = this.state;
    let index = projects.findIndex(e => {
      return e.id === proj_id;
    });
    projects[index].parts[
      projects[index].parts.findIndex(e => {
        return e.id === part_id;
      })
    ][field] = value;
  };

  handleAddPartFromInventory = (proj_id, part_id, amount) => {
    let { projects, parts } = this.state;
    let part = parts.find(e => {
      return e.id === part_id;
    });
    let index = projects.findIndex(e => {
      return e.id === proj_id;
    });
    if (
      projects[index].parts.find(e => {
        return e.id === part_id;
      }) === undefined
    ) {
      projects[index].parts.push(part);
      projects[index].parts[projects[index].parts.length - 1]["maxAmount"] =
        projects[index].parts[projects[index].parts.length - 1].amount;
      projects[index].parts[projects[index].parts.length - 1].amount = amount;
    }
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
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="Inventory">
            <Inventory
              locations={locations}
              counters={counters}
              parts={this.state.parts}
              onAddPart={this.handleAddPart}
              onRemovePart={this.handleRemovePart}
              onSave={this.handleSave}
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
            ></Projects>
          </TabPane>
          <TabPane tabId="Wish List">
            <WishList></WishList>
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
