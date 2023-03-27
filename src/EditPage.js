import {useContext, useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import FileUpload from "./FileUpload";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './MainPage.css';
import PersonsDiff, {getPersonsIntersection} from "./persons-diff/PersonsDiff";
import SourceDescriptionsDiff, {getRecordDataIntersection} from "./sourceDescriptions-diff/SourceDescriptionsDiff";
import RelationshipsDiff, {getRelationshipsIntersection} from "./relationships-diff/RelationshipsDiff";
import FieldsDiff, {getFieldsIntersection} from "./fields-diff/FieldsDiff";
import {EMPTY_GEDCOMX} from "./constants";
import DocumentsDiff, {getDocumentsIntersection} from "./documents-diff/DocumentsDiff";
import GraphView from "./GraphView";
import {FileDrop} from "react-file-drop";
import {gx1} from './gx-1';
import {gx2} from './gx-2';
import {factIsEmpty} from "./persons-diff/EditableFactAttribute";
import {AssertionsContext} from "./AssertionsContext";

const RootContainer = styled('div')(({ theme }) => ({
  margin: theme.spacing(1),
  paddingTop: theme.spacing(2)
}));
const ItemContainer = styled('div')(({ theme }) => ({
  margin: theme.spacing(1)
}));

const CACHE_KEY = 'gedcomx-differ-data';

export function getGxIntersection(leftGx, rightGx, assertions) {
  const personsIntersection = getPersonsIntersection(leftGx.persons, rightGx.persons);
  const relationshipsIntersection = getRelationshipsIntersection(leftGx.relationships, rightGx.relationships, leftGx.persons, rightGx.persons, assertions);
  const recordDataIntersection = getRecordDataIntersection(leftGx.sourceDescriptions, rightGx.sourceDescriptions);
  const fieldsIntersection = getFieldsIntersection(leftGx.fields, rightGx.fields);
  const documentsIntersection = getDocumentsIntersection(leftGx.documents, rightGx.documents);
  return {
    id: leftGx.id,
    attribution: {
      contributor: {resource: 'fs:AutomatedContentExtraction'},
      created: new Date().toDateString(),
    },
    description: leftGx.description,
    persons: personsIntersection,
    relationships: relationshipsIntersection,
    sourceDescriptions: recordDataIntersection,
    fields: fieldsIntersection,
    documents: documentsIntersection
  };
}

export const leftRecordsData = (leftGx, setLeftGx, rightGx, setRightGx, finalGx, setFinalGx) => {
  return {
    gx: leftGx,
    setGx: setLeftGx,
    comparingToGx: rightGx,
    setComparingToGx: setRightGx,
    finalGx: finalGx,
    setFinalGx: setFinalGx
  };
};
export const rightRecordsData = (leftGx, setLeftGx, rightGx, setRightGx, finalGx, setFinalGx) => {
  return {
    gx: rightGx,
    setGx: setRightGx,
    comparingToGx: leftGx,
    setComparingToGx: setLeftGx,
    finalGx: finalGx,
    setFinalGx: setFinalGx
  }
};

function normalizeGedcomx(gx) {
  function removeEmptyFactKeysOrFacts(fact) {
    Object.keys(fact).forEach(key => {
      if (fact[key] === null || fact[key] === undefined || fact[key].length === 0) {
        delete fact[key];
      }
    });
  }

  try {
    gx?.persons?.forEach((person, personIndex) => {
      person.facts?.forEach((fact, factIndex) => {
        removeEmptyFactKeysOrFacts(fact);
        if (factIsEmpty(fact)) {
          gx.persons[personIndex].facts.splice(factIndex, 1);
        }
      });
    });
    gx?.relationships?.forEach((relationship, relationshipIndex) => {
      relationship.facts?.forEach((fact, factIndex) => {
        removeEmptyFactKeysOrFacts(fact, factIndex, relationshipIndex);
        if (factIsEmpty(fact)) {
          gx.relationships[relationshipIndex].facts.splice(factIndex, 1);
        }
      });
    });
  } catch (error) {
    console.error("There was a problem normalizing the GedcomX during load.", error);
  }
  return gx;
}

export default function EditPage() {
  const assertionsContext = useContext(AssertionsContext);
  const [assertions, setAssertions] = useState(assertionsContext.assertions);
  const cachedData = localStorage.getItem(CACHE_KEY) ? JSON.parse(localStorage.getItem(CACHE_KEY)) : null;

  const [leftGxOriginal, setLeftGxOriginal] = useState(cachedData ? cachedData.leftGxOriginal : EMPTY_GEDCOMX);
  const [rightGxOriginal, setRightGxOriginal] = useState(cachedData ? cachedData.rightGxOriginal : EMPTY_GEDCOMX);
  const [leftGx, setLeftGx] = useState(cachedData ? cachedData.leftGx : EMPTY_GEDCOMX);
  const [rightGx, setRightGx] = useState(cachedData ? cachedData.rightGx : EMPTY_GEDCOMX);
  const [finalGx, setFinalGx] = useState(getGxIntersection(leftGx, rightGx, assertions));
  const [leftFilename, setLeftFilename] = useState(cachedData ? cachedData.leftFilename : '');
  const [rightFilename, setRightFilename] = useState(cachedData ? cachedData.rightFilename : '');

  const [leftTab, setLeftTab] = useState(0);
  const [rightTab, setRightTab] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        leftGxOriginal: leftGxOriginal, rightGxOriginal: rightGxOriginal,
        leftGx: leftGx, rightGx: rightGx, finalGx: finalGx, leftFilename: leftFilename, rightFilename: rightFilename}));
    } catch (error) {
      console.error(`Error caching data: ${error}`);
    }
  }, [leftGx, rightGx, finalGx, leftFilename, rightFilename, leftGxOriginal, rightGxOriginal]);

  async function onFileUpload(files) {
    if (!files || files.length > 2) {
      console.log('Problem with file(s), or too many files (2 max)');
    }
    else {
      if (files.length === 2) {
        let leftGxObject = JSON.parse(await files[0].fileObj.text());
        leftGxObject = leftGxObject.records ? leftGxObject.records[0] : leftGxObject;
        leftGxObject = normalizeGedcomx(leftGxObject);
        let rightGxObject = JSON.parse(await files[1].fileObj.text());
        rightGxObject = rightGxObject.records ? rightGxObject.records[0] : rightGxObject;
        rightGxObject = normalizeGedcomx(rightGxObject);
        setLeftFilename(files[0].name);
        setRightFilename(files[1].name);

        setLeftGx(leftGxObject);
        setRightGx(rightGxObject);
        setLeftGxOriginal(structuredClone(leftGxObject));
        setRightGxOriginal(structuredClone(rightGxObject));
        setFinalGx(getGxIntersection(leftGxObject, rightGxObject, assertions));
      }
      else if (files.length === 1) {
        if (leftGx === EMPTY_GEDCOMX) {
          let leftGxObject = JSON.parse(await files[0].fileObj.text());
          leftGxObject = leftGxObject.records ? leftGxObject.records[0] : leftGxObject;
          setLeftGx(leftGxObject);
          setLeftGxOriginal(structuredClone(leftGxObject));
          setLeftFilename(files[0].name);
        }
        else {
          let rightGxObject = JSON.parse(await files[0].fileObj.text());
          rightGxObject = rightGxObject.records ? rightGxObject.records[0] : rightGxObject;
          setRightFilename(files[0].name);
          setRightGx(rightGxObject);
          setRightGxOriginal(structuredClone(rightGxObject));
          setFinalGx(getGxIntersection(leftGx, rightGxObject, assertions));
        }
      }
    }
  }

  async function handleRightFileDrop(files, setRightGx) {
    let droppedGxObject = null;
    if (!files || files.length > 1) {
      console.log('Problem reading file, or too many files (max 1)');
    }
    else {
      droppedGxObject = JSON.parse(await files[0].text());
      droppedGxObject = droppedGxObject.records ? droppedGxObject.records[0] : droppedGxObject;
      setRightGx(droppedGxObject);
      setRightGxOriginal(droppedGxObject);
      setRightFilename(files[0].name);
    }
    if (leftGx !== EMPTY_GEDCOMX && rightGx !== EMPTY_GEDCOMX) {
      setFinalGx(getGxIntersection(leftGx, droppedGxObject, assertions));
    }
  }

  async function handleLeftFileDrop(files, setLeftGx) {
    let droppedGxObject = null;
    if (!files || files.length > 1) {
      console.log('Problem reading file, or too many files (max 1)');
    }
    else {
      droppedGxObject = JSON.parse(await files[0].text());
      droppedGxObject = droppedGxObject.records ? droppedGxObject.records[0] : droppedGxObject;
      setLeftGx(droppedGxObject);
      setLeftGxOriginal(droppedGxObject);
      setLeftFilename(files[0].name);
    }
    if (leftGx !== EMPTY_GEDCOMX && rightGx !== EMPTY_GEDCOMX) {
      setFinalGx(getGxIntersection(droppedGxObject, rightGx, assertions));
    }
  }

  function handleDownload(gx, suffix) {
    const downloadLink = document.createElement('a');
    const filename = `${leftFilename.substring(0, leftFilename.indexOf('.'))}.${suffix}.json`
    downloadLink.setAttribute('download', filename);
    const blob = new Blob([JSON.stringify(gx)], { type: 'application/json' });
    downloadLink.href = window.URL.createObjectURL(blob);
    document.body.appendChild(downloadLink);

    window.requestAnimationFrame(() => {
      downloadLink.dispatchEvent(new MouseEvent('click'));
      document.body.removeChild(downloadLink);
    })
  }

  function handleClearData() {
    setLeftGx(EMPTY_GEDCOMX);
    setRightGx(EMPTY_GEDCOMX);
    setLeftGxOriginal(EMPTY_GEDCOMX);
    setRightGxOriginal(EMPTY_GEDCOMX);
    setFinalGx(getGxIntersection(EMPTY_GEDCOMX, EMPTY_GEDCOMX, assertions));
    setLeftFilename('');
    setRightFilename('');
  }

  function handleLoadExample() {
    setLeftGx(gx1);
    setRightGx(gx2);
    setLeftGxOriginal(gx1);
    setRightGxOriginal(gx2);
    setLeftFilename('left-example');
    setRightFilename('right-example');
  }

  return (
    <RootContainer sx={{background: 'white', marginX: 2, overflowX: 'hidden'}}>
      <FileDrop className='left-file-drop' onDrop={files => handleLeftFileDrop(files, setLeftGx)}>
        Drop File Here
      </FileDrop>
      <FileDrop className='right-file-drop' onDrop={files => handleRightFileDrop(files, setRightGx)}>
        Drop File Here
      </FileDrop>
      <Paper>
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{padding: 2}}>
          <Stack spacing={2}>
            <Typography variant='h6'>Input Options</Typography>
            <Stack direction='row' spacing={4} alignItems='center'>
              <FileUpload onChange={onFileUpload} allowedExtensions={['.json']}/>
              <Button onClick={handleClearData} variant='contained' color='secondary'>Clear Data</Button>
            </Stack>
            <PasteInputButtons
              setLeftGx={setLeftGx}
              setRightGx={setRightGx}
              setLeftGxOriginal={setLeftGxOriginal}
              setRightGxOriginal={setRightGxOriginal}
              setLeftFilename={setLeftFilename}
              setRightFilename={setRightFilename}
            />
            <Button onClick={handleLoadExample} variant='outlined' color='secondary'>Load Example</Button>
          </Stack>
          <FormGroup>
            <Typography variant='h6'>Diff Options</Typography>
            <FormControlLabel control={<Checkbox checked={assertions.fullText} onChange={event => setAssertions({...assertions, fullText: event.target.checked})}/>} label='Assert Name fullText (off for ACE/SLS GedcomX comparison)'/>
            <FormControlLabel control={<Checkbox checked={assertions.nameType} onChange={event => setAssertions({...assertions, nameType: event.target.checked})}/>} label='Assert Name type (off for ACE/SLS GedcomX comparison)'/>
          </FormGroup>
        </Stack>
      </Paper>
      <Stack spacing={1}>
        <ItemContainer>
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6'>{leftFilename}</Typography>
            <Typography variant='h6'>{rightFilename}</Typography>
          </Stack>
        </ItemContainer>
        <AssertionsContext.Provider value={{assertions: assertions, setAssertions: setAssertions}}>
          <ItemContainer>
            <DiffAccordion
              defaultExpanded={true}
              title={'Record Data'}
              component={<SourceDescriptionsDiff leftGx={leftGx} rightGx={rightGx} setLeftGx={setLeftGx} setRightGx={setRightGx} finalGx={finalGx} setFinalGx={setFinalGx}/>}
            />
          </ItemContainer>
          <ItemContainer>
            <DiffAccordion
              defaultExpanded={true}
              title='Record Fields'
              component={<FieldsDiff leftGx={leftGx} rightGx={rightGx} setLeftGx={setLeftGx} setRightGx={setRightGx} finalGx={finalGx} setFinalGx={setFinalGx}/>}
            />
          </ItemContainer>
          <ItemContainer>
            <DiffAccordion
              defaultExpanded={true}
              title='Persons'
              component={<PersonsDiff leftGx={leftGx} rightGx={rightGx} setLeftGx={setLeftGx} setRightGx={setRightGx} finalGx={finalGx} setFinalGx={setFinalGx}/>}
            />
          </ItemContainer>
          <ItemContainer>
            <DiffAccordion
              defaultExpanded={true}
              title='Relationships'
              component={<RelationshipsDiff leftGx={leftGx} rightGx={rightGx} setLeftGx={setLeftGx} setRightGx={setRightGx} finalGx={finalGx} setFinalGx={setFinalGx}/>}
            />
          </ItemContainer>
          <ItemContainer>
            <DiffAccordion
              defaultExpanded={true}
              title='Documents'
              component={<DocumentsDiff leftGx={leftGx} rightGx={rightGx} setLeftGx={setLeftGx} setRightGx={setRightGx} finalGx={finalGx} setFinalGx={setFinalGx}/>}
            />
          </ItemContainer>
        </AssertionsContext.Provider>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Tabs value={leftTab} onChange={(event, newValue) => setLeftTab(newValue)}>
              <Tab label='Original'/>
              <Tab label='Edited'/>
            </Tabs>
            <Box hidden={leftTab !== 0}>
              <Typography variant='h5'>Original: {leftFilename}</Typography>
              <GraphView gx={leftGxOriginal}/>
            </Box>
            <Box hidden={leftTab !== 1}>
              <Typography variant='h5'>Edited: {leftFilename}</Typography>
              <GraphView gx={leftGx}/>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{marginTop: 10}}>
              <Typography variant='h5'>Final GedcomX</Typography>
              <GraphView gx={finalGx}/>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Tabs value={rightTab} onChange={(event, newValue) => setRightTab(newValue)}>
              <Tab label='Original'/>
              <Tab label='Edited'/>
            </Tabs>
            <Box hidden={rightTab !== 0}>
              <Typography variant='h5'>Original: {rightFilename}</Typography>
              <GraphView gx={rightGxOriginal}/>
            </Box>
            <Box hidden={rightTab !== 1}>
              <Typography variant='h5'>Edited: {rightFilename}</Typography>
              <GraphView gx={rightGx}/>
            </Box>
          </Grid>
        </Grid>
        <Stack spacing={2} justifyContent='space-around' sx={{marginY: 2}} direction='row'>
          <Button variant='contained' size='large' color='secondary' onClick={() => handleDownload(leftGx, 'left.edit')}>Download Left In-Progress Record</Button>
          <Button variant='contained' size='large' onClick={() => handleDownload(finalGx, 'final')}>Download Final GedcomX Record</Button>
          <Button variant='contained' size='large' color='secondary' onClick={() => handleDownload(rightGx, 'right.edit')}>Download Right In-Progress Record</Button>
        </Stack>
      </Stack>
    </RootContainer>
  )
}

function DiffAccordion({defaultExpanded, title, component}) {
  return (
    <Accordion variant='outlined' defaultExpanded={defaultExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant={'h5'}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {component}
      </AccordionDetails>
    </Accordion>
  );
}

function PasteInputButtons({setLeftGx, setLeftGxOriginal, setRightGx, setRightGxOriginal, setLeftFilename, setRightFilename}) {
  function pasteButton(setters, label) {
    return (
      <Tooltip title={'Click to paste GedcomX from your clipboard'}>
        <Button
          color='secondary'
          variant='outlined'
          onClick={async () => {
            try {
              const gxText = await navigator.clipboard.readText();
              if (!(gxText.startsWith("{") || gxText.startsWith("["))) {
                return Promise.reject("Clipboard data is not valid JSON");
              }
              const gx = JSON.parse(gxText);
              setters.setGx(gx);
              setters.setGxOriginal(gx);
              setters.setFilename('Pasted GedcomX');
            } catch (error) {
              console.error("Problem reading clipboard data: ", error);
            }
          }}
        >
          {label}
        </Button>
      </Tooltip>
    );

  }

  const leftSetters = {setGx: setLeftGx, setGxOriginal: setLeftGxOriginal, setFilename: setLeftFilename};
  const rightSetters = {setGx: setRightGx, setGxOriginal: setRightGxOriginal, setFilename: setRightFilename};

  return (
    <Stack direction='row' justifyContent='space-between' alignItems='center'>
      {pasteButton(leftSetters, 'Paste Left GedcomX')}
      {pasteButton(rightSetters, 'Paste Right GedcomX')}
    </Stack>
  );
}
