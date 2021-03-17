import React from "react";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import moment from "moment";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

import firebase from "firebase";

const styles = {
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  backdrop: {
    zIndex: 9999,
    color: "#fff",
  },
  formControl: {
    width: "100%",
  },
  hide: {
    display: "None"
  }
};

class EventsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
  }

  componentDidMount() {
    this.loadEvents();
  }

  handleNew(event) {
    event.preventDefault();
    window.location.pathname = "/admin/novo-evento";
  }

  handleDelete(month, agenda) {
    if (window.confirm(`Deseja excluir o evento ${agenda.val()["service"]}?`)) {
      firebase
        .database()
        .ref(`/regionais/ribeirao-preto/dados/lista/${month}/${agenda.key}`)
        .remove();
      this.loadEvents();
    }
  }

  deleteAll() {
    if (window.confirm(`Deseja excluir todas os eventos?`)) {
      firebase
        .database()
        .ref(`/regionais/ribeirao-preto/dados/lista/`)
        .set({
          january: { description: "" },
        });
      this.loadEvents();
    }
  }

  async loadEvents() {
    let agendas = [];
    let entity = await firebase
      .database()
      .ref(`/regionais/ribeirao-preto/dados/lista`)
      .once("value");
    entity.forEach((element) => {
      element.forEach((agenda) => {
        if (agenda.key === "description") return;
        agendas.push([
          agenda.val()["service"],
          agenda.val()["name"],
          agenda.val()["date"],
          agenda.val()["time"],
          agenda.val()["place"],
          <div key={agenda.key}>
            <a
              href={`/admin/editar-evento/${element.key}/${agenda.key}`}
            >
              Editar
            </a>{" "}
            |{" "}
            <a
              href="#"
              type="button"
              onClick={() => this.handleDelete(element.key, agenda)}
            >
              Excluir
            </a>
          </div>,
        ]);
      });
    });

    agendas.sort(function (a, b) {
      return new Date(b[2]) - new Date(a[2]);
    });

    agendas.forEach((x) => (x[2] = moment(x[2]).format("DD/MM/YYYY")));

    this.setState({ events: agendas });
  }

  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12} style={{marginBottom: 30}}>
          <GridContainer>            
            <GridItem xs={4} sm={4} md={4}>
              <Button type="button" color="info" onClick={this.handleNew}>
                Adicionar
              </Button>
            </GridItem>
          </GridContainer>
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          <Button
            type="button"
            color="danger"
            onClick={() => this.deleteAll()}
          >
            Excluir Todos
            </Button>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 style={styles.cardTitleWhite}>Serviços</h4>
            </CardHeader>
            <CardBody>
              {this.state.events.length > 0 && (
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Serviço", "Nome", "Data", "Horário", "Local", ""]}
                  tableData={this.state.events}
                />
              )}
              {this.state.events.length === 0 && <p>Sem dados</p>}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default EventsList;
