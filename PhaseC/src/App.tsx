import React from "react";
import { useSelector } from "react-redux";
import { ApplicationState } from "./store";
import Grid from "./components/grid";
import TopBar from "./components/topBar";
import { purple } from "@mui/material/colors";
import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            // Purple and green play nicely together.
            main: purple[500],
        },
        secondary: {
            // This is green.A700 as hex.
            main: "#11cb5f",
        },
    },
});

function App() {
    const grid = useSelector((state: ApplicationState) => state.grid);
    return (
        <div>
            <TopBar />
            <Grid />
            {JSON.stringify(grid.grid)}
            <div>COLUMNS: {grid.columns}</div>
            <div>ROWS: {grid.rows}</div>
            {JSON.stringify(grid.redoStack)}
        </div>
    );
}

export default App;
