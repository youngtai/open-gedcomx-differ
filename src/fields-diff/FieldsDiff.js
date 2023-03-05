import {Grid} from "@mui/material";
import {RecordsDataContext} from "../RecordsContext";
import {leftRecordsData, rightRecordsData} from "../EditPage";
import FieldsList from "./FieldsList";

export function getFieldsIntersection(leftFields, rightFields) {
  if (!leftFields || !rightFields) {
    return [];
  }
  return leftFields.filter(field => rightFields.map(f => JSON.stringify(f)).includes(JSON.stringify(field)));
}

export default function FieldsDiff({leftGx, setLeftGx, rightGx, setRightGx, finalGx, setFinalGx}) {
  return (
    <Grid container alignItems='flex-start' justifyContent='center'>
      <Grid item xs={6}>
        <RecordsDataContext.Provider value={leftRecordsData(leftGx, setLeftGx, rightGx, setRightGx, finalGx, setFinalGx)}>
          <FieldsList fields={leftGx.fields ? leftGx.fields : []}/>
        </RecordsDataContext.Provider>
      </Grid>
      <Grid item xs={6}>
        <RecordsDataContext.Provider value={rightRecordsData(leftGx, setLeftGx, rightGx, setRightGx, finalGx, setFinalGx)}>
          <FieldsList fields={rightGx.fields ? rightGx.fields : []}/>
        </RecordsDataContext.Provider>
      </Grid>
    </Grid>
  );
}