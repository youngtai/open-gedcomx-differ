import {useEffect, useRef} from "react";
import {findDOMNode} from "react-dom";
import {Box} from "@mui/material";

export default function GraphView({gx}) {
  const gxRef = useRef();

  useEffect(() => {
    if (gx) {
      const graph = new window.RelationshipGraph(gx);
      new window.RelChartBuilder(graph, window.$(findDOMNode(gxRef.current)), new window.ChartOptions({ shouldShowConfidence: false, shouldDisplayIds: false })).buildChart();
    }
  });

  return (
    <Box sx={{position: 'relative', height: 'auto', overflowX: 'auto', margin: 2}}>
      <div ref={gxRef}/>
    </Box>
  );
}
