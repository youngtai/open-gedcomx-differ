import {useContext, useEffect, useState} from "react";
import {Button, Grid, IconButton, ListItem, ListItemText, TextField} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {updateSourceDescriptionsData} from "./SourceDescriptionsDiff";
import {RecordsDataContext} from "../RecordsContext";
import {DIFF_BACKGROUND_COLOR} from "../constants";

function hasMatchingCoverageDataItem(coverageItem, label, comparingTo) {
  if (label === 'Spatial') {
    return comparingTo
      .filter(sd => sd.resourceType === 'http://gedcomx.org/Record')
      .map(sd => sd.coverage)
      .flatMap(coverages => coverages)
      .find(coverage => coverage.spatial && coverage.spatial.original === coverageItem.original) !== undefined;
  } else if (label === 'Temporal') {
    return comparingTo
      .filter(sd => sd.resourceType === 'http://gedcomx.org/Record')
      .map(sd => sd.coverage)
      .flatMap(coverages => coverages)
      .find(coverage => coverage.temporal && coverage.temporal.original === coverageItem.original) !== undefined;
  } else if (label === 'Record Type') {
    return comparingTo
      .filter(sd => sd.resourceType === 'http://gedcomx.org/Record')
      .map(sd => sd.coverage)
      .flatMap(coverages => coverages)
      .find(coverage => coverage.recordType && coverage.recordType === coverageItem) !== undefined;
  }
}

export default function EditableCoverageDataItem({coverageItem, coverageIndex, label, sourceDescriptionIndex}) {
  const recordsData = useContext(RecordsDataContext);
  const sourceDescriptions = recordsData.gx.sourceDescriptions;
  const comparingTo = recordsData.comparingToGx.sourceDescriptions;

  const [editFieldValue, setEditFieldValue] = useState(coverageItem?.original ? coverageItem.original : coverageItem ? coverageItem : '');
  const [isEditing, setIsEditing] = useState(false);
  const [hasMatch, setHasMatch] = useState(hasMatchingCoverageDataItem(coverageItem, label, comparingTo));

  const backgroundColor = hasMatch ? 'white' : DIFF_BACKGROUND_COLOR;
  const textColor = hasMatch ? 'black' : 'red';

  useEffect(() => {
    setHasMatch(hasMatchingCoverageDataItem(coverageItem, label, comparingTo));
    setEditFieldValue(coverageItem?.original ? coverageItem.original : coverageItem ? coverageItem : '');
  }, [coverageItem, label, comparingTo]);

  function handleOnEdit() {
    setIsEditing(true);
  }

  function handleDelete() {
    if (label === 'Spatial') {
      delete sourceDescriptions[sourceDescriptionIndex].coverage[coverageIndex].spatial;
    }
    if (label === 'Temporal') {
      delete sourceDescriptions[sourceDescriptionIndex].coverage[coverageIndex].temporal;
    }
    if (label === 'Record Type') {
      delete sourceDescriptions[sourceDescriptionIndex].coverage[coverageIndex].recordType;
    }
    updateSourceDescriptionsData(recordsData);
  }

  function handleOnSave() {
    setIsEditing(false);
    if (label === 'Spatial') {
      coverageItem.original = editFieldValue;
      sourceDescriptions[sourceDescriptionIndex].coverage[coverageIndex].spatial = coverageItem;
    } else if (label === 'Temporal') {
      coverageItem.original = editFieldValue;
      sourceDescriptions[sourceDescriptionIndex].coverage[coverageIndex].temporal = coverageItem;
    } else if (label === 'Record Type') {
      coverageItem = editFieldValue;
      sourceDescriptions[sourceDescriptionIndex].coverage[coverageIndex].recordType = coverageItem;
    }
    updateSourceDescriptionsData(recordsData);
  }

  function item() {
    if (isEditing) {
      return (
        <>
          <Grid item xs={10}>
            <TextField value={editFieldValue} fullWidth={true} size='small' onChange={e => setEditFieldValue(e.target.value)} sx={{marginY: 1}}/>
          </Grid>
          <Grid item xs={2}>
            <Button onClick={handleOnSave} sx={{marginLeft: 2}}>Save</Button>
          </Grid>
        </>
      );
    } else {
      return (
        <>
          <Grid item>
            <ListItemText primary={editFieldValue} secondary={label}/>
          </Grid>
          <Grid item>
            <Button onClick={handleOnEdit}>Edit</Button>
            <IconButton onClick={handleDelete}>
              <DeleteIcon/>
            </IconButton>
          </Grid>
        </>
      );
    }
  }

  return (
    <ListItem sx={{padding: 1, background: backgroundColor, color: textColor}}>
      <Grid container alignItems='center' justifyContent='space-between'>
        {item()}
      </Grid>
    </ListItem>
  );
}
