/* eslint-disable react/prop-types */
import React from "react";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";

export default function ChurchesCults(props) {
  const [cults, setCults] = React.useState("");

  React.useEffect(() => {
    setCults(props.cults);
  }, [props.cults]);

  const handleCheck = (event) => {
    let currentCults = cults !== "" ? cults.split(",") : [];
    if (event.target.checked) {
      currentCults.push(event.target.name);
    } else if (currentCults.includes(event.target.name)) {
      currentCults.splice(currentCults.indexOf(event.target.name), 1);
    }
    setCults(currentCults.join());
    props.callback(currentCults.join());
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <FormControl component="fieldset" style={{ marginTop: "20px" }}>
          <FormLabel component="legend">Dias de Culto</FormLabel>
          <FormGroup aria-label="position" row>
            <FormControlLabel
              control={
                <Checkbox
                  name="RJM-DM"
                  checked={cults.includes("RJM-DM")}
                  onChange={handleCheck}
                />
              }
              label="RJM-DM"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="DT"
                  checked={cults.includes("DT")}
                  onChange={handleCheck}
                />
              }
              label="DT"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="DN"
                  checked={cults.includes("DN")}
                  onChange={handleCheck}
                />
              }
              label="DN"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="2N"
                  checked={cults.includes("2N")}
                  onChange={handleCheck}
                />
              }
              label="2N"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="3T"
                  checked={cults.includes("3T")}
                  onChange={handleCheck}
                />
              }
              label="3T"
            />
          </FormGroup>
          <FormGroup aria-label="position" row>
            <FormControlLabel
              control={
                <Checkbox
                  name="3N"
                  checked={cults.includes("3N")}
                  onChange={handleCheck}
                />
              }
              label="3N"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="4N"
                  checked={cults.includes("4N")}
                  onChange={handleCheck}
                />
              }
              label="4N"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="5T"
                  checked={cults.includes("5T")}
                  onChange={handleCheck}
                />
              }
              label="5T"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="5N"
                  checked={cults.includes("5N")}
                  onChange={handleCheck}
                />
              }
              label="5N"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="6N"
                  checked={cults.includes("6N")}
                  onChange={handleCheck}
                />
              }
              label="6N"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="SN"
                  checked={cults.includes("SN")}
                  onChange={handleCheck}
                />
              }
              label="SN"
            />
          </FormGroup>
        </FormControl>
      </GridItem>
    </GridContainer>
  );
}
