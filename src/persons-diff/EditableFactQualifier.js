import {Box, Button, Grid, IconButton, ListItemText, MenuItem, Select, TextField, Typography} from "@mui/material";
import {DIFF_BACKGROUND_COLOR, FACT_KEYS, FACT_QUALIFIER, PERSON_FACT_BACKGROUND_COLOR} from "../constants";
import {useContext, useEffect, useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {RecordsDataContext} from "../RecordsContext";
import {personsWithMatchingNames} from "./EditableFactAttribute";
import {Add} from "@mui/icons-material";

function hasMatchingQualifier(attributeData, parentObject, comparingTo) {
  if (parentObject?.person1 && parentObject?.person2) {
    // For now, we're not highlighting relationship fact differences
    return true;
  }
  const matchingPersonsByName = personsWithMatchingNames(parentObject, comparingTo);
  if (matchingPersonsByName.length > 0) {
    for (const matchingPersonByName of matchingPersonsByName) {
      const factsWithMatchingKey = matchingPersonByName.facts?.filter(comparingFact => comparingFact[attributeData.key]);
      if (factsWithMatchingKey
          .flatMap(comparingFact => comparingFact[attributeData.key])
          .find(qualifier => JSON.stringify(qualifier) === JSON.stringify(attributeData.qualifier)) !== undefined) {
        return true;
      }
    }
  }
  return false;
}

export default function EditableFactQualifier({attributeData, qualifierIndex, fact, factIndex, parentObject, parentObjectIndex, comparingTo, updateData}) {
  const recordsData = useContext(RecordsDataContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [value, setValue] = useState(attributeData ? attributeData.qualifier.value : '');
  const [newValue, setNewValue] = useState('');
  const [newName, setNewName] = useState('');
  const [hasMatch, setHasMatch] = useState(hasMatchingQualifier(attributeData, parentObject, comparingTo));

  const backgroundColor = hasMatch ? PERSON_FACT_BACKGROUND_COLOR : DIFF_BACKGROUND_COLOR;
  const textColor = hasMatch ? 'black' : 'red';

  useEffect(() => {
    setHasMatch(hasMatchingQualifier(attributeData, parentObject, comparingTo));
    setValue(attributeData.qualifier.value);
  }, [attributeData, parentObject, comparingTo]);

  function handleSave() {
    setIsEditing(false);
    // GedcomX Editor saves ints as strings: 1 vs '1'
    fact[FACT_KEYS.qualifiers][qualifierIndex].value = value.toString();
    parentObject.facts.splice(factIndex, 1, fact);
    updateData(parentObject, parentObjectIndex, recordsData);
  }

  function handleAdd() {
    setIsAdding(true);
  }

  function handleSaveAdd() {
    setIsAdding(false);
    if (!newValue || !newName) {
      return;
    }
    // GedcomX Editor saves ints as strings: 1 vs '1'
    fact.qualifiers.push({name: newName, value: newValue.toString()});
    updateData(parentObject, parentObjectIndex, recordsData);
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleDelete() {
    delete fact[FACT_KEYS.qualifiers][qualifierIndex];
    fact[FACT_KEYS.qualifiers] = fact[FACT_KEYS.qualifiers].filter(e => e); // Remove 'empty' elements
    if (fact[FACT_KEYS.qualifiers].length === 0) {
      fact[FACT_KEYS.qualifiers] = null
    }
    parentObject.facts.splice(factIndex, 1, fact);
    updateData(parentObject, parentObjectIndex, recordsData);
  }

  const editableQualifier = (
    <Grid item sx={{background: backgroundColor, paddingLeft: 0}}>
      <Typography variant='subtitle1' sx={{paddingLeft: 1, background: '#eaeaea'}} hidden={qualifierIndex !== 0}>Qualifiers</Typography>
      <Grid container direction='row' spacing={1} justifyContent='space-between' alignItems='center' sx={{paddingLeft: 2}}>
        <Grid item>
          <ListItemText primary={attributeData.qualifier.name} secondary={'Name'} sx={{color: textColor}}/>
        </Grid>
        <Grid item>
          <TextField value={value} fullWidth={true} size='small' onChange={e => setValue(e.target.value)} sx={{margin: 1}}/>
        </Grid>
        <Grid item>
          <Button onClick={handleSave}>Save</Button>
        </Grid>
      </Grid>
    </Grid>
  );
  const addQualifier = (
    <Box sx={{padding: 1}} hidden={!isAdding}>
      <Grid container spacing={1} justifyContent='space-between' alignItems='center'>
        <Grid item xs={2}>
          <Select value={newName} onChange={e => setNewName(e.target.value)} size='small'>
            {Object.keys(FACT_QUALIFIER).map((key, index) => <MenuItem key={`qualifier-choice-${key}`} value={FACT_QUALIFIER[key]}>{key}</MenuItem>)}
          </Select>
        </Grid>
        <Grid item xs={8}>
          <TextField value={newValue} onChange={e => setNewValue(e.target.value)} fullWidth={true} size='small'/>
        </Grid>
        <Grid item>
          <Button onClick={handleSaveAdd}>Save</Button>
        </Grid>
      </Grid>
    </Box>
  );
  const qualifierItem = (
    <Grid container direction='row' spacing={1} justifyContent='space-between' alignItems='center' sx={{paddingLeft: 2}}>
      <Grid item>
        <ListItemText primary={attributeData.qualifier.name} secondary={'Name'} sx={{color: textColor}}/>
      </Grid>
      <Grid item>
        <ListItemText primary={value} secondary={'Value'} sx={{color: textColor}}/>
      </Grid>
      <Grid item>
        <Button onClick={handleEdit}>Edit</Button>
        <IconButton onClick={handleDelete}>
          <DeleteIcon/>
        </IconButton>
      </Grid>
    </Grid>
  );

  return (isEditing ? editableQualifier :
    <Grid item sx={{background: backgroundColor, paddingLeft: 0}}>
      <Box sx={{paddingLeft: 1, background: '#eaeaea'}} hidden={qualifierIndex !== 0}>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item>
            <Typography variant='subtitle1'>Qualifiers</Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={handleAdd}><Add/></IconButton>
          </Grid>
        </Grid>
      </Box>
      {addQualifier}
      {qualifierItem}
    </Grid>
  );
}