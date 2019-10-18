import React, { Component } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink, Badge } from "reactstrap";
import classnames from "classnames";
import Inventory from "./components/Inventory";
import Projects from "./components/Projects";
import WishList from "./components/WishList";

let locations = ["Dungeon", "Electrical HQ", "Computer Lab"];
let counters = ["Noah", "Dani", "Brendan"];

class App extends Component {
  state = {
    activeTab: "Inventory",
    parts: [],
    projects: [],
    wishes: [],
    mainError: ""
  };

  // onUnload = e => {
  //   e.returnValue = "Test";
  // };

  // componentDidMount = () => {
  //   window.addEventListener("beforeunload", this.onUnload);
  // };

  // componentWillUnmount = () => {
  //   window.removeEventListener("beforeunload", this.onUnload);
  // };

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
    newPart["id"] = uniqid("p_");
    parts.push(newPart);
    this.setState({ parts });
    save(parts, "parts");
  };

  handleRemovePart = partsToRemove => {
    console.log(partsToRemove);
    let { parts, projects } = this.state;
    partsToRemove.forEach(id => {
      parts.splice(
        parts.findIndex(part => {
          return part.id === id;
        }),
        1
      );
    });
    projects.forEach(proj => {
      let projParts = proj.parts.filter(part =>
        partsToRemove.includes(part.id)
      );
      if (projParts.length > 0) {
        for (var i = 0; i < projParts.length; i++) {
          proj.parts.splice(proj.parts.indexOf(projParts[i]), 1);
        }
      }
    });
    this.setState({ parts, projects });
    save(parts, "parts");
    save(projects, "projects");
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
    save(parts, "parts");
  };

  handleAddProject = newProject => {
    let { projects } = this.state;
    newProject["id"] = uniqid("proj_");
    projects.push(newProject);
    this.setState({ projects });
    save(projects, "projects");
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
        return this.handleError(
          "You do not have enough parts in stock. This change will not save."
        );
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
    save(parts, "parts");
    save(projects, "projects");
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
      save(parts, "parts");
      save(projects, "projects");
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
      ].proj_amount;
    projects[index].parts.splice(
      projects[index].parts.findIndex(e => {
        return e.id === part_id;
      }),
      1
    );
    this.setState({ parts, projects });
    save(parts, "parts");
    save(projects, "projects");
  };

  handleRemoveProject = proj_id => {
    let { projects, parts } = this.state;
    let partsToRemove =
      projects[projects.findIndex(proj => proj.id === proj_id)].parts;
    partsToRemove.forEach(part => {
      parts[parts.findIndex(p => p.id === part.id)].availableAmount +=
        part.proj_amount;
    });
    projects.splice(
      projects.findIndex(e => {
        return e.id === proj_id;
      }),
      1
    );
    this.setState({ projects });
    save(projects, "projects");
    save(parts, "parts");
  };

  handleAddWish = newWish => {
    let { wishes } = this.state;
    newWish["id"] = uniqid("wish_");
    wishes.push(newWish);
    this.setState({ wishes });
    save(wishes, "wishes");
  };

  handleSave = (id, field, value) => {
    let { parts } = this.state;
    parts[
      parts.findIndex(e => {
        return e.id === id;
      })
    ][field] = field !== "amount" ? value : parseInt(value);
    this.setState({ parts });
    save(parts, "parts");
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
    save(wishes, "wishes");
  };

  handleSaveWish = (id, field, value) => {
    let { wishes } = this.state;
    wishes[
      wishes.findIndex(e => {
        return e.id === id;
      })
    ][field] = field !== "amount" ? value : parseInt(value);
    this.setState({ wishes });
    save(wishes, "wishes");
  };

  componentDidMount = () => {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      let res = JSON.parse(xhr.response);
      this.setState({
        parts: res.parts ? res.parts : [],
        projects: res.projects ? res.projects : [],
        wishes: res.wishes ? res.wishes : []
      });
    });
    xhr.open("GET", "/load");
    xhr.send();
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

let save = async (data, namespace) => {
  fetch("/save", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ data, namespace })
  }).then(res => {
    console.log("Saved!");
  });
};
