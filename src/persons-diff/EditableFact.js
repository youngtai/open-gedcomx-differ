import {useContext, useState} from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import EditableFactAttribute from "./EditableFactAttribute";
import PrimaryFactSwitchItem from "./PrimaryFactSwitchItem";
import {FACT_KEYS, FACT_QUALIFIER, PERSON_FACT_BACKGROUND_COLOR} from "../constants";
import AddIcon from "@mui/icons-material/Add";
import {RecordsDataContext} from "../RecordsContext";
import EditableFactQualifier from "./EditableFactQualifier";
import {Cancel} from "@mui/icons-material";

function createEditablePersonFactAttribute(attributeData, type, fact, factIndex, parentObject, parentObjectIndex, comparingTo, updateData) {
  return (
    <EditableFactAttribute
      key={`fact-${attributeData.key}`}
      attributeData={attributeData}
      fact={fact}
      factIndex={factIndex}
      parentObject={parentObject}
      parentObjectIndex={parentObjectIndex}
      comparingTo={comparingTo}
      updateData={updateData}
    />
  );
}

function getMissingAttributes(presentAttributes) {
  return Object.keys(FACT_KEYS).filter(attribute => !presentAttributes.includes(attribute));
}

export default function EditableFact({fact, factIndex, parentObject, parentObjectIndex, comparingTo, updateData, factTypes}) {
  const recordsData = useContext(RecordsDataContext);

  const [isAddingAttribute, setIsAddingAttribute] = useState(false);
  const [newAttributeKey, setNewAttributeKey] = useState('');
  const [newAttributeValue, setNewAttributeValue] = useState('');

  const [newQualifierName, setNewQualifierName] = useState('');

  const id = fact?.id;
  const type = fact?.type;
  const date = fact?.date?.original;
  const place = fact?.place?.original;
  const value = fact?.value;
  const qualifiers = fact?.qualifiers;
  const primary = fact?.primary;
  const factAttributeElements = [];
  const presentAttributes = ['primary', 'id'];

  if (type) {
    const attributeData = {key: FACT_KEYS.type, id: id, value: type};
    factAttributeElements.push(
      createEditablePersonFactAttribute(attributeData, type, fact, factIndex, parentObject, parentObjectIndex, comparingTo, updateData)
    );
    presentAttributes.push(FACT_KEYS.type);
  }
  if (date) {
    const attributeData = {key: FACT_KEYS.date, id: id, value: date};
    factAttributeElements.push(
      createEditablePersonFactAttribute(attributeData, type, fact, factIndex, parentObject, parentObjectIndex, comparingTo, updateData)
    );
    presentAttributes.push(FACT_KEYS.date);
  }
  if (place) {
    const attributeData = {key: FACT_KEYS.place, id: id, value: place};
    factAttributeElements.push(
      createEditablePersonFactAttribute(attributeData, type, fact, factIndex, parentObject, parentObjectIndex, comparingTo, updateData)
    );
    presentAttributes.push(FACT_KEYS.place);
  }
  if (value) {
    const attributeData = {key: FACT_KEYS.value, id: id, value: value};
    factAttributeElements.push(
      createEditablePersonFactAttribute(attributeData, type, fact, factIndex, parentObject, parentObjectIndex, comparingTo, updateData)
    );
    presentAttributes.push(FACT_KEYS.value);
  }
  if (qualifiers) {
    qualifiers.forEach((qualifier, index) => {
      const attributeData = {key: FACT_KEYS.qualifiers, id: id, qualifier: qualifier};
      factAttributeElements.push(<EditableFactQualifier
        key={`qualifier-${index}`}
        attributeData={attributeData}
        qualifierIndex={index}
        fact={fact}
        factIndex={factIndex}
        parentObject={parentObject}
        parentObjectIndex={parentObjectIndex}
        comparingTo={comparingTo}
        updateData={updateData}
      />);
      presentAttributes.push(FACT_KEYS.qualifiers);
    })
  }
  factAttributeElements.push(
    <PrimaryFactSwitchItem
      key={`fact-primary`}
      attributeData={{key: FACT_KEYS.primary, id: id, value: primary}}
      fact={fact}
      factIndex={factIndex}
      parentObject={parentObject}
      parentObjectIndex={parentObjectIndex}
      updateData={updateData}
    />
  );

  function handleSaveNewAttribute() {
    setIsAddingAttribute(false);
    if (newAttributeValue === '') {
      return;
    }
    if (newAttributeKey === FACT_KEYS.type || newAttributeKey === FACT_KEYS.value) {
      fact[newAttributeKey] = newAttributeValue;
    } else if (newAttributeKey === FACT_KEYS.date || newAttributeKey === FACT_KEYS.place) {
      fact[newAttributeKey] = {original: newAttributeValue};
    } else if (newAttributeKey === FACT_KEYS.qualifiers) {
      // GedcomX Editor saves ints as strings: 1 vs '1'
      fact[newAttributeKey] = [{name: newQualifierName, value: newAttributeValue.toString()}];
    }
    parentObject.facts.splice(factIndex, 1, fact);
    updateData(parentObject, parentObjectIndex, recordsData);
    setNewAttributeKey('');
  }
  function handleAddFactAttribute() {
    setIsAddingAttribute(true);
  }

  function editingComponent(newAttributeKey) {
    if (newAttributeKey === FACT_KEYS.qualifiers) {
      return (
        <Grid container spacing={1} justifyContent='space-between' alignItems='center'>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <Select value={newQualifierName} onChange={e => setNewQualifierName(e.target.value)} size='small'>
                {Object.keys(FACT_QUALIFIER).map((key, index) => <MenuItem key={`qualifier-choice-${key}`} value={FACT_QUALIFIER[key]}>{key}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={9}>
            <TextField value={newAttributeValue} onChange={e => setNewAttributeValue(e.target.value)} fullWidth={true} size='small'/>
          </Grid>
        </Grid>
      );
    } else if (newAttributeKey === FACT_KEYS.type) {
      return (
        <FormControl fullWidth>
          <Select key='type-input' value={newAttributeValue} onChange={e => setNewAttributeValue(e.target.value)} size='small'>
            {Object.keys(factTypes).map(t => <MenuItem key={`type-input-${t}`} value={factTypes[t]}>{t}</MenuItem>)}
          </Select>
        </FormControl>
      );
    } else {
      return <TextField value={newAttributeValue} onChange={e => setNewAttributeValue(e.target.value)} fullWidth={true} size='small'/>;
    }
  }

  const addAttributeItem = isAddingAttribute ?
    (
      <ListItem key={`fact-${factIndex}-add-attribute`} sx={{background: PERSON_FACT_BACKGROUND_COLOR}}>
        <Grid container direction={'row'} alignItems={'center'} spacing={1}>
          <Grid item xs={10}>
            <Grid container direction={'row'} alignItems={'center'} spacing={1}>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <Select value={newAttributeKey} onChange={e => setNewAttributeKey(e.target.value)} size='small'>
                    {getMissingAttributes(presentAttributes).map((a, idx) => <MenuItem key={`attribute-option-${idx}`} value={a}>{a}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={9}>
                {editingComponent(newAttributeKey)}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1.2}>
            <Button onClick={handleSaveNewAttribute}>Save</Button>
          </Grid>
          <Grid item xs={0.8}>
            <IconButton onClick={() => setIsAddingAttribute(false)}>
              <Cancel/>
            </IconButton>
          </Grid>
        </Grid>
      </ListItem>
    ) :
    (
      <Box hidden={getMissingAttributes(presentAttributes).length === 0}>
        <ListItemButton sx={{marginTop: 0, background: PERSON_FACT_BACKGROUND_COLOR}} color={'primary'} onClick={handleAddFactAttribute}>
          <ListItemIcon>
            <AddIcon/>
          </ListItemIcon>
          <ListItemText primary={'Add Fact Attribute'}/>
        </ListItemButton>
      </Box>
    );

  return (
    <>
      <ListItem key={`fact-${factIndex}`} sx={{paddingX: 0, marginTop: 0, paddingBottom: 0}}>
        <Grid container direction='column' key={`fact-${factIndex}-attributes`} sx={{background: PERSON_FACT_BACKGROUND_COLOR}}>
          {factAttributeElements}
        </Grid>
      </ListItem>
      {addAttributeItem}
    </>
  );
}
