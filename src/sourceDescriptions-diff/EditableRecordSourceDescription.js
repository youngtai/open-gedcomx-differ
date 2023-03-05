import React from "react";
import {List} from "@mui/material";
import EditableCoverageData from "./EditableCoverageData";

export default function EditableRecordSourceDescription({recordSourceDescription, sourceDescriptionIndex}) {
  const coverages = recordSourceDescription?.coverage ? recordSourceDescription.coverage : [];

  return (
    <List dense>
      {coverages.map((coverage, idx) => <EditableCoverageData
        key={`coverage-data-${idx}`}
        coverage={coverage}
        coverageIndex={idx}
        sourceDescriptionIndex={sourceDescriptionIndex}
      />)}
    </List>
  );
}