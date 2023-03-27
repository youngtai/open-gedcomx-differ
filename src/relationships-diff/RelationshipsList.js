import {useState} from "react";
import {Button, List} from "@mui/material";
import {Add} from "@mui/icons-material";
import AddRelationshipDialog from "./AddRelationshipDialog";
import {EditableRelationship} from "./EditableRelationship";

export default function RelationshipsList({rels, persons}) {
  const [open, setOpen] = useState(false);

  function handleAddRelationship() {
    setOpen(true);
  }

  return (
    <>
      <Button variant={'outlined'} sx={{marginX: 2}} onClick={handleAddRelationship} startIcon={<Add/>}>
        Add Relationship
      </Button>
      <AddRelationshipDialog open={open} setOpen={setOpen}/>
      <List dense component='div'>
        {rels?.map((rel, relIndex) => <EditableRelationship key={`rel-${relIndex}`} rel={rel} relIndex={relIndex} persons={persons}/>)}
      </List>
    </>
  );
}
