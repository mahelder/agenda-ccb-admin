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

class ChurchesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      churches: [],
    };
  }

  componentDidMount() {
    this.loadChurches();
  }

  async handleNew(event) {
    event.preventDefault();
    window.location.pathname = "/admin/nova-casa-de-oracao";
  }

  handleDelete(church) {
    if (
      window.confirm(`Deseja excluir a casa de oração ${church.val()["name"]}?`)
    ) {
      firebase.database().ref(`/churches/${church.key}`).remove();
      this.loadChurches();
    }
  }

  async loadChurches() {
    let churches = [];
    let entity = await firebase.database().ref(`/churches`).once("value");
    entity.forEach((element) => {
      churches.push([
        element.val()["code"] ? element.val()["code"] : "",
        element.val()["name"],
        element.val()["place"],
        element.val()["cults"],
        element.val()["rehearsals"]
          ? element.val()["rehearsals"]["description"]
          : "",
        <div key={element.key}>
          <a href={`/admin/editar-casa-de-oracao/${element.key}`}>Editar</a> |{" "}
          <a href="#" type="button" onClick={() => this.handleDelete(element)}>
            Excluir
          </a>
        </div>,
        element.val()["order"]
          ? element.val()["order"]
          : Number.MAX_SAFE_INTEGER,
      ]);
    });
    churches = churches.sort((a, b) => {
      if (parseInt(a[6]) > parseInt(b[6])) return 1;
      if (parseInt(a[6]) < parseInt(b[6])) return -1;
      return a[2].localeCompare(b[2]) || a[1].localeCompare(b[1]);
    });
    churches = churches.map((x) => x.slice(0, -1));
    this.setState({ churches });
  }

  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Button type="button" color="info" onClick={this.handleNew}>
            Adicionar localidade
          </Button>
          <Card>
            <CardBody>
              {this.state.churches.length > 0 && (
                <Table
                  tableHeaderColor="primary"
                  tableHead={[
                    "Código",
                    "Bairro",
                    "Localidade",
                    "Cultos",
                    "Ensaios",
                    "",
                  ]}
                  tableData={this.state.churches}
                />
              )}
              {this.state.churches.length === 0 && <CircularProgress />}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default ChurchesList;
