import React from "react";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { CircularProgress } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
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

const listFunctions = [
  "administracao",
  "administracao-patrocinio-paulista",
  "colaboradores-administracao-patrocinio-paulista",
  "conselho-fiscal-patrocinio-paulista",
  "conselho-fiscal",
];

class ContactsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      administracoes: [],
      administracaoSelecionada: "",
      selectedGroup: "",
      selectedOffice: "",
      groups: [],
      offices: [],
      availableOffices: [],
      data: {},
      tabledata: [],
      loading: true,
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

  handleNew(event) {
    event.preventDefault();
    window.location.pathname = "/admin/novo-contato";
  }

  async handleDelete(group, office, contact) {
    let administracao = this.state.administracaoSelecionada;
    if (window.confirm(`Deseja excluir o irmão ${contact.val()["nome"]}?`)) {
      firebase
        .database()
        .ref(`/regionais/ribeirao-preto/dados/${administracao}/voluntarios/${contact.key}/links`)
        .orderByValue()
        .equalTo(`/lista-telefones/${group}/${office}/${contact.key}`)
        .once("value", function (x) {          
          Object.keys(x.val()).forEach((key) => {
            firebase
              .database()
              .ref(`/regionais/ribeirao-preto/dados/${administracao}/voluntarios/${contact.key}/links/${key}`)
              .remove()
          });
        });

      firebase
        .database()
        .ref(`/regionais/ribeirao-preto/dados/${administracao}/lista-telefones/${group}/${office}/${contact.key}`)
        .remove();
      await this.loadContacts(administracao);
      this.getTableData(group, office);
    }
  }

  async loadContacts(administracao) {
    this.setState({ loading: true });
    let groups = [];
    let offices = [];
    let data = {};
    let entity = await firebase
      .database()
      .ref(`/regionais/ribeirao-preto/dados/${administracao}/lista-telefones`)
      .once("value");
    entity.forEach((element) => {
      groups.push({
        key: element.key,
        descricao: element.val()["descricao"],
        order: element.val()["order"]
          ? element.val()["order"]
          : Number.MAX_SAFE_INTEGER,
      });
      element.forEach((group) => {
        if (group.key !== "descricao") {
          offices.push({
            parent: element.key,
            key: group.key,
            descricao: group.val()["descricao"],
            order: group.val()["order"]
              ? group.val()["order"]
              : Number.MAX_SAFE_INTEGER,
          });
          data[group.key] = [];
          group.forEach((contact) => {
            if (contact.key !== "descricao" && contact.key !== "order")
              data[group.key].push(contact);
          });
          data[group.key] = data[group.key].sort((a, b) => {
            let orderA = a.val().order
              ? parseInt(a.val().order)
              : Number.MAX_SAFE_INTEGER;

            let orderB = b.val().order
              ? parseInt(b.val().order)
              : Number.MAX_SAFE_INTEGER;

            if (orderA > orderB) return 1;
            if (orderA < orderB) return -1;
            return a.val().nome > b.val().nome ? 1 : -1;
          });
        }
      });

      groups.sort(function (a, b) {
        if (parseInt(a.order) > parseInt(b.order)) return 1;
        if (parseInt(a.order) < parseInt(b.order)) return -1;
        return a.descricao > b.descricao ? 1 : -1;
      });
    });

    this.setState({ groups, offices, data, loading: false });
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
    this.loadContacts(event.target.value);
  }

  handleGroup(event) {
    this.setState({ selectedGroup: event.target.value });
    this.getOfficesGroup(event.target.value);
  }

  handleOffice(event) {
    this.setState({ selectedOffice: event.target.value });
    this.getTableData(this.state.selectedGroup, event.target.value);
  }

  getOfficesGroup(selectedGroup) {
    let availableOffices = this.state.offices.filter(
      (x) => x.parent === selectedGroup
    );
    availableOffices = availableOffices.sort((a, b) => {
      if (parseInt(a.order) > parseInt(b.order)) return 1;
      if (parseInt(a.order) < parseInt(b.order)) return -1;
      return a.descricao.localeCompare(b.descricao);
    });
    this.setState({ availableOffices });
  }

  getTableData(selectedGroup, selectedOffice) {
    let data = this.state.data[selectedOffice];
    let tabledata = [];
    data.forEach((x) => {
      let columns = [
        x.val()["nome"],
        x.val()["telefone1"],
        x.val()["telefone2"],
        x.val()["comum"],
      ];

      if (listFunctions.includes(selectedOffice))
        columns.push(x.val()["cargo"]);

      columns.push(
        <div key={x.key}>
          <a
            href={`/admin/editar-contato/${this.state.administracaoSelecionada}/${selectedGroup}/${selectedOffice}/${x.key}`}
          >
            Editar
          </a>{" "}
          |{" "}
          <a
            href="#"
            type="button"
            onClick={() => this.handleDelete(selectedGroup, selectedOffice, x)}
          >
            Excluir
          </a>
        </div>
      );
      tabledata.push(columns);
    });
    this.setState({ tabledata });
  }

  getMenuItemGroup() {
    return this.state.groups.map((group) => (
      // eslint-disable-next-line react/jsx-key
      <MenuItem key={group.key} value={group.key}>
        {group.descricao}
      </MenuItem>
    ));
  }

  getMenuItemOffice() {
    return this.state.availableOffices.map((office) => (
      // eslint-disable-next-line react/jsx-key
      <MenuItem key={office.key} value={office.key}>
        {office.descricao}
      </MenuItem>
    ));
  }

  render() {
    let columns = ["Nome", "Telefone 1", "Telefone 2", "Comum"];
    if (listFunctions.includes(this.state.selectedGroup)) columns.push("Cargo");
    columns.push("");

    return (
      <div>
        <Backdrop styles={styles.backdrop} open={this.state.loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <GridContainer>
          <GridItem xs={12} sm={12} md={3}>
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
          <GridItem xs={12} sm={12} md={3}>
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
          <GridItem xs={12} sm={12} md={3}>
            <FormControl style={styles.formControl}>
              <InputLabel id="select">Cargo</InputLabel>
              <Select
                labelId="select"
                id="select"
                value={this.state.selectedOffice}
                onChange={(event) => this.handleOffice(event)}
              >
                {this.getMenuItemOffice()}
              </Select>
            </FormControl>
          </GridItem>
          <GridItem xs={12} sm={12} md={2}>
            <Button type="button" color="info" onClick={this.handleNew}>
              Adicionar Novo Contato
            </Button>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            {this.state.selectedOffice.length > 0 && (
              <Card>
                <CardBody>
                  <Table
                    tableHeaderColor="primary"
                    tableHead={columns}
                    tableData={this.state.tabledata}
                  />
                  {this.state.tabledata.length === 0 && (
                    <p>Sem voluntário cadastrados para essa função</p>
                  )}
                </CardBody>
              </Card>
            )}
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default ContactsList;
