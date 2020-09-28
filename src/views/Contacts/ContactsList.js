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
      selectedGroup: "",
      groups: [],
      data: {},
      tabledata: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.loadContacts();
  }

  handleNew(event) {
    event.preventDefault();
    window.location.pathname = "/admin/novo-contato";
  }

  async handleDelete(group, contact) {
    if (window.confirm(`Deseja excluir o irmão ${contact.val()["nome"]}?`)) {
      firebase
        .database()
        .ref(`/voluntarios/${contact.key}/links`)
        .orderByValue()
        .equalTo(`/lista-telefones/${group}`)
        .once("value", function (x) {
          let keys = Object.keys(x.val());
          keys.forEach((x) =>
            firebase
              .database()
              .ref(`/voluntarios/${contact.key}/links/${x}`)
              .remove()
          );
        });

      firebase
        .database()
        .ref(`/lista-telefones/${group}/${contact.key}`)
        .remove();
      await this.loadContacts();
      this.getTableData(group);
    }
  }

  async loadContacts() {
    this.setState({ loading: true });
    let groups = [];
    let data = {};
    let entity = await firebase
      .database()
      .ref(`/lista-telefones`)
      .once("value");
    entity.forEach((element) => {
      groups.push({ key: element.key, descricao: element.val()["descricao"] });
      data[element.key] = [];
      element.forEach((contact) => {
        if (contact.key !== "descricao") data[element.key].push(contact);
      });

      groups.sort(function (a, b) {
        return a.descricao > b.descricao ? 1 : -1;
      });

      data[element.key] = data[element.key].sort((a, b) =>
        a.val().nome > b.val().nome ? 1 : -1
      );
    });

    this.setState({ groups, data, loading: false });
  }

  handleGroup(event) {
    this.setState({ selectedGroup: event.target.value });
    this.getTableData(event.target.value);
  }

  getTableData(selectedGroup) {
    let data = this.state.data[selectedGroup];
    let tabledata = [];
    data.forEach((x) => {
      let columns = [
        x.val()["nome"],
        x.val()["telefone1"],
        x.val()["telefone2"],
        x.val()["comum"],
      ];

      if (listFunctions.includes(selectedGroup)) columns.push(x.val()["cargo"]);

      columns.push(
        <div key={x.key}>
          <a
            href="#"
            type="button"
            onClick={() => this.handleDelete(selectedGroup, x)}
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
          <GridItem xs={12} sm={12} md={9}>
            <FormControl style={styles.formControl}>
              <InputLabel id="select">Grupo</InputLabel>
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
          <GridItem xs={12} sm={12} md={2}>
            <Button type="button" color="info" onClick={this.handleNew}>
              Adicionar Novo Contato
            </Button>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            {this.state.selectedGroup.length > 0 && (
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
