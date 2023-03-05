import {useContext, useEffect, useState} from "react";
import {RecordsDataContext} from "../RecordsContext";
import {Button, Grid, ListItemText, Paper, TextField} from "@mui/material";
import {sideIncludesDocument} from "./DocumentsDiff";
import {DIFF_BACKGROUND_COLOR} from "../constants";

function hasMatchingDocumment(document, comparingTo) {
  return sideIncludesDocument(document, comparingTo);
}

export default function EditableDocument({document, documentIndex}) {
  const recordsData = useContext(RecordsDataContext);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(document.text);
  const [hasMatch, setHasMatch] = useState(hasMatchingDocumment);

  const backgroundColor = hasMatch ? 'white' : DIFF_BACKGROUND_COLOR;
  const textColor = hasMatch ? 'black' : 'red';

  useEffect(() => {
    setHasMatch(hasMatchingDocumment(document, recordsData.comparingToGx.documents));
  }, [document, recordsData.comparingToGx.documents]);

  function handleSave() {
    setIsEditing(false);
    if (!text) {
      return;
    }
    recordsData.gx.documents[documentIndex].text = text;

    // updateDocumentsData(recordsData);
  }

  function handleEdit() {
    setIsEditing(true);
  }

  return (isEditing ?
    (<Paper sx={{margin: 2, padding: 1}} square elevation={4}>
      <Grid container spacing={1} justifyContent='space-between' alignItems='center'>
        <Grid item xs={10}>
          <Grid container direction='column'>
            <Grid item>
              <ListItemText primary={document.id} secondary={'Id'}/>
            </Grid>
            <Grid item>
              <TextField value={text} size='small' fullWidth={true} multiline onChange={e => setText(e.target.value)} sx={{marginY: 1}}/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleSave}>Save</Button>
        </Grid>
      </Grid>
    </Paper>) :
    (<Paper sx={{margin: 2}} square elevation={4}>
      <Grid container alignItems='center' justifyContent='space-between' sx={{background: backgroundColor, paddingLeft: 2}}>
        <Grid item xs={10}>
          <Grid container direction='column' sx={{color: textColor}}>
            <Grid item>
              <ListItemText primary={document.id} secondary={'Id'}/>
            </Grid>
            <Grid item>
              <ListItemText primary={document.text} secondary={'Text'}/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleEdit}>Edit</Button>
        </Grid>
      </Grid>
    </Paper>)
  );
}