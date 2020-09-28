import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <a href="/admin/casas-de-oracao">
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Icon>location_city</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Casas de Oração</p>
              </CardHeader>
            </Card>
          </a>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <a href="/admin/lista-telefones">
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <Icon>list</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Lista de Telefones</p>
              </CardHeader>
            </Card>
          </a>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <a href="/admin/voluntarios">
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Icon>person</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Voluntários</p>
              </CardHeader>
            </Card>
          </a>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <a href="/admin/reunioes">
            <Card>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <Icon>calendar_today</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Reuniões</p>
              </CardHeader>
            </Card>
          </a>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <a href="/admin/cargos">
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Icon>work</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Cargos e Funções</p>
              </CardHeader>
            </Card>
          </a>
        </GridItem>
      </GridContainer>
    </div>
  );
}
