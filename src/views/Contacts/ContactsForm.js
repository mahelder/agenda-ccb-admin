/* eslint-disable react/prop-types */
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Snackbar from "@material-ui/core/Snackbar";

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
};

const useStyles = makeStyles(styles);

const listFunctions = [
  "administracao",
  "administracao-patrocinio-paulista",
  "colaboradores-administracao-patrocinio-paulista",
  "conselho-fiscal-patrocinio-paulista",
  "conselho-fiscal",
];

export default function ContactsForm() {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [success, setSucess] = React.useState(false);
  const [errors, setErrors] = React.useState([]);
  const [groups, setGroups] = React.useState([]);
  const [volunteers, setVolunteers] = React.useState([]);
  const [office, setOffice] = React.useState("");
  const [voluntary, setVoluntary] = React.useState("");
  const [group, setGroup] = React.useState("");
  const [offices, setOffices] = React.useState([]);
  const [availableOffices, setAvailableOffices] = React.useState([]);
  const [officeGroup, setOfficeGroup] = React.useState("");

  React.useEffect(() => {
    async function loadGroups() {
      let groups = [];
      let offices = [];
      let persons = [];

      let entity = await firebase
        .database()
        .ref(`/lista-telefones`)
        .once("value");

      entity.forEach((element) => {
        groups.push({
          key: element.key,
          descricao: element.val()["descricao"],
        });
        element.forEach((office) => {
          offices.push({
            parent: element.key,
            key: office.key,
            descricao: office.val()["descricao"],
          });
        });
      });

      let entity_volunteers = await firebase
        .database()
        .ref("/voluntarios")
        .orderByChild("nome")
        .once("value");

      entity_volunteers.forEach((element) => {
        persons.push(element);
      });

      groups.sort(function (a, b) {
        return a.descricao > b.descricao ? 1 : -1;
      });

      offices.sort(function (a, b) {
        return a.descricao > b.descricao ? 1 : -1;
      });

      setGroups(groups);
      setOffices(offices);
      setVolunteers(persons);
      setLoading(false);
    }

    loadGroups();
  }, []);

  const getMenuItemGroup = () => {
    return groups.map((group) => (
      // eslint-disable-next-line react/jsx-key
      <MenuItem key={group.key} value={group.key}>
        {group.descricao}
      </MenuItem>
    ));
  };

  const getMenuItemOfficeGroup = () => {
    return availableOffices.map((office) => (
      // eslint-disable-next-line react/jsx-key
      <MenuItem key={office.key} value={office.key}>
        {office.descricao}
      </MenuItem>
    ));
  };

  const getMenuItemVoluntary = () => {
    let filtered = volunteers.filter((x) => x.val()["nome"] !== undefined);
    return filtered.map((x) => (
      // eslint-disable-next-line react/jsx-key
      <MenuItem key={x.key} value={x.key}>
        {x.val()["nome"]}
      </MenuItem>
    ));
  };

  const getMenuItemOffice = () => {
    let offices = [
      "Presidente",
      "Vice-Presidente",
      "Secretário",
      "1º Vice-Secretário",
      "2º Vice-Secretário",
      "3º Vice-Secretário",
      "Tesoureiro",
      "Vice-Tesoureiro",
      "Auxiliar",
      "Contador",
      "Informática",
      "Colaborador",
      "Suplente",
      "Titular",
      "Procurador",
    ];
    return offices.map((x) => (
      // eslint-disable-next-line react/jsx-key
      <MenuItem value={x}>{x}</MenuItem>
    ));
  };

  const handleGroupChange = (event) => {
    setGroup(event.target.value);
    getAvailableOfficeGroup(event.target.value);
  };

  const handleVoluntaryChange = (event) => {
    setVoluntary(event.target.value);
  };

  const handleOfficeGroupChange = (event) => {
    setOfficeGroup(event.target.value);
  };

  const getAvailableOfficeGroup = (selectedGroup) => {
    let availables = offices.filter((x) => x.parent === selectedGroup);
    setAvailableOffices(availables);
  };

  const handleOfficeChange = (event) => {
    setOffice(event.target.value);
  };

  const handleClose = () => {
    setErrors([]);
    setSucess(false);
  };

  const handleNew = (event) => {
    event.preventDefault();
    window.location.pathname = "/admin/novo-contato";
  };

  const validate = () => {
    let validations = [];
    if (voluntary === "") validations.push("Voluntário é obrigatório.");
    if (group === "") validations.push("Seção é obrigatório.");
    if (officeGroup === "") validations.push("Cargo/Função é obrigatório.");

    setErrors(validations);
    return validations.length > 0;
  };

  const saveContact = async () => {
    if (validate()) return;
    setLoading(true);
    try {
      let contact = volunteers.filter((x) => x.key === voluntary)[0].val();
      if (contact.links === undefined) {
        contact.links = {};
      }
      contact.links[
        `${officeGroup}`
      ] = `/lista-telefones/${group}/${officeGroup}`;

      await firebase
        .database()
        .ref(`/lista-telefones/${group}/${officeGroup}/${voluntary}`)
        .update(contact);

      await firebase
        .database()
        .ref(`/voluntarios/${voluntary}/links/${officeGroup}`)
        .set(`/lista-telefones/${group}/${officeGroup}`);
    } catch (error) {
      setErrors([error]);
    }

    setLoading(false);
    setSucess(true);
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Informações</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="select">Seção</InputLabel>
                    <Select
                      labelId="select"
                      id="select"
                      value={group}
                      onChange={handleGroupChange}
                    >
                      {getMenuItemGroup()}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="select">Cargo/Função</InputLabel>
                    <Select
                      labelId="select"
                      id="select"
                      value={officeGroup}
                      onChange={handleOfficeGroupChange}
                    >
                      {getMenuItemOfficeGroup()}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="select">Voluntário</InputLabel>
                    <Select
                      labelId="select"
                      id="select"
                      value={voluntary}
                      onChange={handleVoluntaryChange}
                    >
                      {getMenuItemVoluntary()}
                    </Select>
                  </FormControl>
                </GridItem>
                {listFunctions.includes(availableOffices) && (
                  <GridItem xs={12} sm={12} md={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="select">Cargo</InputLabel>
                      <Select
                        labelId="select"
                        id="select"
                        value={office}
                        onChange={handleOfficeChange}
                      >
                        {getMenuItemOffice()}
                      </Select>
                    </FormControl>
                  </GridItem>
                )}
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
              </Backdrop>
              <Dialog
                onClose={handleClose}
                aria-labelledby="simple-dialog-title"
                open={errors.length > 0}
              >
                <DialogTitle id="simple-dialog-title">
                  Erros ao salvar informações
                </DialogTitle>
                <List>
                  {errors.map((error, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={error} />
                    </ListItem>
                  ))}
                </List>
              </Dialog>
              <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Sucesso ao salvar alterações!"
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              />
              <Button color="primary" onClick={saveContact}>
                Salvar
              </Button>
              <Button type="button" color="info" onClick={handleNew}>
                Adicionar
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
