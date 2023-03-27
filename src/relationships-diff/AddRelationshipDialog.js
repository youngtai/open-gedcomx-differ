import {Dialog, DialogTitle, Grid, MenuItem, Select, Typography} from "@mui/material";
import {useContext, useState} from "react";
import {RecordsDataContext} from "../RecordsContext";
import {fullTextName, updateRelationshipsData} from "./RelationshipsDiff";
import {RELATIONSHIP} from "../constants";
import {generateLocalId} from "../Utils";
import {PaperComponent, RootContainer} from "../Styled";
import {AssertionsContext} from "../AssertionsContext";

export default function AddRelationshipDialog({open, setOpen}) {
  const recordsData = useContext(RecordsDataContext);
  const assertions = useContext(AssertionsContext).assertions;
  const persons = recordsData.gx.persons;
  const personMenuItems = persons.map((person, idx) => <MenuItem key={`person-item-${idx}`} value={person}>{fullTextName(person)}</MenuItem>);

  const [person1, setPerson1] = useState('');
  const [person2, setPerson2] = useState('');
  const [type, setType] = useState(RELATIONSHIP.Couple);

  function handleDialogClose() {
    setOpen(false);
    if (!person1 || !person2 || !type) {
      return;
    }
    const newRelationship = {
      id: `r_${generateLocalId()}`,
      type: type,
      person1: {
        resource: `#${person1.id}`,
        resourceId: `${person1.id}`
      },
      person2: {
        resource: `#${person2.id}`,
        resourceId: `${person2.id}`
      }
    };
    recordsData.gx.relationships.push(newRelationship);
    updateRelationshipsData(recordsData, assertions);
    setPerson1('');
    setPerson2('');
  }

  return (
    <Dialog open={open} onClose={handleDialogClose} PaperComponent={PaperComponent} aria-labelledby="draggable-dialog-title">
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">Add Relationship</DialogTitle>
      <RootContainer>
        <Grid container direction='column' spacing={2}>
          <Grid item>
            <Typography>Person 1</Typography>
            <Select value={person1} onChange={e => setPerson1(e.target.value)}>
              {personMenuItems}
            </Select>
          </Grid>
          <Grid item>
            <Typography>Relationship Type</Typography>
            <Select value={type} onChange={e => setType(e.target.value)}>
              {Object.keys(RELATIONSHIP).map(key => <MenuItem key={`type-${key}`} value={RELATIONSHIP[key]}>{key}</MenuItem>)}
            </Select>
          </Grid>
          <Grid item>
            <Typography>Person 2</Typography>
            <Select value={person2} onChange={e => setPerson2(e.target.value)}>
              {personMenuItems}
            </Select>
          </Grid>
        </Grid>
      </RootContainer>
    </Dialog>
  );
}
