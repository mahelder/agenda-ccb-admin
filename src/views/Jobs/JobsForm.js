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

const useStyles = makeStyles(styles);

export default function JobsForm(props) {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [success, setSucess] = React.useState(false);
  const [errors, setErrors] = React.useState([]);
  const [id, setId] = React.useState(null);
  const [descricao, setDescricao] = React.useState("");
  const [ordem, setOrdem] = React.useState("");
  const [groups, setGroups] = React.useState([]);
  const [group, setGroup] = React.useState("");

  React.useEffect(() => {
    async function fetchJob() {
      let id = props.match.params.id;
      let secao = props.match.params.secao;

      let entity = await firebase
        .database()
        .ref(`/lista-telefones`)
        .once(`value`);

      let groups = [];

      entity.forEach((element) => {
        groups.push({
          key: element.key,
          descricao: element.val()["descricao"],
        });
      });

      setGroups(groups);
      if (id !== undefined && secao !== undefined) {
        setId(id);
        setGroup(secao);

        let snapshot = await firebase
          .database()
          .ref(`/lista-telefones/${secao}/${id}`)
          .once("value");

        setDescricao(snapshot.val()["descricao"]);

        if (snapshot.val()["order"]) {
          setOrdem(snapshot.val()["order"]);
        }
      }

      setLoading(false);
    }

    fetchJob();
  }, [props.match.params.id, props.match.params.secao]);

  const getMenuItemGroup = () => {
    return groups.map((group) => (
      // eslint-disable-next-line react/jsx-key
      <MenuItem key={group.key} value={group.key}>
        {group.descricao}
      </MenuItem>
    ));
  };

  const handleGroupChange = (event) => {
    setGroup(event.target.value);
  };

  const handleDescricaoChange = (event) => {
    setDescricao(event.target.value);
  };

  const handleOrdemChange = (event) => {
    setOrdem(event.target.value);
  };

  const handleClose = () => {
    setErrors([]);
    setSucess(false);
  };

  const handleNew = (event) => {
    event.preventDefault();
    window.location.pathname = "/admin/novo-cargo";
  };

  const validate = () => {
    let validations = [];
    if (descricao === "") validations.push("Nome é obrigatório.");
    if (group === "") validations.push("Seção é obrigatório.");

    setErrors(validations);
    return validations.length > 0;
  };

  const saveJob = async () => {
    if (validate()) return;
    setLoading(true);
    try {
      let job = {
        descricao: descricao,
        order: ordem,
      };

      if (id === null) {
        await firebase
          .database()
          .ref(`/lista-telefones/${group}`)
          .push()
          .set(job);
      } else {
        await firebase
          .database()
          .ref(`/lista-telefones/${group}/${id}`)
          .update(job);
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
                  <CustomInput
                    labelText="Descrição"
                    id="descricao"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      value: descricao,
                      onChange: handleDescricaoChange,
                      required: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Ordem"
                    id="ordem"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      value: ordem,
                      onChange: handleOrdemChange,
                      type: "number",
                    }}
                  />
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
              <Button color="primary" onClick={saveJob}>
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
