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
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Icon from "@material-ui/core/Icon";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

import slugify from "utils/slugify";

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

class VolunteersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      administracoes: [],
      administracaoSelecionada: "",
      volunteers: [],
      volunteersShow: [],
      loading: true,
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    this.loadAdministracoes();
  }

  handleNew(event) {
    event.preventDefault();
    window.location.pathname = "/admin/novo-voluntario";
  }

  async handleDelete(voluntary) {
    if (window.confirm(`Deseja excluir o irmão ${voluntary.val()["nome"]}?`)) {
      let links = voluntary.val()["links"];
      if (links !== undefined){
        Object.keys(links).forEach((key) => {        
          firebase
            .database()
            .ref(`/regionais/ribeirao-preto/dados/${this.state.administracaoSelecionada}${links[key]}`)
            .remove();
        });
      }
      firebase.database().ref(`/regionais/ribeirao-preto/dados/${this.state.administracaoSelecionada}/voluntarios/${voluntary.key}`).remove();
      await this.loadVolunteers(this.state.administracaoSelecionada);
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

  async loadVolunteers(administracao) {
    this.setState({ loading: true });
    let volunteers = [];
    let entity = await firebase.database().ref(`/regionais/ribeirao-preto/dados/${administracao}/voluntarios`).once("value");
    entity.forEach((element) => {
      volunteers.push([
        element.val()["nome"],
        element.val()["telefone1"],
        element.val()["telefone2"],
        element.val()["comum"],
        <div key={element.key}>
          <a href={`/admin/editar-voluntario/${administracao}/${element.key}`}>Editar</a> |{" "}
          <a href="#" type="button" onClick={() => this.handleDelete(element)}>
            Excluir
          </a>
        </div>,
      ]);
    });
    volunteers = volunteers.sort((a, b) => a[0].localeCompare(b[0]));
    this.setState({ volunteers, volunteersShow: volunteers, loading: false });
  }

  handleSearchChange(event) {
    let { volunteersShow, volunteers, search } = this.state;
    search = event.target.value;
    volunteersShow = volunteers.filter((x) =>
      slugify(x[0].toLowerCase()).includes(slugify(search.toLowerCase()))
    );
    this.setState({ volunteersShow, search });
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
    this.loadVolunteers(event.target.value);
  }

  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Button type="button" color="info" onClick={this.handleNew}>
            Adicionar
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
        <GridItem xs={4} sm={4} md={4}>
          <FormControl style={{ marginLeft: 20, marginTop: 15 }}>
            <Input
              id="standard-adornment-weight"
              value={this.state.search}
              onChange={this.handleSearchChange}
              endAdornment={
                <InputAdornment position="end">
                  <Icon>search</Icon>
                </InputAdornment>
              }
              aria-describedby="standard-weight-helper-text"
            />
          </FormControl>
        </GridItem>
        {this.state.administracaoSelecionada.length > 0 && (
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardBody>
                  <Table
                    tableHeaderColor="primary"
                    tableHead={[
                      "Nome",
                      "Telefone 1",
                      "Telefone 2",
                      "Comum Congregação",
                      "",
                    ]}
                    tableData={this.state.volunteersShow}
                  />
                {this.state.loading && <CircularProgress />}

                {this.state.volunteers.length === 0 && (
                    <p>Não foram encontrados voluntários</p>
                  )}
              </CardBody>
            </Card>
          </GridItem>
        )}
      </GridContainer>
    );
  }
}

export default VolunteersList;
