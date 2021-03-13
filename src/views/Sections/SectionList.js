import React from "react";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
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

class SectionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      administracoes: [],
      adminitracaoSelecionada: "",
      groups: [],
      jobs: [],
    };
  }

  componentDidMount() {
    this.loadAdministracoes();
  }

  handleNew(event) {
    event.preventDefault();
    window.location.pathname = "/admin/nova-secao";
  }

  async handleDelete(section) {
    if (window.confirm(`Deseja excluir a seção ${section.val()["descricao"]}?`)) {
      
      let administracao = this.state.adminitracaoSelecionada;
      let jobs = this.getJobsGroup(section.key);
      
      jobs.forEach((job) => {
        job.snapshot.forEach((voluntary) => {
          if (voluntary.key === "descricao" || voluntary.key === "order") return;
          let links = voluntary.val()["links"];
          Object.keys(links).forEach((key) => {
            if (links[key].startsWith(`/lista-telefones/${job.parent}/${job.key}`)) {
              firebase
                .database()
                .ref(`/regionais/ribeirao-preto/dados/${administracao}/voluntarios/${voluntary.key}/links/${key}`)
                .remove();
            }
          });
        });
      });

      firebase
        .database()
        .ref(`/regionais/ribeirao-preto/dados/${administracao}/lista-telefones/${section.key}`)
        .remove();
      
      await this.loadSections(administracao);
    }
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
    this.setState({ adminitracaoSelecionada: event.target.value });
    this.loadSections(event.target.value);
  }

  getJobsGroup(selectedGroup) {
    let availableJobs = this.state.jobs.filter(
      (x) => x.parent === selectedGroup
    );

    return availableJobs;
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

  async loadSections(administracao) {
    let jobs = [];
    let groups = [];

    this.setState({ loading: true });

    let entity = await firebase
      .database()
      .ref(`/regionais/ribeirao-preto/dados/${administracao}/lista-telefones`)
      .once("value");
    entity.forEach((element) => {
      
      groups.push([
        element.val()["descricao"],
        <div key={element.key}>
          <a href={`/admin/editar-secao/${administracao}/${element.key}`}>Editar</a> |{" "}
          <a href="#" type="button" onClick={() => this.handleDelete(element)}>
            Excluir
          </a>
        </div>,
        element.val()["order"] ? element.val()["order"] : Number.MAX_SAFE_INTEGER,
      ]);

      element.forEach((group) => {
        if (group.key !== "descricao" && group.key !== "order") {
          jobs.push({
            parent: element.key,
            key: group.key,
            snapshot: group,
            descricao: group.val()["descricao"],
            order: group.val()["order"]
              ? group.val()["order"]
              : Number.MAX_SAFE_INTEGER,
          });
        }
      });
    });

    groups.sort(function (a, b) {
      if (parseInt(a[2]) > parseInt(b[2])) return 1;
      if (parseInt(a[2]) < parseInt(b[2])) return -1;
      return a[0] > b[0] ? 1 : -1;
    });
    groups = groups.map((x) => x.slice(0, -1));

    this.setState({ jobs, groups, loading: false });
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
        <GridItem xs={12} sm={12} md={5}>
          <FormControl style={styles.formControl}>
            <InputLabel id="select">Administração</InputLabel>
            <Select
              labelId="select"
              id="select"
              value={this.state.adminitracaoSelecionada}
              onChange={(event) => this.handleAdministracao(event)}
            >
              {this.getMenuItemAdministracao()}
            </Select>
          </FormControl>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          {this.state.groups.length > 0 && (
            <Card>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Nome", ""]}
                  tableData={this.state.groups}
                />
              </CardBody>
            </Card>
          )}
        </GridItem>
      </GridContainer>
    );
  }
}

export default SectionList;
