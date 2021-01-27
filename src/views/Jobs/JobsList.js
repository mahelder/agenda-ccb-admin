import React from "react";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import firebase from "firebase";

const styles = {
  backdrop: {
    zIndex: 9999,
    color: "#fff",
  },
  formControl: {
    width: "100%",
  },
};

class JobsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      selectedGroup: "",
      jobs: [],
      availableJobs: [],
    };
  }

  componentDidMount() {
    this.loadJobs();
  }

  handleNew(event) {
    event.preventDefault();
    window.location.pathname = "/admin/novo-cargo";
  }

  async handleDelete(job) {
    if (window.confirm(`Deseja excluir o cargo ${job["descricao"]}?`)) {
      job.snapshot.forEach((voluntary) => {
        if (voluntary.key === "descricao") return;
        let links = voluntary.val()["links"];
        Object.keys(links).forEach((key) => {
          if (links[key] === `/lista-telefones/${job.parent}/${job.key}`) {
            firebase
              .database()
              .ref(`/voluntarios/${voluntary.key}/links/${key}`)
              .remove();
          }
        });
      });
      firebase
        .database()
        .ref(`/lista-telefones/${job.parent}/${job.key}`)
        .remove();
      await this.loadJobs();
    }
  }

  getMenuItemGroup() {
    return this.state.groups.map((group) => (
      // eslint-disable-next-line react/jsx-key
      <MenuItem key={group.key} value={group.key}>
        {group.descricao}
      </MenuItem>
    ));
  }

  handleGroup(event) {
    this.setState({ selectedGroup: event.target.value });
    this.getJobsGroup(event.target.value);
  }

  getJobsGroup(selectedGroup) {
    let filteredJobs = this.state.jobs.filter(
      (x) => x.parent === selectedGroup
    );
    let availableJobs = [];
    filteredJobs.forEach((x) => {
      availableJobs.push([
        x["descricao"],
        <div key={x.key}>
          <a href={`/admin/editar-cargo/${x.parent}/${x.key}`}>Editar</a> |{" "}
          <a href="#" type="button" onClick={() => this.handleDelete(x)}>
            Excluir
          </a>
        </div>,
        x["order"],
      ]);
    });

    availableJobs.sort(function (a, b) {
      if (parseInt(a[2]) > parseInt(b[2])) return 1;
      if (parseInt(a[2]) < parseInt(b[2])) return -1;
      return a[0] > b[0] ? 1 : -1;
    });
    availableJobs = availableJobs.map((x) => x.slice(0, -1));

    this.setState({ availableJobs });
  }

  async loadJobs() {
    let jobs = [];
    let groups = [];
    let entity = await firebase
      .database()
      .ref(`/lista-telefones`)
      .once("value");
    entity.forEach((element) => {
      groups.push({ key: element.key, descricao: element.val()["descricao"] });
      element.forEach((group) => {
        if (group.key !== "descricao") {
          jobs.push({
            parent: element.key,
            key: group.key,
            snapshot: group,
            descricao: group.val()["descricao"],
            order: group.val()["order"]
              ? group.val()["order"]
              : Number.MAX_SAFE_INTEGER,
          });
        }
      });
    });

    this.setState({ jobs, groups });
  }

  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Button type="button" color="info" onClick={this.handleNew}>
            Adicionar
          </Button>
        </GridItem>
        <GridItem xs={12} sm={12} md={5}>
          <FormControl style={styles.formControl}>
            <InputLabel id="select">Seção</InputLabel>
            <Select
              labelId="select"
              id="select"
              value={this.state.selectedGroup}
              onChange={(event) => this.handleGroup(event)}
            >
              {this.getMenuItemGroup()}
            </Select>
          </FormControl>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          {this.state.availableJobs.length > 0 && (
            <Card>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Nome", ""]}
                  tableData={this.state.availableJobs}
                />
              </CardBody>
            </Card>
          )}
        </GridItem>
      </GridContainer>
    );
  }
}

export default JobsList;
