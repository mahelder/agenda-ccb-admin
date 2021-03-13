import React from "react";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";

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

class AdmList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      administracoes: [],
    };
  }

  componentDidMount() {
    this.loadAdministracoes();
  }

  handleNew(event) {
    event.preventDefault();
    window.location.pathname = "/admin/nova-administracao";
  }

  async handleDelete(admin) {
    if (window.confirm(`Deseja excluir a administração ${admin.val()}?`)) {
      
      firebase
        .database()
        .ref(`/regionais/ribeirao-preto/dados/${admin.key}`)
        .remove();

      firebase
        .database()
        .ref(`/regionais/ribeirao-preto/administracoes/${admin.key}`)
        .remove();
      
      await this.loadAdministracoes();
    }
  }

  async loadAdministracoes() {
    let administracoes = [];
    this.setState({ loading: true });

    let entity = await firebase
      .database()
      .ref(`/regionais/ribeirao-preto/administracoes`)
      .once("value");

    entity.forEach((element) => {
      administracoes.push([
        element.val(),
        <div key={element.key}>
          <a href={`/admin/editar-administracao/${element.key}`}>Editar</a> |{" "}
          <a href="#" type="button" onClick={() => this.handleDelete(element)}>
            Excluir
          </a>
        </div>
      ]);
    });

    this.setState({ administracoes, loading: false });
  }

  render() {
    return (
      <GridContainer>
        <Backdrop style={styles.backdrop} open={this.state.loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <GridItem xs={12} sm={12} md={12}>
          <Button type="button" color="info" onClick={this.handleNew}>
            Adicionar
          </Button>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          {this.state.administracoes.length > 0 && (
            <Card>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Nome", ""]}
                  tableData={this.state.administracoes}
                />
              </CardBody>
            </Card>
          )}
        </GridItem>
      </GridContainer>
    );
  }
}

export default AdmList;
