import {useContext, useState} from "react";
import {COVERAGE_ATTRIBUTES} from "../constants";
import {Box, Button, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Select, TextField} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditableCoverageDataItem from "./EditableCoverageDataItem";
import {updateSourceDescriptionsData} from "./SourceDescriptionsDiff";
import {RecordsDataContext} from "../RecordsContext";

function getMissingCoverageItem(presentItems) {
  return Object.keys(COVERAGE_ATTRIBUTES).filter(attribute => !presentItems.includes(attribute));
}

export default function EditableCoverageData({coverage, coverageIndex, sourceDescriptionIndex}) {
  const recordsData = useContext(RecordsDataContext);
  const [isAddingCoverageItem, setIsAddingCoverageItem] = useState(false);
  const [newCoverageItemValue, setNewCoverageItemValue] = useState('');
  const [newCoverageItemKey, setNewCoverageItemKey] = useState('');
  const coverageItems = [];
  const presentItems = [];
  if (coverage.spatial) {
    coverageItems.push({label: 'Spatial', data: coverage.spatial});
    presentItems.push('spatial');
  }
  if (coverage.temporal) {
    coverageItems.push({label: 'Temporal', data: coverage.temporal});
    presentItems.push('temporal');
  }
  if (coverage.recordType) {
    coverageItems.push({label: 'Record Type', data: coverage.recordType});
    presentItems.push('recordType');
  }
  function handleAddCoverageItem() {
    setIsAddingCoverageItem(true);
  }
  function handleSaveNewCoverageItem() {
    setIsAddingCoverageItem(false);
    if (newCoverageItemValue === '') {
      return;
    }
    if (newCoverageItemKey === COVERAGE_ATTRIBUTES.spatial || newCoverageItemKey === COVERAGE_ATTRIBUTES.temporal) {
      coverage[newCoverageItemKey] = {original: newCoverageItemValue};
    } else if (newCoverageItemKey === COVERAGE_ATTRIBUTES.recordType) {
      coverage[newCoverageItemKey] = newCoverageItemValue;
    }
    recordsData.gx.sourceDescriptions[sourceDescriptionIndex].coverage.splice(coverageIndex, 1, coverage);
    updateSourceDescriptionsData(recordsData);
    setNewCoverageItemKey('');
  }
  const addCoverageItem = isAddingCoverageItem ?
    (
      <ListItem>
        <Grid container direction={'row'} alignItems={'center'} spacing={1}>
          <Grid item xs={10}>
            <Grid container direction={'row'} alignItems={'center'} spacing={1}>
              <Grid item xs={3}>
                <Select value={newCoverageItemKey} onChange={e => setNewCoverageItemKey(e.target.value)}>
                  {getMissingCoverageItem(presentItems).map((a, idx) => <MenuItem key={`coverage-option-${idx}`} value={a}>{a}</MenuItem>)}
                </Select>
              </Grid>
              <Grid item xs={9}>
                <TextField value={newCoverageItemValue} onChange={e => setNewCoverageItemValue(e.target.value)} fullWidth={true}/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Button onClick={handleSaveNewCoverageItem}>Save</Button>
          </Grid>
        </Grid>
      </ListItem>
    ) :
    (
      <Box hidden={coverageItems.length === 3}>
        <ListItemButton onClick={handleAddCoverageItem}>
          <ListItemIcon>
            <AddIcon/>
          </ListItemIcon>
          <ListItemText primary={'Add Coverage Element'}/>
        </ListItemButton>
      </Box>
    );

  return (
    <Paper sx={{margin: 2}} square elevation={4}>
      <List dense sx={{padding: 0}}>
        {coverageItems.map(item => <EditableCoverageDataItem
          key={`coverage-${coverageIndex}-${item.label}`}
          coverageItem={item.data}
          coverageIndex={coverageIndex}
          label={item.label}
          sourceDescriptionIndex={sourceDescriptionIndex}
        />)}
        {addCoverageItem}
      </List>
    </Paper>
  );
}
