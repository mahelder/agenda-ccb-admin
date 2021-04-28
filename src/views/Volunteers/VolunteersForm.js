/* eslint-disable react/prop-types */
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Snackbar from "@material-ui/core/Snackbar";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
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
    paddingTop: "27px !important",
  },
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const useStyles = makeStyles(styles);

export default function VolunteersForm(props) {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [success, setSucess] = React.useState(false);
  const [errors, setErrors] = React.useState([]);
  const [id, setId] = React.useState(null);
  const [name, setName] = React.useState("");
  const [phone1, setPhone1] = React.useState("");
  const [phone2, setPhone2] = React.useState("");
  const [common, setCommon] = React.useState("");
  const [secondaryCommons, setSecondaryCommons] = React.useState([]);
  const [links, setLinks] = React.useState({});
  const [churches, setChurches] = React.useState([]);

  React.useEffect(() => {
    async function fetchVoluntary() {
      let id = props.match.params.id;
      if (id === undefined) {
        setLoading(false);
        return;
      }
      setId(id);
      let snapshot = await firebase
        .database()
        .ref(`/voluntarios/${id}`)
        .once("value");

      setName(snapshot.val()["nome"]);
      setPhone1(snapshot.val()["telefone1"]);
      setPhone2(snapshot.val()["telefone2"]);
      setCommon(snapshot.val()["comum"]);
      if (snapshot.val()["outrasComuns"] !== undefined) {
        setSecondaryCommons(snapshot.val()["outrasComuns"].split(","));
      }
      setLinks(snapshot.val()["links"]);
      setLoading(false);
    }

    async function fetchChurches() {
      let snapshot = await firebase.database().ref(`/churches`).once("value");
      let churches = [];
      snapshot.forEach((x) => {
        churches.push({ name: x.val()["name"], place: x.val()["place"] });
      });

      setChurches(churches);
    }

    fetchChurches();
    fetchVoluntary();
  }, [props.match.params.id]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePhone1Change = (event) => {
    setPhone1(event.target.value);
  };

  const handlePhone2Change = (event) => {
    setPhone2(event.target.value);
  };

  const handleCommonChange = (event) => {
    setCommon(event.target.value);
  };

  const handleSecondaryCommonsChange = (event) => {
    setSecondaryCommons(event.target.value);
  };

  const getMenuItemChurches = () => {
    return churches.map((x, index) => {
      // eslint-disable-next-line react/jsx-key
      if (x.place !== "Franca - SP") {
        return (
          <MenuItem key={index} value={`${x.name} / ${x.place}`}>
            {`${x.name} / ${x.place}`}
          </MenuItem>
        );
      }
      return (
        <MenuItem key={index} value={x.name}>
          {x.name}
        </MenuItem>
      );
    });
  };

  const getMenuItemChurchesMultiple = () => {
    return churches.map((x, index) => {
      // eslint-disable-next-line react/jsx-key
      if (x.place !== "Franca - SP") {
        return (
          <MenuItem key={index} value={`${x.name} / ${x.place}`}>
            <Checkbox
              checked={secondaryCommons.indexOf(`${x.name} / ${x.place}`) > -1}
            />
            <ListItemText primary={`${x.name} / ${x.place}`} />
          </MenuItem>
        );
      }
      return (
        <MenuItem key={index} value={x.name}>
          <Checkbox checked={secondaryCommons.indexOf(`${x.name}`) > -1} />
          <ListItemText primary={`${x.name}`} />
        </MenuItem>
      );
    });
  };

  const handleClose = () => {
    setErrors([]);
    setSucess(false);
  };

  const handleNew = (event) => {
    event.preventDefault();
    window.location.pathname = "/admin/novo-voluntario";
  };

  const validate = () => {
    let validations = [];
    if (name === "") validations.push("Nome é obrigatório.");
    if (phone1 === "") validations.push("Telefone é obrigatório.");
    if (common === "") validations.push("Comum é obrigatório.");

    setErrors(validations);
    return validations.length > 0;
  };

  const saveVoluntary = async () => {
    if (validate()) return;
    setLoading(true);
    try {
      let voluntary = {
        nome: name,
        telefone1: phone1,
        telefone2: phone2,
        comum: common,
        outrasComuns: secondaryCommons.join(","),
        links: links !== undefined ? links : null,
      };

      if (id === null) {
        await firebase.database().ref(`/voluntarios`).push().set(voluntary);
      } else {
        await firebase.database().ref(`/voluntarios/${id}`).update(voluntary);
        for (let i in links) {
          await firebase.database().ref(`/${links[i]}`).set(voluntary);
        }
      }
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
                  <CustomInput
                    labelText="Nome"
                    id="name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      value: name,
                      onChange: handleNameChange,
                      required: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Telefone"
                    id="phone"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      value: phone1,
                      onChange: handlePhone1Change,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Telefone"
                    id="phone2"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      value: phone2,
                      onChange: handlePhone2Change,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="select">Comum Congregação</InputLabel>
                    <Select
                      labelId="select"
                      id="select"
                      value={common}
                      onChange={handleCommonChange}
                    >
                      {getMenuItemChurches()}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="select">
                      Outras Comuns Congregação
                    </InputLabel>
                    <Select
                      labelId="select"
                      id="select"
                      multiple
                      value={secondaryCommons}
                      onChange={handleSecondaryCommonsChange}
                      renderValue={(selected) => selected.join(", ")}
                      input={<Input />}
                      MenuProps={MenuProps}
                    >
                      {getMenuItemChurchesMultiple()}
                    </Select>
                  </FormControl>
                </GridItem>
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
              <Button color="primary" onClick={saveVoluntary}>
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
