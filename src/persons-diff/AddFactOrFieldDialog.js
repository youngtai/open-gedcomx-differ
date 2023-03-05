import {useContext, useState} from "react";
import {Checkbox, Dialog, DialogTitle, FormControlLabel, Grid, MenuItem, Select, TextField, Typography} from "@mui/material";
import {FACT_KEYS, GEDCOMX_ORIGINAL, PERSON_FIELD_TYPE} from "../constants";
import {RecordsDataContext} from "../RecordsContext";
import {PaperComponent, RootContainer} from "../Styled";

export default function AddFactOrFieldDialog({open, setOpen, parentObject, parentObjectIndex, factTypes, updateData}) {
  const recordsData = useContext(RecordsDataContext);

  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');
  const [value, setValue] = useState('');
  const [primary, setPrimary] = useState(false);
  const [role, setRole] = useState('');
  const [age, setAge] = useState('');

  const newFact = {};
  if (type !== '') {
    newFact[FACT_KEYS.type] = type;
  }
  if (date !== '') {
    newFact[FACT_KEYS.date] = {original: date};
  }
  if (place !== '') {
    newFact[FACT_KEYS.place] = {original: place};
  }
  if (value !== '') {
    newFact[FACT_KEYS.value] = value;
  }
  newFact[FACT_KEYS.primary] = primary;
  const newRole = role !== '' ? {type: PERSON_FIELD_TYPE.Role, values: [{text: role}]} : null;
  const newAge = age !== '' ? {type: PERSON_FIELD_TYPE.Age, values: [{type: GEDCOMX_ORIGINAL, text: age.toString()}]} : null;

  function handleDialogClose() {
    setOpen(false);
    // Only add a new fact if it has more than just the 'primary' attribute
    let added = null;
    if (Object.keys(newFact).length > 1) {
      if (!parentObject.facts) {
        parentObject['facts'] = [];
      }
      added = parentObject.facts.push(newFact);
    }
    if (newRole) {
      if (!parentObject.fields) {
        parentObject['fields'] = [];
      }
      added = parentObject.fields.push(newRole);
    }
    if (newAge) {
      if (!parentObject.fields) {
        parentObject['fields'] = [];
      }
      added = parentObject.fields.push(newAge);
    }
    if (added) {
      updateData(parentObject, parentObjectIndex, recordsData);
      setType('');
      setDate('');
      setPlace('');
      setValue('');
      setPrimary(false);
      setRole('');
      setAge('');
    }
  }

  return (
    <Dialog open={open} onClose={handleDialogClose} PaperComponent={PaperComponent} aria-labelledby="draggable-dialog-title">
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Add Fact or Field</DialogTitle>
      <RootContainer>
        <Grid container direction='column' spacing={2}>
          <Grid item>
            <Typography>Type</Typography>
            <Select key='type-input' value={type} onChange={e => setType(e.target.value)}>
              {Object.keys(factTypes).map(t => <MenuItem key={`type-input-${t}`} value={factTypes[t]}>{t}</MenuItem>)}
            </Select>
          </Grid>
          <Grid item>
            <Typography>Date</Typography>
            <TextField key='date-input' value={date} onChange={e => setDate(e.target.value)}/>
          </Grid>
          <Grid item>
            <Typography>Place</Typography>
            <TextField key='place-input' value={place} onChange={e => setPlace(e.target.value)}/>
          </Grid>
          <Grid item>
            <Typography>Value</Typography>
            <TextField key='value-input' value={value} onChange={e => setValue(e.target.value)}/>
          </Grid>
          <Grid item>
            <FormControlLabel control={<Checkbox checked={primary} onChange={event => setPrimary(event.target.checked)}/>} label={'Primary'}/>
          </Grid>
          <Grid item>
            <Typography>Age</Typography>
            <TextField key='age-input' value={age} onChange={e => setAge(e.target.value)}/>
          </Grid>
          <Grid item>
            <Typography>Role</Typography>
            <TextField key='role-input' value={role} onChange={e => setRole(e.target.value)}/>
          </Grid>
        </Grid>
      </RootContainer>
    </Dialog>
  );
}