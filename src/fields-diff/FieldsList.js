import {useContext, useState} from "react";
import {Button, Grid, List, MenuItem, Paper, Select, TextField} from "@mui/material";
import {Add} from "@mui/icons-material";
import EditableRecordField, {updateFieldsData} from "./EditableRecordField";
import {RECORD_FIELD_TYPE} from "../constants";
import {RecordsDataContext} from "../RecordsContext";

export default function FieldsList({fields}) {
  const recordsData = useContext(RecordsDataContext);
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState('');
  const [type, setType] = useState('');

  function handleAddField() {
    setAdding(true);
  }

  function handleSave() {
    setAdding(false);
    if (!value || !type) {
      return;
    }
    const newField = {
      type: type,
      values: [
        {
          type: 'http://gedcomx.org/Interpreted',
          text: value
        }
      ]
    };
    recordsData.gx.fields.push(newField);

    updateFieldsData(recordsData);

    setValue('');
    setType('');
  }

  return (
    <>
      {adding ?
        (<Paper sx={{margin: 2, padding: 1}} square elevation={4}>
          <Grid container spacing={1} justifyContent='space-between' alignItems='center'>
            <Grid item xs={10}>
              <Grid container direction='column'>
                <Grid item>
                  <TextField value={value} size='small' fullWidth={true} onChange={e => setValue(e.target.value)} sx={{marginY: 1}}/>
                </Grid>
                <Grid item>
                  <Select value={type} onChange={e => setType(e.target.value)}>
                    {Object.keys(RECORD_FIELD_TYPE).map(key => <MenuItem key={`type-${key}`} value={RECORD_FIELD_TYPE[key]}>{key}</MenuItem>)}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Button onClick={handleSave}>Save</Button>
            </Grid>
          </Grid>
        </Paper>) :
        <Button variant='outlined' sx={{marginX: 2}} onClick={handleAddField} startIcon={<Add/>}>Add Field</Button>
      }
      <List dense component='div'>
        {fields.map((field, index) => <EditableRecordField key={`field-${index}`} field={field} fieldIndex={index}/>)}
      </List>
    </>
  );
}