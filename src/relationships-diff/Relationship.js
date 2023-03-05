import {Grid, ListItem, ListItemText, Paper} from "@mui/material";
import {fullTextName, getPersonById} from "./RelationshipsDiff";

export function Relationship({rel, persons}) {
  return (
    <>
      <Paper sx={{margin: 2}} square elevation={4}>
        <ListItem>
          <Grid container direction='column'>
            <Grid item>
              <ListItemText primary={fullTextName(getPersonById(rel?.person1?.resourceId, persons))} secondary={'Person 1'}/>
            </Grid>
            <Grid item>
              <ListItemText primary={rel?.type} secondary={'Type'}/>
            </Grid>
            <Grid item>
              <ListItemText primary={fullTextName(getPersonById(rel?.person2?.resourceId, persons))} secondary={'Person 2'}/>
            </Grid>
          </Grid>
        </ListItem>
      </Paper>
    </>
  );
}