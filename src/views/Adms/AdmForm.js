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

export default function AdmForm(props) {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [success, setSucess] = React.useState(false);
  const [errors, setErrors] = React.useState([]);
  const [id, setId] = React.useState(null);
  const [descricao, setDescricao] = React.useState("");
  // const [ordem, setOrdem] = React.useState("");
  // const [administracoes, setAdministracoes] = React.useState([]);
  // const [administracao, setAdministracao] = React.useState("");

  React.useEffect(() => {
    
    async function fetchAdministracao() {
      let id = props.match.params.id;

      if (id !== undefined) {
        setId(id);
        let entity = await firebase
          .database()
          .ref(`/regionais/ribeirao-preto/administracoes/${id}`)
          .once(`value`);
        
        setDescricao(entity.val());
      }
      setLoading(false);
    }

    fetchAdministracao();
  }, [props.match.params.id]);

  const handleDescricaoChange = (event) => {
    setDescricao(event.target.value);
  };

  // const handleOrdemChange = (event) => {
  //   setOrdem(event.target.value);
  // };

  const handleClose = () => {
    setErrors([]);
    setSucess(false);
  };

  const handleNew = (event) => {
    event.preventDefault();
    window.location.pathname = "/admin/nova-administracao";
  };

  const validate = () => {
    let validations = [];
    if (descricao === "") validations.push("Nome é obrigatório.");

    setErrors(validations);
    return validations.length > 0;
  };

  const saveJob = async () => {
    if (validate()) return;
    setLoading(true);
    try {
      let job = {
        descricao: descricao,
        // order: ordem,
      };

      if (id === null) {
        let push = await firebase
          .database()
          .ref(`/regionais/ribeirao-preto/administracoes`)
          .push();
        
        let id = push.key;

        await firebase
          .database()
          .ref(`/regionais/ribeirao-preto/administracoes/${id}`)
          .set(descricao);

        await firebase
          .database()
          .ref(`/regionais/ribeirao-preto/dados/${id}`)
          .set(job);

      } else {

        console.log("teste")
        
        await firebase
          .database()
          .ref(`/regionais/ribeirao-preto/administracoes/${id}`)
          .set(descricao);

        console.log("teste")

        await firebase
          .database()
          .ref(`/regionais/ribeirao-preto/dados/${id}`)
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
                {/* <GridItem xs={12} sm={12} md={6}>
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
                </GridItem> */}
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
