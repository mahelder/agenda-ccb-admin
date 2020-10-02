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

class UsersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    this.loadUsers();
  }

  handleNew(event) {
    event.preventDefault();
    window.location.pathname = "/admin/novo-usuario";
  }

  handleDelete(user) {
    if (window.confirm(`Deseja excluir o usuário ${user.val()}?`)) {
      firebase.database().ref(`/users/${user.key}`).remove();
      this.loadUsers();
    }
  }

  async loadUsers() {
    let users = [];
    let entity = await firebase.database().ref(`/users`).once("value");
    entity.forEach((element) => {
      users.push([
        element.val(),
        <div key={element.key}>
          <a href="#" type="button" onClick={() => this.handleDelete(element)}>
            Excluir
          </a>
        </div>,
      ]);
    });
    this.setState({ users });
  }

  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Button type="button" color="info" onClick={this.handleNew}>
            Adicionar
          </Button>
          <Card>
            <CardBody>
              {this.state.users.length > 0 && (
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Email", ""]}
                  tableData={this.state.users}
                />
              )}
              {this.state.users.length === 0 && <CircularProgress />}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default UsersList;
