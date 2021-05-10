import { LinearProgress } from "@material-ui/core";
import { GridOverlay } from "@material-ui/data-grid";
import React from "react";

export default function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}
