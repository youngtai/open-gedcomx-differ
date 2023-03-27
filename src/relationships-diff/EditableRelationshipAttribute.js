import {useContext, useState} from "react";
import {RecordsDataContext} from "../RecordsContext";
import {updateRelationshipsData} from "./RelationshipsDiff";
import {Button, Grid, ListItemText, TextField} from "@mui/material";
import {AssertionsContext} from "../AssertionsContext";

export default function EditableRelationshipAttribute({rel, relIndex, isEditing, setIsEditing}) {
  const recordsData = useContext(RecordsDataContext);
  const assertions = useContext(AssertionsContext).assertions;
  const [editValue, setEditValue] = useState(rel?.type ? rel.type : '');

  function handleSave() {
    setIsEditing(false);
    rel.type = editValue;
    recordsData.gx.relationships[relIndex] = rel;
    updateRelationshipsData(recordsData, assertions);
  }

  function editItem() {
    if (isEditing) {
      return (
        <Grid container direction='row' spacing={1} justifyContent='space-between' alignItems='center'>
          <Grid item xs={10}>
            <TextField value={editValue} fullWidth={true} size='small' onChange={e => setEditValue(e.target.value)} sx={{marginY: 1}}/>
          </Grid>
          <Grid item xs={2}>
            <Button onClick={handleSave}>Save</Button>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container alignItems='center' justifyContent='space-between'>
          <Grid item>
            <ListItemText primary={rel?.type} secondary={'Type'}/>
          </Grid>
        </Grid>
      );
    }
  }

  return editItem();
}
