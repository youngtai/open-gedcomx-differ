import {useContext, useState} from 'react';
import {Button, List} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditablePerson, {updateRecordsData} from "./EditablePerson";
import AddPersonDialog from "./AddPersonDialog";
import {generateLocalId} from "../Utils";
import {RecordsDataContext} from "../RecordsContext";

function createPerson(nameParts, isPrincipal, gender, type) {
  return {
    id: `p_${generateLocalId()}`,
    extracted: true,
    principal: isPrincipal,
    gender: {type: gender},
    names: [
      {
        id: generateLocalId(),
        type: !type ? null : type,
        nameForms: [{
          fullText: nameParts.map(part => part.value).join(' ').trim(),
          parts: nameParts
        }]
      }
    ],
    facts: [],
    fields: []
  };
}

export default function PersonsList({persons}) {
  const recordsData = useContext(RecordsDataContext);

  const [open, setOpen] = useState(false);

  function handleAddPerson() {
    setOpen(true);
  }

  function handleDialogClose(parts, principal, gender, type) {
    setOpen(false);
    recordsData.gx.persons.push(createPerson(parts, principal, gender, type));
    updateRecordsData(recordsData);
  }

  return (
    <>
      <Button variant={'outlined'} sx={{marginX: 2}} onClick={handleAddPerson} startIcon={<AddIcon/>}>
        Add Person
      </Button>
      <AddPersonDialog
        open={open}
        handleDialogClose={handleDialogClose}
      />
      <List dense component="div" role="list">
        {persons.map((person, index) => <EditablePerson
          key={`person-${index}`}
          person={person}
          personIndex={index}/>)}
      </List>
      <Button variant={'outlined'} sx={{marginX: 2}} onClick={handleAddPerson} startIcon={<AddIcon/>}>
        Add Person
      </Button>
    </>
  );
}
