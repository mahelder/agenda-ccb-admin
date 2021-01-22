import React from "react";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { CircularProgress } from "@material-ui/core";

import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Icon from "@material-ui/core/Icon";

import slugify from "utils/slugify";

import firebase from "firebase";

class VolunteersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volunteers: [],
      volunteersShow: [],
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    this.loadVolunteers();
  }

  handleNew(event) {
    event.preventDefault();
    window.location.pathname = "/admin/novo-voluntario";
  }

  handleDelete(voluntary) {
    if (window.confirm(`Deseja excluir o irmão ${voluntary.val()["nome"]}?`)) {
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
    volunteers = volunteers.sort((a, b) => a[0].localeCompare(b[0]));
    this.setState({ volunteers, volunteersShow: volunteers });
  }

  handleSearchChange(event) {
    let { volunteersShow, volunteers, search } = this.state;
    search = event.target.value;
    volunteersShow = volunteers.filter((x) =>
      slugify(x[0].toLowerCase()).includes(slugify(search.toLowerCase()))
    );
    this.setState({ volunteersShow, search });
  }

  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Button type="button" color="info" onClick={this.handleNew}>
            Adicionar
          </Button>
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
          <Card>
            <CardBody>
              {this.state.volunteersShow.length > 0 && (
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
              )}
              {this.state.volunteersShow.length === 0 &&
                this.state.volunteers.length === 0 && <CircularProgress />}

              {this.state.volunteersShow.length === 0 &&
                this.state.volunteers.length > 0 && (
                  <p>Sem voluntários cadastrados</p>
                )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default VolunteersList;
