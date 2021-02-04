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

import defaultImage from "assets/img/sem_imagem.jpg";
import ChurchesCults from "views/Churches/ChurchesCults.js";
import ChurchesRehearsals from "views/Churches/ChurchesRehearsals.js";
// import ChurchesMinisters from "views/Churches/ChurchesMinisters.js";
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
};

const useStyles = makeStyles(styles);

export default function ChurchesForm(props) {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [success, setSucess] = React.useState(false);
  const [errors, setErrors] = React.useState([]);
  const [file, setFile] = React.useState(null);
  const [id, setId] = React.useState(null);
  const [img, setImg] = React.useState(defaultImage);
  const [name, setName] = React.useState("");
  const [place, setPlace] = React.useState("");
  const [cults, setCults] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [rehearsals, setRehearsals] = React.useState("");
  const [ordem, setOrdem] = React.useState("");
  const [churchCode, setChurchCode] = React.useState("");
  const [rehearsalsDescription, setRehearsalsDescription] = React.useState("");
  // const [ministers, setMinisters] = React.useState(null);

  React.useEffect(() => {
    async function fetchChurch() {
      let id = props.match.params.id;
      if (id === undefined) {
        setLoading(false);
        return;
      }
      setId(id);
      let snapshot = await firebase
        .database()
        .ref(`/churches/${id}`)
        .once("value");

      setName(snapshot.val()["name"]);
      setPlace(snapshot.val()["place"]);
      // setMinisters(snapshot.val()["ministers"]);

      if (snapshot.val()["rehearsals"]) {
        setRehearsals(snapshot.val()["rehearsals"]["weekDay"]);
        setRehearsalsDescription(snapshot.val()["rehearsals"]["description"]);
      }

      if (snapshot.val()["order"]) {
        setOrdem(snapshot.val()["order"]);
      }

      if (snapshot.val()["code"]) {
        setChurchCode(snapshot.val()["code"]);
      }

      setCults(snapshot.val()["cults"]);
      setLocation(snapshot.val()["location"]);
      setImg(snapshot.val()["imgUrl"]);
      setLoading(false);
    }

    fetchChurch();
  }, [props.match.params.id]);

  const selectNewImage = () => {
    document.getElementById("my_file").click();
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePlaceChange = (event) => {
    setPlace(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleOrdemChange = (event) => {
    setOrdem(event.target.value);
  };

  const handleCodeChange = (event) => {
    setChurchCode(event.target.value);
  };

  const handleClose = () => {
    setErrors([]);
    setSucess(false);
  };

  const handleImageChange = (event) => {
    event.preventDefault();

    let reader = new FileReader();
    let file = event.target.files[0];

    reader.onloadend = () => {
      setImg(reader.result);
      setFile(file);
    };

    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (file) {
      try {
        var storageRef = firebase.storage().ref().child(`images/${file.name}`);
        await storageRef.put(file);
        let path = await storageRef.getDownloadURL();
        return path;
      } catch (error) {
        console.log(error);
      }
    } else {
      return img;
    }
  };

  const handleNew = (event) => {
    event.preventDefault();
    window.location.pathname = "/admin/nova-casa-de-oracao";
  };

  const validate = () => {
    let validations = [];
    if (name === "") validations.push("Bairro é obrigatório.");
    if (place === "") validations.push("Cidade é obrigatório.");
    if (cults === "") validations.push("Dias de culto é obrigatório.");
    // if (rehearsals === "") validations.push("Dia do ensaio é obrigatório.");
    // if (rehearsalsDescription === "")
    //   validations.push("Descreva a semana do ensaio.");
    // if (ministers === null)
    //   validations.push("Selecione o ministério dessa casa de oração.");

    setErrors(validations);
    return validations.length > 0;
  };

  const saveChurch = async () => {
    if (validate()) return;
    setLoading(true);
    try {
      let path = await uploadImage();
      let church = {
        name: name,
        place: place,
        // ministers: ministers,
        cults: cults,
        location: location,
        order: ordem,
        code: churchCode,
        rehearsals: {
          weekDay: rehearsals,
          description: rehearsalsDescription,
        },
        imgUrl: path,
      };
      if (id === null)
        await firebase.database().ref("/churches").push().set(church);
      else await firebase.database().ref(`/churches/${id}`).update(church);
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
              <h4 className={classes.cardTitleWhite}>
                Informações da Casa de Oração
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Bairro"
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
                    labelText="Cidade"
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
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Link Localização"
                    id="location"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      value: location,
                      onChange: handleLocationChange,
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
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Código Casa de Oração"
                    id="code"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      value: churchCode,
                      onChange: handleCodeChange,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <ChurchesCults callback={setCults} cults={cults} />
              <ChurchesRehearsals
                callback={setRehearsals}
                rehearsals={rehearsals}
                callbackDescription={setRehearsalsDescription}
                rehearsalsDescription={rehearsalsDescription}
              />
              {/* <ChurchesMinisters
                callback={setMinisters}
                ministers={ministers}
              /> */}
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
                  Erros ao salvar casa de oração
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
              <Button color="primary" onClick={saveChurch}>
                Salvar
              </Button>
              <Button type="button" color="info" onClick={handleNew}>
                Adicionar localidade
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <a href="#" onClick={() => selectNewImage()}>
            <img src={img} alt="church" width="300" height="300" />
            <input
              type="file"
              id="my_file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageChange(e)}
            />
          </a>
        </GridItem>
      </GridContainer>
    </div>
  );
}
