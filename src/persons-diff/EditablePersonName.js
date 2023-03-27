import {Button, Grid, IconButton, ListItem, ListItemText, Tooltip} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonNameEditDialog from "./PersonNameEditDialog";
import {useContext, useEffect, useState} from "react";
import {DIFF_BACKGROUND_COLOR, NAME_PART_TYPE} from "../constants";
import {updatePersonsData, updateRecordsData} from "./EditablePerson";
import {personsAreEqual} from "./PersonsDiff";
import {RecordsDataContext} from "../RecordsContext";
import {AssertionsContext} from "../AssertionsContext";

function hasMatchingPerson(person, comparingTo, assertions) {
  return comparingTo.find(p => personsAreEqual(person, p, assertions)) !== undefined;
}

function getNamePartByType(parts, type) {
  return parts.find(part => part.type === type);
}

function getFullTextName(nameParts) {
  return [nameParts?.prefix?.value, nameParts?.given?.value, nameParts?.surname?.value, nameParts?.suffix?.value].join(' ').trim();
}

function getNamePartsObject(parts) {
  return {
    prefix: getNamePartByType(parts, NAME_PART_TYPE.prefix),
    given: getNamePartByType(parts, NAME_PART_TYPE.given),
    surname: getNamePartByType(parts, NAME_PART_TYPE.surname),
    suffix: getNamePartByType(parts, NAME_PART_TYPE.suffix)
  };
}

function makeQuestionableWhitespaceVisible(input) {
  return input?.replace(/^\s+|\s{2,}|\s+$/g, '_');
}

function ColoredNameParts({nameParts, hasMatch}) {
  const prefixColor = hasMatch ? '#8a5300' : 'red';
  const givenColor = hasMatch ? '#000000' : 'red';
  const surnameColor = hasMatch ? '#7518d2' : 'red';
  const suffixColor = hasMatch ? '#9c9c9c' : 'red';

  return (
    <Grid container spacing={1}>
      <Grid item>
        <ListItemText primary={makeQuestionableWhitespaceVisible(nameParts.prefix?.value)} secondary={'Prefix'} sx={{color: prefixColor}} primaryTypographyProps={{fontSize: '20px'}} hidden={!nameParts.prefix}/>
      </Grid>
      <Grid item>
        <ListItemText primary={makeQuestionableWhitespaceVisible(nameParts.given?.value)} secondary={'Given'} sx={{color: givenColor}} primaryTypographyProps={{fontSize: '20px'}} hidden={!nameParts.given}/>
      </Grid>
      <Grid item>
        <ListItemText primary={makeQuestionableWhitespaceVisible(nameParts.surname?.value)} secondary={'Surname'} sx={{color: surnameColor}} primaryTypographyProps={{fontSize: '20px'}} hidden={!nameParts.surname}/>
      </Grid>
      <Grid item>
        <ListItemText primary={makeQuestionableWhitespaceVisible(nameParts.suffix?.value)} secondary={'Suffix'} sx={{color: suffixColor}} primaryTypographyProps={{fontSize: '20px'}} hidden={!nameParts.suffix}/>
      </Grid>
    </Grid>
  );
}

export default function EditablePersonName({person, personIndex, name, nameIndex}) {
  const recordsData = useContext(RecordsDataContext);
  const assertions = useContext(AssertionsContext).assertions;
  const persons = recordsData.gx.persons;
  const comparingTo = recordsData.comparingToGx.persons;

  const parts = name?.nameForms[0]?.parts;
  const nameParts = getNamePartsObject(parts);
  const [isEditingPerson, setIsEditingPerson] = useState(false);
  const [hasMatch, setHasMatch] = useState(hasMatchingPerson(person, comparingTo, assertions));

  const backgroundColor = hasMatch ? 'white' : DIFF_BACKGROUND_COLOR;

  useEffect(() => {
    setHasMatch(hasMatchingPerson(person, comparingTo, assertions));
  }, [person, comparingTo, assertions]);

  function handleDeletePerson() {
    person.names.splice(nameIndex, 1);
    if (!person.names || person.names.length === 0) {
      persons.splice(personIndex, 1);
    }
    updateRecordsData(recordsData);
  }

  function handleDialogClose(nameParts, type, person) {
    setIsEditingPerson(false);
    person.names[nameIndex].type = !type ? null : type;
    person.names[nameIndex].nameForms[0].parts = nameParts;
    person.names[nameIndex].nameForms[0].fullText = getFullTextName(getNamePartsObject(nameParts));
    updatePersonsData(person, personIndex, recordsData);
  }

  function handleEdit() {
    setIsEditingPerson(true);
  }

  return (
    <ListItem key={personIndex} sx={{background: backgroundColor, paddingRight: 0}}>
      <Grid container direction='row' justifyContent='space-between' alignItems='center'>
        <Grid item>
          <Grid container spacing={1} alignItems='center'>
            <Grid item>
              <Grid container direction='column'>
                <Grid item>
                  <ColoredNameParts nameParts={nameParts} hasMatch={hasMatch}/>
                </Grid>
                <Grid item>
                  <ListItemText primary={name.type} secondary={'Type'} hidden={!name.type} sx={{margin: 1}}/>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction='row' alignItems='center'>
            <Grid item>
              <Button onClick={handleEdit}>Edit</Button>
            </Grid>
            <Grid item>
              <Tooltip title={'Delete Person'} arrow>
                <IconButton onClick={handleDeletePerson}>
                  <DeleteIcon/>
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <PersonNameEditDialog
        open={isEditingPerson}
        onClose={handleDialogClose}
        nameParts={nameParts}
        person={person}
      />
    </ListItem>
  );
}