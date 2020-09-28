/* eslint-disable react/prop-types */
import React from "react";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import CustomInput from "components/CustomInput/CustomInput.js";

export default function ChurchesRehearsals(props) {
  const [value, setValue] = React.useState(null);
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    setValue(props.rehearsals);
    setDescription(props.rehearsalsDescription);
  }, [props.rehearsals, props.rehearsalsDescription]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <FormControl component="fieldset" style={{ marginTop: "20px" }}>
          <FormLabel component="legend">Dia do Ensaio</FormLabel>
          <RadioGroup
            aria-label="rehearsals"
            name="rehearsals"
            value={value}
            onChange={handleChange}
            onBlur={(event) => props.callback(event.target.value)}
          >
            <FormGroup aria-label="position" row>
              <FormControlLabel control={<Radio />} value="DM" label="DM" />
              <FormControlLabel control={<Radio />} value="DT" label="DT" />
              <FormControlLabel control={<Radio />} value="DN" label="DN" />
              <FormControlLabel control={<Radio />} value="2N" label="2N" />
              <FormControlLabel control={<Radio />} value="3T" label="3T" />
            </FormGroup>
            <FormGroup aria-label="position" row>
              <FormControlLabel control={<Radio />} value="3N" label="3N" />
              <FormControlLabel control={<Radio />} value="4N" label="4N" />
              <FormControlLabel control={<Radio />} value="5N" label="5N" />
              <FormControlLabel control={<Radio />} value="6N" label="6N" />
              <FormControlLabel control={<Radio />} value="SN" label="SN" />
            </FormGroup>
          </RadioGroup>
        </FormControl>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <CustomInput
          labelText="Descreva o dia do ensaio"
          formControlProps={{
            fullWidth: false,
          }}
          inputProps={{
            value: description,
            onChange: handleChangeDescription,
            onBlur: (event) => props.callbackDescription(event.target.value),
          }}
        />
      </GridItem>
    </GridContainer>
  );
}
