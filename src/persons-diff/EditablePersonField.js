import {Button, Grid, IconButton, ListItem, ListItemText, MenuItem, Select, TextField} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {useContext, useEffect, useState} from "react";
import {updatePersonsData} from "./EditablePerson";
import {DIFF_BACKGROUND_COLOR, PERSON_FACT_BACKGROUND_COLOR, PERSON_FIELD_TYPE} from "../constants";
import {RecordsDataContext} from "../RecordsContext";

function hasMatchingField() {
  return true;
}

export default function EditablePersonField({field, fieldIndex, person, personIndex}) {
  const recordsData = useContext(RecordsDataContext);
  const persons = recordsData.gx.persons;
  const comparingTo = recordsData.comparingToGx.persons;

  const [isEditing, setIsEditing] = useState(false);
  const [editFieldType, setEditFieldType] = useState(field && field.type ? field.type : '');
  const [editFieldValue, setEditFieldValue] = useState(field ? field.values[0].text : '');
  const [hasMatch, setHasMatch] = useState(hasMatchingField());

  const backgroundColor = hasMatch ? PERSON_FACT_BACKGROUND_COLOR : DIFF_BACKGROUND_COLOR;
  const textColor = hasMatch ? 'black' : 'red';

  useEffect(() => {
    setHasMatch(hasMatchingField());
  }, [persons, comparingTo]);

  function handleEdit() {
    setIsEditing(true);
  }
  function handleDelete() {
    delete person.fields[fieldIndex];
    person.fields = person.fields.filter(e => e);
    updatePersonsData(person, personIndex, recordsData);
  }
  function handleSave() {
    setIsEditing(false);
    field.values[0].text = editFieldValue;
    field.type = editFieldType;
    person.fields[fieldIndex] = field;
    updatePersonsData(person, personIndex, recordsData);
  }

  function editItem() {
    if (isEditing) {
      return (
        <Grid container alignItems='center'>
          <Grid item xs={4}>
            <Select value={editFieldType} onChange={e => setEditFieldType(e.target.value)} size='small' sx={{margin: 1}}>
              {Object.keys(PERSON_FIELD_TYPE).map(key => <MenuItem key={`type-${key}`} value={PERSON_FIELD_TYPE[key]}>{key}</MenuItem>)}
            </Select>
          </Grid>
          <Grid item xs={8}>
            <Grid container direction='row' spacing={2} alignItems='center' justifyContent='space-between'>
              <Grid item>
                <TextField value={editFieldValue} size='small' onChange={e => setEditFieldValue(e.target.value)}/>
              </Grid>
              <Grid item>
                <Button onClick={handleSave}>Save</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container alignItems='center' justifyContent='space-between'>
          <Grid item>
            <ListItemText primary={editFieldValue} secondary={field?.type} sx={{color: textColor}}/>
          </Grid>
          <Grid item>
            <Grid container direction='row' spacing={2} alignItems='center'>
              <Grid item>
                <Button onClick={handleEdit}>Edit</Button>
                <IconButton onClick={handleDelete}>
                  <DeleteIcon/>
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }

  return (
    <ListItem sx={{paddingX: 2, marginTop: 1, background: backgroundColor}}>
      {editItem()}
    </ListItem>
  );
}
