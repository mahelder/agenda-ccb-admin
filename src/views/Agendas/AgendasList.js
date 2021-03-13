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

class AgendasList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      administracoes: [],
      administracaoSelecionada: "",
      agendasMinisteriais: [],
      agendasMusicais: [],
    };
  }

  componentDidMount() {
    this.loadAdministracoes();
  }

  handleNew(event) {
    event.preventDefault();
    window.location.pathname = "/admin/nova-reuniao";
  }

  handleDelete(type, month, agenda) {
    if (window.confirm(`Deseja excluir a agenda ${agenda.val()["name"]}?`)) {
      firebase
        .database()
        .ref(`/agendas/${type}/${month}/${agenda.key}`)
        .remove();
      this.loadAgendas(type);
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
      administracoes.push({ key: element.key, descricao: element.val() });
    });

    this.setState({ administracoes, loading: false });
  }

  deleteAll(type) {
    if (window.confirm(`Deseja excluir todas as agendas ${type}?`)) {
      firebase
        .database()
        .ref(`/agendas/${type}/`)
        .set({
          january: { description: "" },
        });
      this.loadAgendas(type);
    }
  }

  async loadAgendas(type) {
    let agendas = [];
    let entity = await firebase
      .database()
      .ref(`/agendas/${type}`)
      .once("value");
    entity.forEach((element) => {
      element.forEach((agenda) => {
        if (agenda.key === "description") return;
        agendas.push([
          agenda.val()["name"],
          agenda.val()["date"],
          agenda.val()["time"],
          agenda.val()["place"],
          <div key={agenda.key}>
            <a
              href={`/admin/editar-reuniao/${type}/${element.key}/${agenda.key}`}
            >
              Editar
            </a>{" "}
            |{" "}
            <a
              href="#"
              type="button"
              onClick={() => this.handleDelete(type, element.key, agenda)}
            >
              Excluir
            </a>
          </div>,
        ]);
      });
    });

    agendas.sort(function (a, b) {
      return new Date(b[1]) - new Date(a[1]);
    });

    agendas.forEach((x) => (x[1] = moment(x[1]).format("DD/MM/YYYY")));

    if (type === "ministeriais")
      this.setState({ agendasMinisteriais: agendas });
    else this.setState({ agendasMusicais: agendas });
  }

  getMenuItemAdministracao() {
    return this.state.administracoes.map((administracao) => (
      // eslint-disable-next-line react/jsx-key
      <MenuItem key={administracao.key} value={administracao.key}>
        {administracao.descricao}
      </MenuItem>
    ));
  }

  handleAdministracao(event) {
    this.setState({ administracaoSelecionada: event.target.value });
    this.loadAgendas("musicais");
    this.loadAgendas("ministeriais");
  }

  render() {
    let isHide = this.state.administracaoSelecionada.length > 0;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12} style={{marginBottom: 30}}>
          <GridContainer>
            <GridItem xs={5} sm={5} md={5}>
              <FormControl style={styles.formControl}>
                <InputLabel id="select">Administração</InputLabel>
                <Select
                  labelId="select"
                  id="select"
                  value={this.state.administracaoSelecionada}
                  onChange={(event) => this.handleAdministracao(event)}
                >
                  {this.getMenuItemAdministracao()}
                </Select>
              </FormControl>
            </GridItem>
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
            onClick={() => this.deleteAll("ministeriais")}
          >
            Excluir Todas
            </Button>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 style={styles.cardTitleWhite}>Agendas Ministeriais</h4>
            </CardHeader>
            <CardBody>
              {this.state.agendasMinisteriais.length > 0 && (
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Nome", "Data", "Horário", "Local", ""]}
                  tableData={this.state.agendasMinisteriais}
                />
              )}
              {this.state.agendasMinisteriais.length === 0 && <p>Sem dados</p>}
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Button
            type="button"
            color="danger"
            onClick={() => this.deleteAll("musicais")}
          >
            Excluir Todas
          </Button>
          <Card>
            <CardHeader color="primary">
              <h4 style={styles.cardTitleWhite}>Agendas Musicais</h4>
            </CardHeader>
            <CardBody>
              {this.state.agendasMusicais.length > 0 && (
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Nome", "Data", "Horário", "Local", ""]}
                  tableData={this.state.agendasMusicais}
                />
              )}
              {this.state.agendasMusicais.length === 0 && <p>Sem dados</p>}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default AgendasList;
