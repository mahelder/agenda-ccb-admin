import React from "react";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { CircularProgress } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
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

class ChurchesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      administracoes: [],
      administracaoSelecionada: "",
      loading: true,
      churches: [],
    };
  }

  componentDidMount() {
    this.loadAdministracoes();
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
    this.loadChurches(event.target.value);
  }

  async handleNew(event) {
    event.preventDefault();
    window.location.pathname = "/admin/nova-casa-de-oracao";
  }

  handleDelete(church) {
    if (
      window.confirm(`Deseja excluir a casa de oração ${church.val()["name"]}?`)
    ) {
      firebase.database().ref(`/regionais/ribeirao-preto/dados/${this.state.administracaoSelecionada}/churches/${church.key}`).remove();
      this.loadChurches(this.state.administracaoSelecionada);
    }
  }

  async loadChurches(administracao) {
    let churches = [];
    let entity = await firebase.database().ref(`/regionais/ribeirao-preto/dados/${administracao}/churches`).once("value");
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
          <a href={`/admin/editar-casa-de-oracao/${administracao}/${element.key}`}>Editar</a> |{" "}
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
        </GridItem>
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
        <GridItem xs={12} sm={12} md={12}>
          {this.state.administracaoSelecionada.length > 0 &&
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
          }
        </GridItem>
      </GridContainer>
    );
  }
}

export default ChurchesList;
