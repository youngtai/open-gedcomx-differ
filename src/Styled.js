import {Paper} from "@mui/material";
import Draggable from "react-draggable";
import {styled} from "@mui/material/styles";

export function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export const RootContainer = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(4),
  marginRight: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));
