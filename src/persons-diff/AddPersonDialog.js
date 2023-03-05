import {useState} from "react";
import {Checkbox, Dialog, DialogTitle, FormControlLabel, Grid, MenuItem, Select, TextField, Typography} from "@mui/material";
import {GENDER, NAME_PART_TYPE, PERSON_NAME_TYPE} from "../constants";
import {PaperComponent, RootContainer} from "../Styled";

export default function AddPersonDialog({open, handleDialogClose}) {
  const [prefix, setPrefix] = useState('');
  const [given, setGiven] = useState('');
  const [surname, setSurname] = useState('');
  const [suffix, setSuffix] = useState('');
  const [principal, setPrincipal] = useState(false);
  const [gender, setGender] = useState(GENDER.Unknown);
  const [type, setType] = useState('');

  const parts = [];
  if (prefix !== '') {
    parts.push({type: NAME_PART_TYPE.prefix, value: prefix});
  }
  if (given !== '') {
    parts.push({type: NAME_PART_TYPE.given, value: given});
  }
  if (surname !== '') {
    parts.push({type: NAME_PART_TYPE.surname, value: surname});
  }
  if (suffix !== '') {
    parts.push({type: NAME_PART_TYPE.suffix, value: suffix});
  }
  
  return (
    <Dialog open={open} onClose={() => handleDialogClose(parts, principal, gender, type)} PaperComponent={PaperComponent} aria-labelledby="draggable-dialog-title">
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Add Person</DialogTitle>
      <RootContainer>
        <Grid container direction='column' spacing={2}>
          <Grid item>
            <Typography>Prefix</Typography>
            <TextField key='prefix-input' value={prefix} onChange={e => setPrefix(e.target.value)}/>
          </Grid>
          <Grid item>
            <Typography>Given Name</Typography>
            <TextField key='given-input' value={given} onChange={e => setGiven(e.target.value)}/>
          </Grid>
          <Grid item>
            <Typography>Surname</Typography>
            <TextField key='surname-input' value={surname} onChange={e => setSurname(e.target.value)}/>
          </Grid>
          <Grid item>
            <Typography>Suffix</Typography>
            <TextField key='suffix-input' value={suffix} onChange={e => setSuffix(e.target.value)}/>
          </Grid>
          <Grid item>
            <FormControlLabel control={<Checkbox checked={principal} onChange={event => setPrincipal(event.target.checked)}/>} label={'Principal'}/>
          </Grid>
          <Grid item>
            <Typography>Gender</Typography>
            <Select value={gender} onChange={event => setGender(event.target.value)}>
              {Object.keys(GENDER).map(genderElement => <MenuItem key={`gender-item-${genderElement}`} value={GENDER[genderElement]}>{genderElement}</MenuItem>)}
            </Select>
          </Grid>
          <Grid item>
            <Typography>Type</Typography>
            <Select value={type} onChange={event => setType(event.target.value)}>
              {Object.keys(PERSON_NAME_TYPE).map(t => <MenuItem key={`type-item-${t}`} value={PERSON_NAME_TYPE[t]}>{t}</MenuItem>)}
            </Select>
          </Grid>
        </Grid>
      </RootContainer>
    </Dialog>
  );
}
