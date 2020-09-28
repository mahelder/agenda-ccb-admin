import React from "react";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { CircularProgress } from "@material-ui/core";

import firebase from "firebase";
import { element } from "prop-types";

class JobsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
    };
  }

  componentDidMount() {
    this.loadJobs();
  }

  handleNew(event) {
    event.preventDefault();
    window.location.pathname = "/admin/novo-cargo";
  }

  handleDelete(job) {
    if (window.confirm(`Deseja excluir o cargo ${job.val()["descricao"]}?`)) {
      job.forEach((voluntary) => {
        if (voluntary.key === "descricao") return;
        let links = voluntary.val()["links"];
        Object.keys(links).forEach((key) => {
          if (links[key] === `/lista-telefones/${job.key}`) {
            firebase
              .database()
              .ref(`/voluntarios/${voluntary.key}/links/${key}`)
              .remove();
          }
        });
      });
      firebase.database().ref(`/lista-telefones/${job.key}`).remove();
      this.loadJobs();
    }
  }

  async loadJobs() {
    let jobs = [];
    let entity = await firebase
      .database()
      .ref(`/lista-telefones`)
      .once("value");
    entity.forEach((element) => {
      jobs.push([
        element.val()["descricao"],
        <div key={element.key}>
          <a href={`/admin/editar-cargo/${element.key}`}>Editar</a> |{" "}
          <a href="#" type="button" onClick={() => this.handleDelete(element)}>
            Excluir
          </a>
        </div>,
      ]);
    });

    jobs.sort(function (a, b) {
      return a[0] > b[0] ? 1 : -1;
    });

    this.setState({ jobs });
  }

  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Button type="button" color="info" onClick={this.handleNew}>
            Adicionar
          </Button>
          <Card>
            <CardBody>
              {this.state.jobs.length > 0 && (
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Nome", ""]}
                  tableData={this.state.jobs}
                />
              )}
              {this.state.jobs.length === 0 && <CircularProgress />}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default JobsList;
