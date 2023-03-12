import {useContext, useEffect, useState} from "react";
import {Button, Grid, IconButton, ListItemText, MenuItem, Select, TextField} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {DIFF_BACKGROUND_COLOR, FACT_KEYS, FACT_TYPE, KEY_TO_LABEL_MAP, PERSON_FACT_BACKGROUND_COLOR} from "../constants";
import {RecordsDataContext} from "../RecordsContext";
import {haveSameNames} from "./PersonsDiff";

export function hasMatchingName(person, comparingTo) {
  return comparingTo.find(p => haveSameNames(p, person));
}

function hasMatchingAttribute(attributeData, parentObject, comparingTo) {
  if (parentObject?.person1 && parentObject?.person2) {
    // For now, we're not highlighting relationship fact differences
    return true;
  }
  const matchingPersonByName = hasMatchingName(parentObject, comparingTo);
  if (matchingPersonByName) {
    const factsWithMatchingKey = matchingPersonByName.facts?.filter(comparingFact => comparingFact[attributeData.key]);
    if (attributeData.key === FACT_KEYS.date || attributeData.key === FACT_KEYS.place) {
      return factsWithMatchingKey.find(comparingFact => comparingFact[attributeData.key].original === attributeData.value) !== undefined;
    } else if (attributeData.key === FACT_KEYS.type) {
      return factsWithMatchingKey.find(comparingFact => comparingFact[attributeData.key] === attributeData.value) !== undefined;
    } else {
      return factsWithMatchingKey.find(comparingFact => comparingFact[attributeData.key].toLowerCase() === attributeData.value.toLowerCase()) !== undefined;
    }
  }
  return false;
}

export default function EditableFactAttribute({attributeData, fact, factIndex, parentObject, parentObjectIndex, comparingTo, updateData}) {
  const recordsData = useContext(RecordsDataContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editFieldValue, setEditFieldValue] = useState(attributeData ? attributeData.value : '');
  const [hasMatch, setHasMatch] = useState(hasMatchingAttribute(attributeData, parentObject, comparingTo));

  const backgroundColor = hasMatch ? PERSON_FACT_BACKGROUND_COLOR : DIFF_BACKGROUND_COLOR;
  const textColor = hasMatch ? 'black' : 'red';

  useEffect(() => {
    setHasMatch(hasMatchingAttribute(attributeData, parentObject, comparingTo));
    setEditFieldValue(attributeData.value);
  }, [attributeData, parentObject, comparingTo]);

  function handleSave() {
    setIsEditing(false);

    // To update the fact for the current side I need the fact id and the attribute key.
    if (attributeData.key === FACT_KEYS.date || attributeData.key === FACT_KEYS.place) {
      fact[attributeData.key].original = editFieldValue;
    }
    else if (attributeData.key === FACT_KEYS.type) {
      fact[attributeData.key] = editFieldValue;
    }
    else {
      fact[attributeData.key] = editFieldValue;
    }
    attributeData.value = editFieldValue;
    parentObject.facts.splice(factIndex, 1, fact);
    updateData(parentObject, parentObjectIndex, recordsData);
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function factIsEmpty(fact) {
    const factKeys = Object.keys(fact).filter(key => fact[key] !== null);
    const factHasNoKeys = factKeys.length === 0;
    const keysToExclude = [FACT_KEYS.primary, FACT_KEYS.id];
    const factHasNoContent = factKeys.filter(k => !keysToExclude.includes(k)).length === 0;
    return factHasNoKeys || factHasNoContent;
  }

  function handleDelete() {
    delete fact[attributeData.key];
    if (factIsEmpty(fact)) {
      delete parentObject.facts[factIndex];
      parentObject.facts = parentObject.facts.filter(e => e); // Remove 'empty' elements after deleting a fact
    }
    else {
      parentObject.facts.splice(factIndex, 1, fact);
    }
    // If there are no facts, rather than leaving fact: [] behind, just remove the fact key
    if (parentObject.facts.length === 0) {
      delete parentObject.facts;
    }
    updateData(parentObject, parentObjectIndex, recordsData);
  }

  const editableFactAttribute = attributeData.key === 'type' ? (
    <Grid item sx={{background: backgroundColor, paddingLeft: 2}}>
      <Grid container direction='row' spacing={1} justifyContent='space-between' alignItems='center'>
        <Grid item xs={10}>
          <Select value={editFieldValue} onChange={e => setEditFieldValue(e.target.value)} size='small' sx={{margin: 1}}>
            {Object.keys(FACT_TYPE).map(key => <MenuItem key={`type-${key}`} value={FACT_TYPE[key]}>{key}</MenuItem>)}
          </Select>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleSave}>Save</Button>
        </Grid>
      </Grid>
    </Grid>
    ) :
    <Grid item sx={{background: backgroundColor, paddingLeft: 2}}>
      <Grid container direction='row' spacing={1} justifyContent='space-between' alignItems='center'>
        <Grid item xs={10}>
          <TextField value={editFieldValue} fullWidth={true} size='small' onChange={e => setEditFieldValue(e.target.value)} sx={{margin: 1}}/>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleSave}>Save</Button>
        </Grid>
      </Grid>
    </Grid>;

  const factAttribute = (
    <Grid item sx={{background: backgroundColor, paddingLeft: 2}}>
      <Grid container alignItems='center' justifyContent='space-between'>
        <Grid item>
          <ListItemText primary={editFieldValue} secondary={KEY_TO_LABEL_MAP[attributeData.key]} sx={{color: textColor}}/>
        </Grid>
        <Grid item>
          <Button onClick={handleEdit}>Edit</Button>
          <IconButton onClick={handleDelete}>
            <DeleteIcon/>
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );

  return isEditing ? editableFactAttribute : factAttribute;
}
