import {useContext, useState} from "react";
import {getPersonsIntersection} from "./PersonsDiff";
import {Button, Grid, IconButton, List, Paper, Stack, Tooltip} from "@mui/material";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import StarIcon from '@mui/icons-material/Star';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import EditableFact from "./EditableFact";
import EditablePersonField from "./EditablePersonField";
import AddIcon from "@mui/icons-material/Add";
import AddFactOrFieldDialog from "./AddFactOrFieldDialog";
import {FACT_TYPE, GENDER} from "../constants";
import {RecordsDataContext} from "../RecordsContext";
import {updateRelationshipsData} from "../relationships-diff/RelationshipsDiff";
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import EditablePersonName from "./EditablePersonName";
import {generateLocalId} from "../Utils";
import PersonNameEditDialog from "./PersonNameEditDialog";

export function updateRecordsData(recordsData) {
  const persons = recordsData.gx.persons;
  const comparingTo = recordsData.comparingToGx.persons;

  recordsData.finalGx.persons = getPersonsIntersection(persons, comparingTo);
  recordsData.setFinalGx(structuredClone(recordsData.finalGx));

  recordsData.gx.persons = persons;
  recordsData.setGx(structuredClone(recordsData.gx));
}

function getGenderIcon(person) {
  if (!person || !person.gender) {
    return <QuestionMarkIcon/>;
  }
  if (person.gender.type === GENDER.Male) {
    return <MaleIcon sx={{color: '#0d4fff'}}/>;
  } else if (person.gender.type === GENDER.Female) {
    return <FemaleIcon sx={{color: '#ff3ca3'}}/>;
  } else {
    return <QuestionMarkIcon/>;
  }
}

function getGenderString(person) {
  if (!person || !person.gender) {
    return 'Unknown';
  }
  if (person.gender.type === GENDER.Male) {
    return 'Male';
  } else if (person.gender.type === GENDER.Female) {
    return 'Female';
  } else {
    return 'Unknown';
  }
}

function getPrincipalIcon(person) {
  if (!person || !person.principal) {
    return <StarIcon sx={{color: '#dadada'}} size='small'/>;
  }
  return <StarIcon sx={{color: '#009142'}}/>;
}

function getPrincipalState(person) {
  if (!person || !person.principal) {
    return 'is not principal';
  }
  return 'is principal';
}

export function updatePersonsData(person, personIndex, recordsData) {
  recordsData.gx.persons.splice(personIndex, 1, person);
  updateRecordsData(recordsData);
  updateRelationshipsData(recordsData);
}

export default function EditablePerson({person, personIndex}) {
  const recordsData = useContext(RecordsDataContext);
  const persons = recordsData.gx.persons;

  const [open, setOpen] = useState(false);
  const [addFactOrField, setAddFactOrField] = useState(false);

  function handleAddFactOrField() {
    setAddFactOrField(true);
  }

  function handleMovePersonDown() {
    if (personIndex === persons.length - 1) {
      return;
    }
    const removed = persons.splice(personIndex, 1)[0];
    persons.splice(personIndex + 1, 0, removed);
    updateRecordsData(recordsData);
  }

  function handleMovePersonUp() {
    if (personIndex === 0) {
      return;
    }
    const removed = persons.splice(personIndex, 1)[0];
    persons.splice(personIndex - 1, 0, removed);
    updateRecordsData(recordsData);
  }

  const genderIcon = getGenderIcon(person);
  const principalIcon = getPrincipalIcon(person);

  function handleChangeGender() {
    if (person.gender.type === GENDER.Male) {
      person.gender.type = GENDER.Female;
    } else if (person.gender.type === GENDER.Female) {
      person.gender.type = GENDER.Unknown;
    } else if (person.gender.type === GENDER.Unknown) {
      person.gender.type = GENDER.Male;
    }
    updatePersonsData(person, personIndex, recordsData);
  }

  function handleSetPrincipal() {
    person.principal = person.principal === undefined || person.principal === false;
    updatePersonsData(person, personIndex, recordsData);
  }

  function handleAddName() {
    setOpen(true);
  }

  function handleDialogClose(parts, type) {
    setOpen(false);
    const newName = {
      id: generateLocalId(),
      type: !type ? null : type,
      nameForms: [{
        fullText: parts.map(part => part.value).join(' ').trim(),
        parts: parts
      }]
    };
    if (recordsData.gx.persons[personIndex].names) {
      recordsData.gx.persons[personIndex].names.push(newName);
    } else {
      recordsData.gx.persons[personIndex].names = [];
      recordsData.gx.persons[personIndex].names.push(newName);
    }
    updateRecordsData(recordsData);
  }

  return (
    <>
      <Paper sx={{margin: 2}} square elevation={4}>
        <Grid container>
          <Grid item xs={1}>
            <Stack sx={{marginY: 1}}>
              <Tooltip title='Move person up' arrow placement='left'>
                <IconButton onClick={handleMovePersonUp}><KeyboardArrowUp/></IconButton>
              </Tooltip>
              <Tooltip title='Move person down' arrow placement='left'>
                <IconButton onClick={handleMovePersonDown}><KeyboardArrowDown/></IconButton>
              </Tooltip>
            </Stack>
          </Grid>
          <Grid item xs={10}>
            {person?.names?.map((name, nameIndex) => <EditablePersonName person={person} personIndex={personIndex} name={name} nameIndex={nameIndex} key={`name-${nameIndex}`}/>)}
          </Grid>
          <Grid item xs={1}>
            <Grid container direction='column' alignItems='center' sx={{marginY: 1}}>
              <Grid item>
                <Tooltip title={`Gender (${getGenderString(person)})`} arrow placement='left'>
                  <IconButton onClick={handleChangeGender}>
                    {genderIcon}
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title={getPrincipalState(person)} arrow placement='left'>
                  <IconButton onClick={handleSetPrincipal}>
                    {principalIcon}
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title={'Add another name'} arrow placement='left'>
                  <IconButton onClick={handleAddName}><AddIcon/></IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <List component='div' disablePadding dense>
          {person?.facts?.map((fact, idx) => {
            return (
              <EditableFact
                key={`fact-${idx}`}
                fact={fact}
                factIndex={idx}
                parentObject={person}
                parentObjectIndex={personIndex}
                comparingTo={recordsData.comparingToGx.persons}
                updateData={updatePersonsData}
                factTypes={FACT_TYPE}
              />
            )})}
          {person && person.fields ? person.fields.map((field, idx) => {
            return (
              <EditablePersonField
                key={`field-${idx}`}
                field={field}
                fieldIndex={idx}
                person={person}
                personIndex={personIndex}
              />
            );
          }) : null}
          <Button variant={'outlined'} sx={{margin: 1}} onClick={handleAddFactOrField} startIcon={<AddIcon/>}>
            Add Fact or Role
          </Button>
          <AddFactOrFieldDialog
            open={addFactOrField}
            setOpen={setAddFactOrField}
            parentObject={person}
            parentObjectIndex={personIndex}
            factTypes={FACT_TYPE}
            updateData={updatePersonsData}
          />
        </List>
      </Paper>
      <PersonNameEditDialog open={open} onClose={handleDialogClose} person={person}/>
    </>
  );
}
