import {Grid} from "@mui/material";
import {RecordsDataContext} from "../RecordsContext";
import {leftRecordsData, rightRecordsData} from "../EditPage";
import DocumentsList from "./DocumentsList";

export function documentsAreEqual(docA, docB) {
  if (docA?.id?.startsWith('doc_') && docB?.id?.startsWith('doc_')) {
    return true;
  }
  if (docA?.id === 'extractionNotes' && docB?.id === 'extractionNotes') {
    return true;
  }
  return JSON.stringify(docA) === JSON.stringify(docB);
}

export function sideIncludesDocument(document, documents) {
  return documents?.find(d => documentsAreEqual(document, d)) !== undefined;
}

export function getDocumentsIntersection(leftDocuments, rightDocuments) {
  return leftDocuments.filter(ld => sideIncludesDocument(ld, rightDocuments));
}

export default function DocumentsDiff({leftGx, setLeftGx, rightGx, setRightGx, finalGx, setFinalGx}) {
  return (
    <Grid container alignItems='flex-start' justifyContent='center'>
      <Grid item xs={6}>
        <RecordsDataContext.Provider value={leftRecordsData(leftGx, setLeftGx, rightGx, setRightGx, finalGx, setFinalGx)}>
          <DocumentsList documents={leftGx.documents}/>
        </RecordsDataContext.Provider>
      </Grid>
      <Grid item xs={6}>
        <RecordsDataContext.Provider value={rightRecordsData(leftGx, setLeftGx, rightGx, setRightGx, finalGx, setFinalGx)}>
          <DocumentsList documents={rightGx.documents}/>
        </RecordsDataContext.Provider>
      </Grid>
    </Grid>
  );
}