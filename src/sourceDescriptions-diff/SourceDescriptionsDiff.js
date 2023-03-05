import {Box, Grid, ListItemText} from "@mui/material";
import EditableRecordSourceDescription from "./EditableRecordSourceDescription";
import {RecordsDataContext} from "../RecordsContext";
import {leftRecordsData, rightRecordsData} from "../EditPage";

export function updateSourceDescriptionsData(recordsData) {
  const sourceDescriptions = recordsData.gx.sourceDescriptions;
  const intersection = getRecordDataIntersection(sourceDescriptions, recordsData.comparingToGx.sourceDescriptions);
  const finalGx = recordsData.finalGx;
  finalGx.sourceDescriptions = intersection;
  recordsData.setFinalGx(structuredClone(finalGx));

  const gx = recordsData.gx;
  gx.sourceDescriptions = sourceDescriptions;
  recordsData.setGx(structuredClone(gx));
}

function coverageElementsAreEqual(coverage1, coverage2) {
  const equalSpatial = coverage1.spatial?.original === coverage2.spatial?.original;
  const equalTemporal = coverage1.temporal?.original === coverage2.temporal?.original;
  const equalRecordType = coverage1.recordType === coverage2.recordType;
  return equalSpatial && equalTemporal && equalRecordType;
}

// Note that `coverage` is an array
function recordCoverageAreEqual(coverage1, coverage2) {
  if ((!coverage1 && coverage2) || (coverage1 && !coverage2)) {
    return false;
  }
  if (coverage1.length !== coverage2.length) {
    return false;
  }
  return coverage1.every((c, index) => coverageElementsAreEqual(c, coverage2[index]));
}

export function getRecordDataIntersection(left, right) {
  return left.filter(leftSD => {
    if (leftSD.resourceType === 'http://gedcomx.org/Record') {
      return right.find(rightSD => recordCoverageAreEqual(rightSD.coverage, leftSD.coverage)) !== undefined;
    } else if (leftSD.resourceType === 'http://gedcomx.org/DigitalArtifact') {
      return right.map(rightSD => JSON.stringify(rightSD)).includes(JSON.stringify(leftSD));
    } else {
      return false;
    }
  });
}

// function getRecordSourceDescriptions(sourceDescriptions, center) {
//   const stringifiedCenter = center.map(centerSD => centerSD.resourceType === 'http://gedcomx.org/Record' ? JSON.stringify(centerSD.coverage) : JSON.stringify(centerSD));
//   const stringifiedSourceDescriptions = sourceDescriptions.map(sd => sd.resourceType === 'http://gedcomx.org/Record' ? JSON.stringify(sd.coverage) : JSON.stringify(sd));
//   return sourceDescriptions.filter((sd, idx) => !stringifiedCenter.includes(stringifiedSourceDescriptions[idx]));
// }

// function getDigitalArtifactDisplay(sourceDescription, index) {
//   if (sourceDescription.resourceType === 'http://gedcomx.org/DigitalArtifact') {
//     return (
//       <Paper key={`final-sourceDescription-${index}`} sx={{marginY: 1}}>
//         <ListItem>
//           <ListItemText primary={sourceDescription.about} secondary={'DigitalArtifact'}/>
//         </ListItem>
//       </Paper>
//     );
//   } else if (sourceDescription.resourceType === 'http://gedcomx.org/Record') {
//     return sourceDescription.coverage.map((singleCoverage, idx) => getCoverageDisplay(singleCoverage, idx));
//   }
// }

// function getCoverageDisplay(coverageObj, index) {
//   let typeString;
//   let temporalString;
//   let spatialString;
//
//   if (coverageObj.recordType) {
//     typeString = coverageObj.recordType;
//   }
//   if (coverageObj.temporal && coverageObj.temporal.original) {
//     temporalString = coverageObj.temporal.original;
//   }
//   if (coverageObj.spatial && coverageObj.spatial.original) {
//     spatialString = coverageObj.spatial.original;
//   }
//
//   return (
//     <Paper key={`coverage-${index}`} sx={{marginY: 1}}>
//       <ListItem key={`coverage-${index}-type`}>
//         <ListItemText primary={typeString} secondary={'Record Type'}/>
//       </ListItem>
//       <ListItem key={`coverage-${index}-temporal`}>
//         <ListItemText primary={temporalString} secondary={'Temporal'}/>
//       </ListItem>
//       <ListItem key={`coverage-${index}-spatial`}>
//         <ListItemText primary={spatialString} secondary={'Spatial'}/>
//       </ListItem>
//     </Paper>
//   )
// }

function getSourceDescriptionItem(sourceDescription, idx) {
  if (sourceDescription.resourceType === 'http://gedcomx.org/DigitalArtifact') {
    return <ListItemText key={`sourceDescription-${idx}`} primary={sourceDescription.about} secondary={'DigitalArtifact'}/>;
  }
  else if (sourceDescription.resourceType === 'http://gedcomx.org/Record') {
    return <EditableRecordSourceDescription
      key={`sourceDescription-${idx}`}
      recordSourceDescription={sourceDescription}
      sourceDescriptionIndex={idx}
    />;
  }
  else {
    return <Box key={`unknown-sd-${idx}`}>{`Source description of unhandled type: ${sourceDescription.resourceType}`}</Box>;
  }
}

// Comparing sourceDescriptions of type Record (just comparing the coverage elements)
export default function SourceDescriptionsDiff({leftGx, setLeftGx, rightGx, setRightGx, finalGx, setFinalGx}) {
  const left = leftGx.sourceDescriptions;
  const right = rightGx.sourceDescriptions;

  return (
    <Grid container alignItems={'flex-start'} justifyContent={'center'}>
      <Grid item xs={6}>
        <RecordsDataContext.Provider value={leftRecordsData(leftGx, setLeftGx, rightGx, setRightGx, finalGx, setFinalGx)}>
          {left.map((sourceDescription, idx) => getSourceDescriptionItem(sourceDescription, idx))}
        </RecordsDataContext.Provider>
      </Grid>
      <Grid item xs={6}>
        <RecordsDataContext.Provider value={rightRecordsData(leftGx, setLeftGx, rightGx, setRightGx, finalGx, setFinalGx)}>
          {right.map((sourceDescription, idx) => getSourceDescriptionItem(sourceDescription, idx))}
        </RecordsDataContext.Provider>
      </Grid>
    </Grid>
  );
}