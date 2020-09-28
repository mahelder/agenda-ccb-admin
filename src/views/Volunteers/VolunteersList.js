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

class VolunteersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volunteers: [],
    };
  }

  componentDidMount() {
    this.loadVolunteers();
  }

  handleNew(event) {
    event.preventDefault();
    window.location.pathname = "/admin/novo-voluntario";
  }

  handleDelete(voluntary) {
    if (window.confirm(`Deseja excluir o irmão ${voluntary.val()["name"]}?`)) {
      firebase.database().ref(`/voluntarios/${voluntary.key}`).remove();
      this.loadVolunteers();
    }
  }

  async loadVolunteers() {
    let volunteers = [];
    let entity = await firebase.database().ref(`/voluntarios`).once("value");
    entity.forEach((element) => {
      volunteers.push([
        element.val()["nome"],
        element.val()["telefone1"],
        element.val()["telefone2"],
        element.val()["comum"],
        <div key={element.key}>
          <a href={`/admin/editar-voluntario/${element.key}`}>Editar</a> |{" "}
          <a href="#" type="button" onClick={() => this.handleDelete(element)}>
            Excluir
          </a>
        </div>,
      ]);
    });
    this.setState({ volunteers });
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
              {this.state.volunteers.length > 0 && (
                <Table
                  tableHeaderColor="primary"
                  tableHead={[
                    "Nome",
                    "Telefone 1",
                    "Telefone 2",
                    "Comum Congregação",
                    "",
                  ]}
                  tableData={this.state.volunteers}
                />
              )}
              {this.state.volunteers.length === 0 && <CircularProgress />}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default VolunteersList;
