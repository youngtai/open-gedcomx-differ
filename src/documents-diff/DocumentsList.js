import {List} from "@mui/material";
import EditableDocument from "./EditableDocument";

export default function DocumentsList({documents}) {
  return (
    <List dense component='div'>
      {documents.map((document, index) => <EditableDocument key={`document-${index}`} document={document} documentIndex={index}/>)}
    </List>
  );
}