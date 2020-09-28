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
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Snackbar from "@material-ui/core/Snackbar";
import moment from "moment";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import DateFnsUtils from "@date-io/date-fns";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from "@material-ui/pickers";

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
    width: "100% !important",
  },
};

const useStyles = makeStyles(styles);

const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const today = new Date();

export default function AgendasForm(props) {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [success, setSucess] = React.useState(false);
  const [errors, setErrors] = React.useState([]);
  const [id, setId] = React.useState(null);
  const [month, setMonth] = React.useState(monthNames[today.getMonth()]);
  const [name, setName] = React.useState("");
  const [place, setPlace] = React.useState("");
  const [date, setDate] = React.useState(today);
  const [time, setTime] = React.useState(moment(today).format("HH:mm"));
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState("ministeriais");

  React.useEffect(() => {
    async function fetchAgenda() {
      let id = props.match.params.id;
      let month = props.match.params.month;
      let type = props.match.params.type;

      if (id === undefined) {
        setLoading(false);
        return;
      }
      setId(id);
      setMonth(month);
      setType(type);

      let snapshot = await firebase
        .database()
        .ref(`/agendas/${type}/${month}/${id}`)
        .once("value");

      setName(snapshot.val()["name"]);
      setPlace(snapshot.val()["place"]);
      setDate(
        moment(
          `${snapshot.val()["date"]} ${snapshot.val()["time"]}`,
          "YYYY-MM-DD HH:mm"
        )
      );
      setTime(snapshot.val()["time"]);
      setDescription(snapshot.val()["description"]);
      setLoading(false);
    }

    fetchAgenda();
  }, [
    props.match.params.id,
    props.match.params.month,
    props.match.params.type,
  ]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleType = (event) => {
    setType(event.target.value);
  };

  const handlePlaceChange = (event) => {
    setPlace(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleDateChange = (new_date) => {
    setTime(moment(new_date).format("HH:mm"));
    setDate(new_date);
    setMonth(monthNames[new_date.getMonth()]);
  };

  const handleClose = () => {
    setErrors([]);
    setSucess(false);
  };

  const handleNew = (event) => {
    event.preventDefault();
    window.location.pathname = "/admin/nova-reuniao";
  };

  const validate = () => {
    let validations = [];
    if (name === "") validations.push("Nome é obrigatório.");
    if (place === "") validations.push("Local é obrigatório.");
    if (date === "") validations.push("Data da reunião é obrigatório.");
    if (time === "") validations.push("Horário da reunião é obrigatório.");

    setErrors(validations);
    return validations.length > 0;
  };

  const saveAgenda = async () => {
    if (validate()) return;
    setLoading(true);
    try {
      let agenda = {
        name: name,
        place: place,
        date: moment(date).format("YYYY-MM-DD"),
        time: time,
        description: description,
      };

      if (id === null)
        await firebase
          .database()
          .ref(`/agendas/${type}/${month}`)
          .push()
          .set(agenda);
      else
        await firebase
          .database()
          .ref(`/agendas/${type}/${month}/${id}`)
          .update(agenda);
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
              <h4 className={classes.cardTitleWhite}>Informações da Reunião</h4>
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
                    labelText="Local"
                    id="place"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      value: place,
                      onChange: handlePlaceChange,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      className={classes.formControl}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Date picker inline"
                      value={date}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                      className={classes.formControl}
                      ampm={false}
                      margin="normal"
                      id="time-picker"
                      label="Time picker"
                      value={date}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change time",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <TextField
                    className={classes.formControl}
                    id="standard-multiline-flexible"
                    label="Detalhes Reunião"
                    multiline
                    rowsMax={4}
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="select">Agenda</InputLabel>
                    <Select
                      labelId="select"
                      id="select"
                      value={type}
                      onChange={handleType}
                    >
                      <MenuItem value="ministeriais">
                        Agenda Ministerial
                      </MenuItem>
                      <MenuItem value="musicais">Agenda Musical</MenuItem>
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
              <Button color="primary" onClick={saveAgenda}>
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
