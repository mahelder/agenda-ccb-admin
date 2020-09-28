/* eslint-disable react/prop-types */
import React from "react";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";

import firebase from "firebase";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
}));

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

export default function ChurchesMinisters(props) {
  const classes = useStyles();
  const [churchMinisters, setChurchMinisters] = React.useState([]);
  const [ministers, setMinisters] = React.useState([]);

  React.useEffect(() => {
    async function fetchMinisters() {
      let snapshot = await firebase.database().ref(`/ministers`).once("value");
      let names = [];
      snapshot.forEach((x) => {
        x.forEach((y) => {
          let name = y.val();
          name.key = y.key;
          names.push(name);
        });
      });
      setMinisters(names);
    }

    function loadChurchMinisters() {
      let names = [];
      for (var x in props.ministers) {
        names.push(props.ministers[x]["name"]);
      }
      setChurchMinisters(names);
    }

    fetchMinisters();
    loadChurchMinisters();
  }, [props.ministers]);

  const handleChange = (event) => {
    setChurchMinisters(event.target.value);
  };

  const getSelectedMinisters = (selecteds) => {
    let result = {};
    selecteds.forEach((name) => {
      let filtered = ministers.find((x) => x.name === name);
      result[filtered.key] = filtered;
      delete result[filtered.key]["key"];
    });
    return result;
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-mutiple-checkbox-label">Ministério</InputLabel>
          <Select
            labelId="demo-mutiple-checkbox-label"
            id="demo-mutiple-checkbox"
            multiple
            value={churchMinisters}
            onChange={handleChange}
            onBlur={(event) =>
              props.callback(getSelectedMinisters(event.target.value))
            }
            input={<Input />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {ministers.map((minister, index) => (
              <MenuItem key={index} value={minister.name}>
                <Checkbox
                  checked={churchMinisters.indexOf(minister.name) > -1}
                />
                <ListItemText primary={minister.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </GridItem>
    </GridContainer>
  );
}
