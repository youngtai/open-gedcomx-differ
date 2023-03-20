import {useContext, useEffect, useState} from "react";
import {Button, FormControl, Grid, IconButton, ListItemText, MenuItem, Select, TextField} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {DIFF_BACKGROUND_COLOR, FACT_KEYS, FACT_TYPE, KEY_TO_LABEL_MAP, PERSON_FACT_BACKGROUND_COLOR} from "../constants";
import {RecordsDataContext} from "../RecordsContext";
import {haveSameNames} from "./PersonsDiff";
import {relationshipPersonsAreEqual} from "../relationships-diff/RelationshipsDiff";
import {Cancel} from "@mui/icons-material";

export function personsWithMatchingNames(person, comparingTo) {
  return comparingTo.filter(p => haveSameNames(p, person));
}

function relationshipsWithSamePersonsAndType(relationship, comparingToRels, persons, comparingToPersons) {
  return comparingToRels.filter(r => {
    const person1Same = relationshipPersonsAreEqual(relationship.person1, r.person1, persons, comparingToPersons);
    const person2Same = relationshipPersonsAreEqual(relationship.person2, r.person2, persons, comparingToPersons);
    const sameType = relationship.type === r.type;
    return person1Same && person2Same && sameType;
  });
}

function matchingAttributeExists(matchingParentObjects, attributeData, fact) {
  if (matchingParentObjects.length > 0) {
    for (const matchingParentObject of matchingParentObjects) {
      const factsWithMatchingKey = matchingParentObject
        .facts?.filter(comparingFact => fact.type === comparingFact.type)
        .filter(comparingFact => comparingFact[attributeData.key]);
      if (attributeData.key === FACT_KEYS.date || attributeData.key === FACT_KEYS.place) {
        if (factsWithMatchingKey?.find(comparingFact => comparingFact[attributeData.key].original === attributeData.value) !== undefined) {
          return true;
        }
      } else if (attributeData.key === FACT_KEYS.type) {
        if (factsWithMatchingKey?.find(comparingFact => comparingFact[attributeData.key] === attributeData.value) !== undefined) {
          return true;
        }
      } else {
        if (factsWithMatchingKey?.find(comparingFact => comparingFact[attributeData.key].toLowerCase() === attributeData.value.toLowerCase()) !== undefined) {
          return true;
        }
      }
    }
  }
  return false;
}

function hasMatchingAttribute(attributeData, fact, parentObject, persons, comparingToParentObjects, comparingToPersons) {
  function parentObjectIsARelationship(parentObject) {
    return parentObject?.person1 && parentObject?.person2;
  }
  if (parentObjectIsARelationship(parentObject)) {
    if (parentObject.type === 'http://gedcomx.org/Marriage' && attributeData.key === 'place' && attributeData.value === 'São Pedro, Funchal, Madeira, Portugal') {
      console.log(attributeData);
    }
  }
  // Get the matching parent objects (relationships or persons) from the compare side
  const matchingObjects = parentObjectIsARelationship(parentObject) ?
    relationshipsWithSamePersonsAndType(parentObject, comparingToParentObjects, persons, comparingToPersons) :
    personsWithMatchingNames(parentObject, comparingToParentObjects);
  return matchingAttributeExists(matchingObjects, attributeData, fact);
}

export default function EditableFactAttribute({attributeData, fact, factIndex, parentObject, parentObjectIndex, comparingTo, updateData}) {
  const recordsData = useContext(RecordsDataContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editFieldValue, setEditFieldValue] = useState(attributeData ? attributeData.value : '');
  const [hasMatch, setHasMatch] = useState(hasMatchingAttribute(attributeData, fact, parentObject, recordsData.gx.persons, comparingTo, recordsData.comparingToGx.persons));

  const backgroundColor = hasMatch ? PERSON_FACT_BACKGROUND_COLOR : DIFF_BACKGROUND_COLOR;
  const textColor = hasMatch ? 'black' : 'red';

  useEffect(() => {
    setHasMatch(hasMatchingAttribute(attributeData, fact, parentObject, recordsData.gx.persons, comparingTo, recordsData.comparingToGx.persons));
    setEditFieldValue(attributeData.value);
  }, [attributeData, parentObject, comparingTo, fact, recordsData.gx.persons, recordsData.comparingToGx.persons]);

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
          <FormControl fullWidth>
            <Select value={editFieldValue} onChange={e => setEditFieldValue(e.target.value)} size='small' sx={{margin: 1}}>
              {Object.keys(FACT_TYPE).map(key => <MenuItem key={`type-${key}`} value={FACT_TYPE[key]}>{key}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={1.2}>
          <Button onClick={handleSave}>Save</Button>
        </Grid>
        <Grid item xs={0.8}>
          <IconButton onClick={() => setIsEditing(false)}>
            <Cancel/>
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
    ) :
    <Grid item sx={{background: backgroundColor, paddingLeft: 2}}>
      <Grid container direction='row' spacing={1} justifyContent='space-between' alignItems='center'>
        <Grid item xs={10}>
          <TextField value={editFieldValue} fullWidth={true} size='small' onChange={e => setEditFieldValue(e.target.value)} sx={{margin: 1}}/>
        </Grid>
        <Grid item xs={1.2}>
          <Button onClick={handleSave}>Save</Button>
        </Grid>
        <Grid item xs={0.8}>
          <IconButton onClick={() => setIsEditing(false)}>
            <Cancel/>
          </IconButton>
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
