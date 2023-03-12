import {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import FileUpload from "./FileUpload";
import {Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Stack, Tab, Tabs, Typography} from "@mui/material";
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

const RootContainer = styled('div')(({ theme }) => ({
  margin: theme.spacing(1),
  paddingTop: theme.spacing(2)
}));
const ItemContainer = styled('div')(({ theme }) => ({
  margin: theme.spacing(1)
}));

const CACHE_KEY = 'gedcomx-differ-data';

export function getGxIntersection(leftGx, rightGx) {
  const personsIntersection = getPersonsIntersection(leftGx.persons, rightGx.persons);
  const relationshipsIntersection = getRelationshipsIntersection(leftGx.relationships, rightGx.relationships, leftGx.persons, rightGx.persons);
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

export default function EditPage() {
  const cachedData = localStorage.getItem(CACHE_KEY) ? JSON.parse(localStorage.getItem(CACHE_KEY)) : null;

  const [leftGxOriginal, setLeftGxOriginal] = useState(cachedData ? cachedData.leftGxOriginal : EMPTY_GEDCOMX);
  const [rightGxOriginal, setRightGxOriginal] = useState(cachedData ? cachedData.rightGxOriginal : EMPTY_GEDCOMX);
  const [leftGx, setLeftGx] = useState(cachedData ? cachedData.leftGx : EMPTY_GEDCOMX);
  const [rightGx, setRightGx] = useState(cachedData ? cachedData.rightGx : EMPTY_GEDCOMX);
  const [finalGx, setFinalGx] = useState(getGxIntersection(leftGx, rightGx));
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
        let rightGxObject = JSON.parse(await files[1].fileObj.text());
        rightGxObject = rightGxObject.records ? rightGxObject.records[0] : rightGxObject;
        setLeftFilename(files[0].name);
        setRightFilename(files[1].name);

        setLeftGx(leftGxObject);
        setRightGx(rightGxObject);
        setLeftGxOriginal(structuredClone(leftGxObject));
        setRightGxOriginal(structuredClone(rightGxObject));
        setFinalGx(getGxIntersection(leftGxObject, rightGxObject));
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
          setFinalGx(getGxIntersection(leftGx, rightGxObject));
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
      setFinalGx(getGxIntersection(leftGx, droppedGxObject));
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
      setFinalGx(getGxIntersection(droppedGxObject, rightGx));
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
    setFinalGx(getGxIntersection(EMPTY_GEDCOMX, EMPTY_GEDCOMX));
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
    <RootContainer sx={{background: 'white'}}>
      <FileDrop className='left-file-drop' onDrop={files => handleLeftFileDrop(files, setLeftGx)}>
        Drop File Here
      </FileDrop>
      <FileDrop className='right-file-drop' onDrop={files => handleRightFileDrop(files, setRightGx)}>
        Drop File Here
      </FileDrop>
      <Grid container direction='column' spacing={1}>
        <Grid item>
          <ItemContainer>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Typography variant='h6'>{leftFilename}</Typography>
              <FileUpload onChange={onFileUpload} allowedExtensions={['.json']}/>
              <Button onClick={handleClearData} variant='contained' color='secondary'>Clear Data</Button>
              <Button onClick={handleLoadExample} variant='outlined' color='secondary'>Load Example</Button>
              <Typography variant='h6'>{rightFilename}</Typography>
            </Stack>
          </ItemContainer>
        </Grid>
        <Grid item>
          <ItemContainer>
            <Accordion variant='outlined' defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant={'h5'}>Record Data</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SourceDescriptionsDiff leftGx={leftGx} rightGx={rightGx} setLeftGx={setLeftGx} setRightGx={setRightGx} finalGx={finalGx} setFinalGx={setFinalGx}/>
              </AccordionDetails>
            </Accordion>
          </ItemContainer>
        </Grid>
        <Grid item>
          <ItemContainer>
            <Accordion variant='outlined' defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant={'h5'}>Record Fields</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FieldsDiff leftGx={leftGx} rightGx={rightGx} setLeftGx={setLeftGx} setRightGx={setRightGx} finalGx={finalGx} setFinalGx={setFinalGx}/>
              </AccordionDetails>
            </Accordion>
          </ItemContainer>
        </Grid>
        <Grid item>
          <ItemContainer>
            <Accordion variant='outlined' defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant='h5'>Persons</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PersonsDiff leftGx={leftGx} rightGx={rightGx} setLeftGx={setLeftGx} setRightGx={setRightGx} finalGx={finalGx} setFinalGx={setFinalGx}/>
              </AccordionDetails>
            </Accordion>
          </ItemContainer>
        </Grid>
        <Grid item>
          <ItemContainer>
            <Accordion variant='outlined' defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant={'h5'}>Relationships</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RelationshipsDiff leftGx={leftGx} rightGx={rightGx} setLeftGx={setLeftGx} setRightGx={setRightGx} finalGx={finalGx} setFinalGx={setFinalGx}/>
              </AccordionDetails>
            </Accordion>
          </ItemContainer>
        </Grid>
        <Grid item>
          <ItemContainer>
            <Accordion variant='outlined' defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant={'h5'}>Documents</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DocumentsDiff leftGx={leftGx} rightGx={rightGx} setLeftGx={setLeftGx} setRightGx={setRightGx} finalGx={finalGx} setFinalGx={setFinalGx}/>
              </AccordionDetails>
            </Accordion>
          </ItemContainer>
        </Grid>
        <Grid item>
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
              <Typography variant='h5'>Final GedcomX</Typography>
              <GraphView gx={finalGx}/>
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
        </Grid>
        <Grid item>
          <Grid container spacing={2} justifyContent='space-around' sx={{marginY: 2}}>
            <Grid item>
              <Button variant='contained' size='large' color='secondary' onClick={() => handleDownload(leftGx, 'left.edit')}>Download Left In-Progress Record</Button>
            </Grid>
            <Grid item>
              <Button variant='contained' size='large' onClick={() => handleDownload(finalGx, 'final')}>Download Final GedcomX Record</Button>
            </Grid>
            <Grid item>
              <Button variant='contained' size='large' color='secondary' onClick={() => handleDownload(rightGx, 'right.edit')}>Download Right In-Progress Record</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </RootContainer>
  )
}
