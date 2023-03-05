import {useEffect, useState} from 'react';
import {Dialog, DialogTitle, Grid, MenuItem, Select, TextField, Typography} from "@mui/material";
import {NAME_PART_TYPE, PERSON_NAME_TYPE} from "../constants";
import {PaperComponent, RootContainer} from "../Styled";

export default function PersonNameEditDialog({open, onClose, nameParts, person}) {
  const [prefix, setPrefix] = useState(nameParts?.prefix ? nameParts.prefix.value : '');
  const [given, setGiven] = useState(nameParts?.given ? nameParts.given.value : '');
  const [surname, setSurname] = useState(nameParts?.surname ? nameParts.surname.value : '');
  const [suffix, setSuffix] = useState(nameParts?.suffix ? nameParts.suffix.value : '');
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

  useEffect(() => {
    setPrefix(nameParts?.prefix ? nameParts.prefix.value : '');
    setGiven(nameParts?.given ? nameParts.given.value : '');
    setSurname(nameParts?.surname ? nameParts.surname.value : '');
    setSuffix(nameParts?.suffix ? nameParts.suffix.value : '');
  }, [nameParts?.given, nameParts?.prefix, nameParts?.suffix, nameParts?.surname]);

  return (
      <Dialog open={open} onClose={() => onClose(parts, type, person)} PaperComponent={PaperComponent} aria-labelledby="draggable-dialog-title">
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Edit Name</DialogTitle>
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
              <Typography>Type</Typography>
              <Select value={type} onChange={event => setType(event.target.value)}>
                {Object.keys(PERSON_NAME_TYPE).map(t => <MenuItem key={`type-item-${t}`} value={PERSON_NAME_TYPE[t]}>{t}</MenuItem>)}
              </Select>
            </Grid>
          </Grid>
        </RootContainer>
      </Dialog>
  )
}